import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { buildDebugMessage, type DebugContext } from "@/lib/default-prompts";
import { getUserPrompt } from "@/lib/prompts/get-system-prompt";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/ai/debug-help
 * AI调试助手 - 分析代码错误并给出渐进式提示
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { submissionId, userMessage } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "缺少提交ID" },
        { status: 400 }
      );
    }

    // 获取提交记录
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        problem: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "提交记录不存在" },
        { status: 404 }
      );
    }

    // 验证提交属于当前用户
    if (submission.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权访问此提交" },
        { status: 403 }
      );
    }

    // 验证是否为错误状态（WA/RE/TLE/MLE/CE）
    const errorStatuses = ["wrong_answer", "runtime_error", "time_limit", "memory_limit", "compile_error"];
    if (!errorStatuses.includes(submission.status)) {
      return NextResponse.json(
        { error: "只能对错误的提交请求AI帮助" },
        { status: 400 }
      );
    }

    // 获取用户的AI配置
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { aiDebugPrompt: true },
    });

    const systemPrompt = await getUserPrompt("problem-debug", user?.aiDebugPrompt);

    // 解析测试结果
    const testResults = submission.testResults as any[];
    const totalTests = testResults?.length || 0;
    const passedTests = testResults?.filter((test: any) => test.passed).length || 0;

    // 找出失败的测试点（保留原始索引）
    const failedTests = testResults
      ?.map((test: any, originalIndex: number) => ({
        test,
        originalIndex,
      }))
      .filter(({ test }) => !test.passed)
      .map(({ test, originalIndex }) => ({
        testIndex: originalIndex + 1, // 使用原始测试点编号
        input: test.input || "",
        expectedOutput: test.expectedOutput || "",
        actualOutput: test.actualOutput || test.error || "（无输出）",
      })) || [];

    // 获取之前的对话历史，并向后兼容旧格式
    const rawConversations = (submission.aiConversations as any[]) || [];
    const previousConversations = rawConversations.map((conv: any) => {
      // 向后兼容：旧格式有 aiResponse 但没有 role
      if (conv.aiResponse && !conv.role) {
        return {
          role: "ai" as const,
          content: conv.aiResponse,
          promptLevel: conv.promptLevel,
          timestamp: conv.timestamp,
        };
      }
      return conv;
    });

    const isFollowUp = !!userMessage?.trim();
    const helpCount = isFollowUp ? submission.aiHelpCount : submission.aiHelpCount + 1;

    // 解析题目的样例（如果有）
    const samples = submission.problem.samples
      ? (submission.problem.samples as any[]).map((s: any) => ({
          input: s.input || "",
          output: s.output || "",
          explanation: s.explanation || undefined,
        }))
      : undefined;

    // 构建调试上下文（用于递进提示 或 自由对话的上下文消息）
    const debugContext: DebugContext = {
      problemTitle: submission.problem.title,
      problemDescription: submission.problem.description,
      inputFormat: submission.problem.inputFormat || undefined,
      outputFormat: submission.problem.outputFormat || undefined,
      samples,
      hint: submission.problem.hint || undefined,
      studentCode: submission.code,
      verdict: submission.status,
      compileOutput: submission.compileOutput || undefined,
      failedTests: failedTests.slice(0, 3), // 最多显示3个失败的测试点
      totalTests,
      passedTests,
      helpCount,
      previousConversations: isFollowUp ? [] : previousConversations, // 自由对话用 messages 数组传历史
    };

    const debugContextMessage = buildDebugMessage(debugContext);

    let aiResponse: string;

    if (isFollowUp) {
      // === 自由对话模式 ===
      console.log(`💬 AI自由对话：用户=${session.user.id}, 题目=${submission.problem.title}`);

      // 构建多轮对话 messages 数组
      const messages: Array<{ role: "user" | "assistant"; content: string }> = [
        { role: "user", content: debugContextMessage },  // 题目+代码上下文
      ];

      // 追加之前的对话历史
      for (const conv of previousConversations) {
        messages.push({
          role: conv.role === "ai" ? "assistant" : "user",
          content: conv.content,
        });
      }

      // 本次用户追问
      messages.push({ role: "user", content: userMessage.trim() });

      const message = await anthropic.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 1500,
        system: systemPrompt,
        messages,
      });

      aiResponse = message.content[0].type === "text"
        ? message.content[0].text
        : "无法生成回复";

      // 追加用户消息和 AI 回复到对话历史
      const now = new Date().toISOString();
      const updatedConversations = [
        ...previousConversations,
        { role: "user", content: userMessage.trim(), timestamp: now },
        { role: "ai", content: aiResponse, timestamp: now },
      ];

      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          aiConversations: updatedConversations,
        },
      });

      console.log(`✅ 自由对话完成`);

      return NextResponse.json({
        success: true,
        aiResponse,
        helpCount,
        isFollowUp: true,
      });
    } else {
      // === 递进提示模式（原有逻辑） ===
      console.log(`🤖 AI调试助手：用户=${session.user.id}, 题目=${submission.problem.title}, 第${helpCount}次请求`);

      const message = await anthropic.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 1500,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: debugContextMessage,
          },
        ],
      });

      console.log(`✅ AI分析完成：帮助次数=${helpCount}, 提示级别=${helpCount <= 3 ? helpCount : 3}`);

      aiResponse = message.content[0].type === "text"
        ? message.content[0].text
        : "无法生成回复";

      // 更新提交记录：增加帮助次数和对话历史
      const newConversation = {
        role: "ai" as const,
        content: aiResponse,
        promptLevel: helpCount,
        timestamp: new Date().toISOString(),
      };

      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          aiHelpCount: helpCount,
          aiConversations: [
            ...previousConversations,
            newConversation,
          ],
        },
      });

      return NextResponse.json({
        success: true,
        aiResponse,
        helpCount,
        promptLevel: helpCount <= 3 ? helpCount : 3,
      });
    }
  } catch (error: any) {
    console.error("AI debug help error:", error);

    // 处理Claude API错误
    if (error.status === 401) {
      return NextResponse.json(
        { error: "Claude API密钥未配置或无效" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "AI分析失败" },
      { status: 500 }
    );
  }
}

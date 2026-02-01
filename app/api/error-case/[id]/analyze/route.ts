import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { chat } from "@/lib/claude";
import {
  classifyErrorPrompt,
  baseSystemPrompt,
} from "@/lib/prompts/error-diagnosis";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// AI 分析错误类型
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;

    // 获取错题记录
    const errorCase = await prisma.errorCase.findUnique({
      where: { id },
      include: {
        problem: true,
        submission: true,
      },
    });

    if (!errorCase) {
      return NextResponse.json(
        { error: "错题记录不存在" },
        { status: 404 }
      );
    }

    if (errorCase.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权操作此错题记录" },
        { status: 403 }
      );
    }

    // 构建分析请求
    const { problem, submission } = errorCase;
    const testResults = submission.testResults as Array<{
      passed: boolean;
      input: string;
      expectedOutput: string;
      actualOutput: string;
    }> | null;

    // 找到失败的测试用例
    const failedTests = testResults?.filter((t) => !t.passed) || [];
    const failedTestsInfo = failedTests.slice(0, 3).map((t, i) =>
      `测试用例${i + 1}：
输入：${t.input}
预期输出：${t.expectedOutput}
实际输出：${t.actualOutput}`
    ).join("\n\n");

    const userMessage = `**题目**
${problem.title}

**题目描述**
${problem.description}

**输入格式**
${problem.inputFormat || "无"}

**输出格式**
${problem.outputFormat || "无"}

**学生代码**
\`\`\`cpp
${submission.code}
\`\`\`

**提交状态**
${submission.status}

${submission.compileOutput ? `**编译输出**\n${submission.compileOutput}` : ""}

${submission.errorMessage ? `**错误信息**\n${submission.errorMessage}` : ""}

${failedTestsInfo ? `**失败的测试用例**\n${failedTestsInfo}` : ""}

请分析这个代码的错误类型。`;

    // 调用 Claude API 分析
    const response = await chat(
      [{ role: "user", content: userMessage }],
      `${baseSystemPrompt}\n\n${classifyErrorPrompt}`,
      1024
    );

    // 解析 AI 响应
    let aiAnalysis = null;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      }
    } catch {
      aiAnalysis = {
        type: "implementation",
        confidence: 0.5,
        evidence: "无法解析AI响应",
        summary: response,
      };
    }

    // 更新错题记录
    const updatedErrorCase = await prisma.errorCase.update({
      where: { id },
      data: {
        errorType: aiAnalysis?.type || null,
        aiAnalysis: aiAnalysis,
        status: "in_progress",
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            level: true,
            difficulty: true,
            knowledgePoints: true,
          },
        },
        submission: {
          select: {
            id: true,
            status: true,
            code: true,
            testResults: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      errorCase: updatedErrorCase,
      analysis: aiAnalysis,
    });
  } catch (error) {
    console.error("Analyze error case error:", error);
    return NextResponse.json(
      { error: "分析错误失败" },
      { status: 500 }
    );
  }
}

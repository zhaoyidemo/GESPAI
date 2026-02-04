import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  chat,
  getLearningSystemPrompt,
  getProblemSystemPrompt,
  ChatMessage,
} from "@/lib/claude";
import prisma from "@/lib/db";
import { getUserPrompt, getSystemPrompt } from "@/lib/prompts/get-system-prompt";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { messages, context, knowledgePoint, problemId, requestEvaluation } = body as {
      messages: ChatMessage[];
      context: "learn" | "problem" | "feynman" | "general";
      knowledgePoint?: string;
      problemId?: string;
      requestEvaluation?: boolean;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "消息不能为空" }, { status: 400 });
    }

    // 获取用户信息和自定义提示词
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        targetLevel: true,
        aiTutorPrompt: true,
        aiProblemPrompt: true,
        aiFeynmanPrompt: true,
      },
    });

    // 根据上下文确定系统提示词
    let systemPrompt: string;

    if (context === "learn" && knowledgePoint) {
      // AI 私教模式 - 使用用户自定义或默认提示词
      const basePrompt = await getUserPrompt("tutor", user?.aiTutorPrompt);
      systemPrompt = `${basePrompt}

当前正在学习的知识点：${knowledgePoint}
目标级别：GESP ${user?.targetLevel || 5}级`;
    } else if (context === "feynman" && knowledgePoint) {
      // 费曼学习模式 - 用户作为老师讲解
      let basePrompt = await getUserPrompt("feynman", user?.aiFeynmanPrompt);

      // 如果请求评估，添加评估指令
      if (requestEvaluation) {
        basePrompt += `

---
【重要】用户现在请求结束讲解，请根据之前的对话，给出详细的学习评估：
1. **完整度评估**：讲解是否覆盖了该知识点的主要内容
2. **准确度评估**：讲解内容是否正确，有哪些错误或不准确的地方
3. **清晰度评估**：表达是否易懂，逻辑是否清晰
4. **薄弱点分析**：哪些地方讲得不够清楚或需要加强
5. **总结鼓励**：肯定做得好的地方，给出学习建议

请用友好、鼓励的语气给出评估，格式清晰，使用emoji增加亲和力。`;
      }

      systemPrompt = `${basePrompt}

当前要讲解的知识点：${knowledgePoint}`;
    } else if (context === "problem" && problemId) {
      // 获取题目信息
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: { title: true, description: true },
      });

      if (!problem) {
        return NextResponse.json({ error: "题目不存在" }, { status: 404 });
      }

      // 使用用户自定义或默认的题目辅导提示词
      const basePrompt = await getUserPrompt("problem", user?.aiProblemPrompt);
      systemPrompt = `${basePrompt}

当前题目：${problem.title}
题目描述：${problem.description}`;
    } else {
      // 通用对话
      systemPrompt = await getSystemPrompt("tutor");
    }

    // 调用 Claude API
    const response = await chat(messages, systemPrompt);

    // 保存对话历史
    const contextKey = context === "learn"
      ? `learn_${knowledgePoint}`
      : context === "feynman"
      ? `feynman_${knowledgePoint}`
      : context === "problem"
      ? `problem_${problemId}`
      : "general";

    await prisma.chatHistory.upsert({
      where: {
        id: `${session.user.id}_${contextKey}`,
      },
      update: {
        messages: [...messages, { role: "assistant", content: response }],
        updatedAt: new Date(),
      },
      create: {
        id: `${session.user.id}_${contextKey}`,
        userId: session.user.id,
        context: contextKey,
        messages: [...messages, { role: "assistant", content: response }],
      },
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "AI 回复失败，请稍后重试" },
      { status: 500 }
    );
  }
}

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { messages, context, knowledgePoint, problemId } = body as {
      messages: ChatMessage[];
      context: "learn" | "problem" | "general";
      knowledgePoint?: string;
      problemId?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "消息不能为空" }, { status: 400 });
    }

    // 根据上下文确定系统提示词
    let systemPrompt: string;

    if (context === "learn" && knowledgePoint) {
      // 获取用户的目标级别
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { targetLevel: true },
      });
      systemPrompt = getLearningSystemPrompt(
        knowledgePoint,
        user?.targetLevel || 5
      );
    } else if (context === "problem" && problemId) {
      // 获取题目信息
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: { title: true, description: true },
      });

      if (!problem) {
        return NextResponse.json({ error: "题目不存在" }, { status: 404 });
      }

      systemPrompt = getProblemSystemPrompt(problem.title, problem.description);
    } else {
      // 通用对话
      systemPrompt = `你是GESP AI，一位亲切友好的编程老师，专门帮助学生学习C++编程和备考GESP考试。

使用中文回复，语气亲切、鼓励性强。适度使用emoji增加亲和力。

帮助学生解答编程问题、解释概念、提供学习建议。`;
    }

    // 调用 Claude API
    const response = await chat(messages, systemPrompt);

    // 保存对话历史
    const contextKey = context === "learn"
      ? `learn_${knowledgePoint}`
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

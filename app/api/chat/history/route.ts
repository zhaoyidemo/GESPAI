import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const context = searchParams.get("context");
  const targetId = searchParams.get("targetId");

  if (!context || !targetId) {
    return NextResponse.json(
      { error: "缺少 context 或 targetId 参数" },
      { status: 400 }
    );
  }

  const contextKey = `${context}_${targetId}`;
  const id = `${session.user.id}_${contextKey}`;

  try {
    const history = await prisma.chatHistory.findUnique({
      where: { id },
      select: { messages: true, updatedAt: true },
    });

    if (!history) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({
      messages: history.messages,
      updatedAt: history.updatedAt,
    });
  } catch (error) {
    console.error("Fetch chat history error:", error);
    return NextResponse.json(
      { error: "获取聊天记录失败" },
      { status: 500 }
    );
  }
}

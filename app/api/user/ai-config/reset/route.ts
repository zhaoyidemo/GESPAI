import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { DEFAULT_DEBUG_PROMPT } from "@/lib/default-prompts";

/**
 * POST /api/user/ai-config/reset
 * 恢复默认AI调试助手配置
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

    await prisma.user.update({
      where: { id: session.user.id },
      data: { aiDebugPrompt: null }, // 设置为null使用默认配置
    });

    return NextResponse.json({
      success: true,
      message: "已恢复默认配置",
      debugPrompt: DEFAULT_DEBUG_PROMPT,
    });
  } catch (error) {
    console.error("Reset AI config error:", error);
    return NextResponse.json(
      { error: "重置配置失败" },
      { status: 500 }
    );
  }
}

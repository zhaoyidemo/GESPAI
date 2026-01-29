import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { DEFAULT_DEBUG_PROMPT } from "@/lib/default-prompts";

/**
 * GET /api/user/ai-config
 * 获取用户的AI调试助手配置
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { aiDebugPrompt: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      debugPrompt: user.aiDebugPrompt || DEFAULT_DEBUG_PROMPT,
      isCustom: !!user.aiDebugPrompt, // 是否使用自定义提示词
    });
  } catch (error) {
    console.error("Get AI config error:", error);
    return NextResponse.json(
      { error: "获取配置失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/ai-config
 * 保存用户的AI调试助手配置
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
    const { debugPrompt } = body;

    if (typeof debugPrompt !== "string") {
      return NextResponse.json(
        { error: "提示词格式错误" },
        { status: 400 }
      );
    }

    // 验证长度（最多10000字符）
    if (debugPrompt.length > 10000) {
      return NextResponse.json(
        { error: "提示词过长，请控制在10000字以内" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { aiDebugPrompt: debugPrompt },
    });

    return NextResponse.json({
      success: true,
      message: "配置已保存",
    });
  } catch (error) {
    console.error("Save AI config error:", error);
    return NextResponse.json(
      { error: "保存配置失败" },
      { status: 500 }
    );
  }
}

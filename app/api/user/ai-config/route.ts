import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getDefaultPrompt, PromptType } from "@/lib/default-prompts";

// 数据库字段映射
const PROMPT_FIELDS: Record<PromptType, string> = {
  tutor: "aiTutorPrompt",
  problem: "aiProblemPrompt",
  debug: "aiDebugPrompt",
  feynman: "aiFeynmanPrompt",
};

/**
 * GET /api/user/ai-config
 * 获取用户的所有AI提示词配置
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
      select: {
        aiTutorPrompt: true,
        aiProblemPrompt: true,
        aiDebugPrompt: true,
        aiFeynmanPrompt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    // 返回所有提示词配置
    return NextResponse.json({
      prompts: {
        tutor: {
          value: user.aiTutorPrompt || getDefaultPrompt("tutor"),
          isCustom: !!user.aiTutorPrompt,
        },
        problem: {
          value: user.aiProblemPrompt || getDefaultPrompt("problem"),
          isCustom: !!user.aiProblemPrompt,
        },
        debug: {
          value: user.aiDebugPrompt || getDefaultPrompt("debug"),
          isCustom: !!user.aiDebugPrompt,
        },
        feynman: {
          value: user.aiFeynmanPrompt || getDefaultPrompt("feynman"),
          isCustom: !!user.aiFeynmanPrompt,
        },
      },
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
 * 保存用户的AI提示词配置
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
    const { type, prompt } = body as { type: PromptType; prompt: string };

    // 验证类型
    if (!type || !PROMPT_FIELDS[type]) {
      return NextResponse.json(
        { error: "无效的提示词类型" },
        { status: 400 }
      );
    }

    if (typeof prompt !== "string") {
      return NextResponse.json(
        { error: "提示词格式错误" },
        { status: 400 }
      );
    }

    // 验证长度（最多10000字符）
    if (prompt.length > 10000) {
      return NextResponse.json(
        { error: "提示词过长，请控制在10000字以内" },
        { status: 400 }
      );
    }

    // 更新对应的字段
    const fieldName = PROMPT_FIELDS[type];
    await prisma.user.update({
      where: { id: session.user.id },
      data: { [fieldName]: prompt },
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

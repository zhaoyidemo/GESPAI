import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";
import { PromptType } from "@/lib/default-prompts";
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt";

// 数据库字段映射
const PROMPT_FIELDS: Record<PromptType, string> = {
  "learn-chat": "aiTutorPrompt",
  "problem-chat": "aiProblemPrompt",
  "problem-debug": "aiDebugPrompt",
  "feynman-chat": "aiFeynmanPrompt",
};

/**
 * GET /api/user/ai-config
 * 获取用户的所有AI提示词配置
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

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

    // 获取系统默认提示词（数据库优先，硬编码兜底）
    const [defaultTutor, defaultProblem, defaultDebug, defaultFeynman] = await Promise.all([
      getSystemPrompt("learn-chat"),
      getSystemPrompt("problem-chat"),
      getSystemPrompt("problem-debug"),
      getSystemPrompt("feynman-chat"),
    ]);

    // 返回所有提示词配置
    return NextResponse.json({
      prompts: {
        "learn-chat": {
          value: user.aiTutorPrompt || defaultTutor,
          isCustom: !!user.aiTutorPrompt,
        },
        "problem-chat": {
          value: user.aiProblemPrompt || defaultProblem,
          isCustom: !!user.aiProblemPrompt,
        },
        "problem-debug": {
          value: user.aiDebugPrompt || defaultDebug,
          isCustom: !!user.aiDebugPrompt,
        },
        "feynman-chat": {
          value: user.aiFeynmanPrompt || defaultFeynman,
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
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

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

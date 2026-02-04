import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { PromptType } from "@/lib/default-prompts";
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt";

// 数据库字段映射
const PROMPT_FIELDS: Record<PromptType, string> = {
  tutor: "aiTutorPrompt",
  problem: "aiProblemPrompt",
  debug: "aiDebugPrompt",
  feynman: "aiFeynmanPrompt",
};

/**
 * POST /api/user/ai-config/reset
 * 恢复指定类型的默认AI提示词配置
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
    const { type } = body as { type: PromptType };

    // 验证类型
    if (!type || !PROMPT_FIELDS[type]) {
      return NextResponse.json(
        { error: "无效的提示词类型" },
        { status: 400 }
      );
    }

    // 重置对应字段为 null
    const fieldName = PROMPT_FIELDS[type];
    await prisma.user.update({
      where: { id: session.user.id },
      data: { [fieldName]: null },
    });

    return NextResponse.json({
      success: true,
      message: "已恢复默认配置",
      prompt: await getSystemPrompt(type),
    });
  } catch (error) {
    console.error("Reset AI config error:", error);
    return NextResponse.json(
      { error: "重置配置失败" },
      { status: 500 }
    );
  }
}

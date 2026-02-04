import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { PROMPT_REGISTRY } from "@/lib/prompts/registry";

/**
 * POST /api/admin/prompts/seed
 * 初始化：将 15 个硬编码提示词写入数据库
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 检查数据库中已有记录
    const existingCount = await prisma.systemPrompt.count();

    let created = 0;
    let skipped = 0;

    for (const entry of PROMPT_REGISTRY) {
      const existing = await prisma.systemPrompt.findUnique({
        where: { key: entry.key },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.systemPrompt.create({
        data: {
          key: entry.key,
          category: entry.category,
          name: entry.name,
          description: entry.description,
          content: entry.defaultContent,
          updatedBy: session.user.id,
        },
      });
      created++;
    }

    return NextResponse.json({
      success: true,
      message: `初始化完成：新建 ${created} 条，跳过 ${skipped} 条已有记录`,
      created,
      skipped,
      total: PROMPT_REGISTRY.length,
      previousCount: existingCount,
    });
  } catch (error) {
    console.error("Seed prompts error:", error);
    return NextResponse.json(
      { error: "初始化提示词失败" },
      { status: 500 }
    );
  }
}

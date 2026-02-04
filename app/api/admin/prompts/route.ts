import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  PROMPT_REGISTRY,
  PROMPT_REGISTRY_MAP,
  CATEGORY_LABELS,
} from "@/lib/prompts/registry";

/**
 * GET /api/admin/prompts
 * 获取全部提示词（按分类分组），合并数据库记录和注册表元数据
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 查询数据库中已有的提示词
    const dbPrompts = await prisma.systemPrompt.findMany();
    const dbPromptMap = new Map(dbPrompts.map((p) => [p.key, p]));

    // 合并注册表和数据库数据
    const prompts = PROMPT_REGISTRY.map((entry) => {
      const dbRecord = dbPromptMap.get(entry.key);
      return {
        key: entry.key,
        category: entry.category,
        name: entry.name,
        description: entry.description,
        content: dbRecord?.content ?? entry.defaultContent,
        isActive: dbRecord?.isActive ?? true,
        isModified: dbRecord ? dbRecord.content !== entry.defaultContent : false,
        inDatabase: !!dbRecord,
        updatedAt: dbRecord?.updatedAt ?? null,
        updatedBy: dbRecord?.updatedBy ?? null,
      };
    });

    // 按分类分组
    const grouped: Record<string, typeof prompts> = {};
    for (const prompt of prompts) {
      if (!grouped[prompt.category]) {
        grouped[prompt.category] = [];
      }
      grouped[prompt.category].push(prompt);
    }

    return NextResponse.json({
      prompts,
      grouped,
      categoryLabels: CATEGORY_LABELS,
      totalCount: PROMPT_REGISTRY.length,
      dbCount: dbPrompts.length,
    });
  } catch (error) {
    console.error("Get admin prompts error:", error);
    return NextResponse.json(
      { error: "获取提示词列表失败" },
      { status: 500 }
    );
  }
}

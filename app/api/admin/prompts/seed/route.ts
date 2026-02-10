import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { PROMPT_REGISTRY } from "@/lib/prompts/registry";
import { requireAdmin } from "@/lib/require-admin";

// 旧 key → 新 key 的迁移映射
const KEY_MIGRATION_MAP: Record<string, string> = {
  tutor: "learn-chat",
  problem: "problem-chat",
  debug: "problem-debug",
  feynman: "feynman-chat",
  "error-generate-rule": "error-gen-rule",
  "code-error-analysis": "problem-error-analysis",
  "study-plan": "plan-generate",
  "code-import": "review-import",
  "prevention-check": "review-prevention",
};

/**
 * POST /api/admin/prompts/seed
 * 初始化：将 15 个硬编码提示词写入数据库
 * 包含旧 key 到新 key 的一次性迁移逻辑
 * body: { force?: boolean } — force=true 时用硬编码默认值覆盖所有已有内容
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const session = auth;
  try {
    const body = await request.json().catch(() => ({}));
    const force = body.force === true;

    // === 迁移阶段：将旧 key 更新为新 key ===
    let migrated = 0;
    for (const [oldKey, newKey] of Object.entries(KEY_MIGRATION_MAP)) {
      const oldRecord = await prisma.systemPrompt.findUnique({
        where: { key: oldKey },
      });
      if (oldRecord) {
        // 检查新 key 是否已存在，避免冲突
        const newRecord = await prisma.systemPrompt.findUnique({
          where: { key: newKey },
        });
        if (!newRecord) {
          await prisma.systemPrompt.update({
            where: { key: oldKey },
            data: { key: newKey },
          });
          migrated++;
        }
      }
    }

    // === Seed 阶段 ===
    const existingCount = await prisma.systemPrompt.count();

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const entry of PROMPT_REGISTRY) {
      const existing = await prisma.systemPrompt.findUnique({
        where: { key: entry.key },
      });

      if (existing) {
        if (force) {
          // 强制模式：用硬编码默认值覆盖全部字段（含 content）
          await prisma.systemPrompt.update({
            where: { key: entry.key },
            data: {
              name: entry.name,
              description: entry.description,
              category: entry.category,
              content: entry.defaultContent,
              updatedBy: session.user.id,
            },
          });
          updated++;
        } else {
          // 普通模式：仅更新元数据，不动 content
          await prisma.systemPrompt.update({
            where: { key: entry.key },
            data: {
              name: entry.name,
              description: entry.description,
              category: entry.category,
            },
          });
          skipped++;
        }
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

    const msg = force
      ? `强制同步完成：迁移 ${migrated} 条旧 key，新建 ${created} 条，覆盖更新 ${updated} 条`
      : `初始化完成：迁移 ${migrated} 条旧 key，新建 ${created} 条，更新 ${skipped} 条已有记录`;

    return NextResponse.json({
      success: true,
      message: msg,
      migrated,
      created,
      updated,
      skipped,
      force,
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

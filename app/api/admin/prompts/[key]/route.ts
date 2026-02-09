import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { PROMPT_REGISTRY_MAP } from "@/lib/prompts/registry";
import { requireAdmin } from "@/lib/require-admin";

interface RouteParams {
  params: Promise<{ key: string }>;
}

/**
 * GET /api/admin/prompts/[key]
 * 获取单个提示词详情（含硬编码默认值对比）
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {

    const { key } = await params;
    const registryEntry = PROMPT_REGISTRY_MAP.get(key);

    if (!registryEntry) {
      return NextResponse.json({ error: "提示词不存在" }, { status: 404 });
    }

    const dbRecord = await prisma.systemPrompt.findUnique({
      where: { key },
    });

    return NextResponse.json({
      key: registryEntry.key,
      category: registryEntry.category,
      name: registryEntry.name,
      description: registryEntry.description,
      defaultContent: registryEntry.defaultContent,
      currentContent: dbRecord?.content ?? registryEntry.defaultContent,
      isModified: dbRecord ? dbRecord.content !== registryEntry.defaultContent : false,
      inDatabase: !!dbRecord,
      isActive: dbRecord?.isActive ?? true,
      updatedAt: dbRecord?.updatedAt ?? null,
      updatedBy: dbRecord?.updatedBy ?? null,
    });
  } catch (error) {
    console.error("Get prompt detail error:", error);
    return NextResponse.json(
      { error: "获取提示词详情失败" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/prompts/[key]
 * 更新提示词内容
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const session = auth;
  try {

    const { key } = await params;
    const registryEntry = PROMPT_REGISTRY_MAP.get(key);

    if (!registryEntry) {
      return NextResponse.json({ error: "提示词不存在" }, { status: 404 });
    }

    const body = await request.json();
    const { content, resetToDefault } = body as {
      content?: string;
      resetToDefault?: boolean;
    };

    // 恢复默认值
    if (resetToDefault) {
      const dbRecord = await prisma.systemPrompt.findUnique({ where: { key } });
      if (dbRecord) {
        await prisma.systemPrompt.update({
          where: { key },
          data: {
            content: registryEntry.defaultContent,
            updatedBy: session.user.id,
          },
        });
      }
      return NextResponse.json({
        success: true,
        message: "已恢复默认值",
        content: registryEntry.defaultContent,
      });
    }

    // 更新内容
    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "提示词内容不能为空" },
        { status: 400 }
      );
    }

    if (content.length > 20000) {
      return NextResponse.json(
        { error: "提示词过长，请控制在20000字以内" },
        { status: 400 }
      );
    }

    // upsert：存在则更新，不存在则创建
    await prisma.systemPrompt.upsert({
      where: { key },
      update: {
        content,
        updatedBy: session.user.id,
      },
      create: {
        key,
        category: registryEntry.category,
        name: registryEntry.name,
        description: registryEntry.description,
        content,
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "提示词已更新",
      isModified: content !== registryEntry.defaultContent,
    });
  } catch (error) {
    console.error("Update prompt error:", error);
    return NextResponse.json(
      { error: "更新提示词失败" },
      { status: 500 }
    );
  }
}

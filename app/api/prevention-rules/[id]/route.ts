import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 获取单个防错规则详情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;

    const rule = await prisma.preventionRule.findUnique({
      where: { id },
      include: {
        errorCases: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                level: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!rule) {
      return NextResponse.json(
        { error: "防错规则不存在" },
        { status: 404 }
      );
    }

    if (rule.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权访问此规则" },
        { status: 403 }
      );
    }

    return NextResponse.json({ rule });
  } catch (error) {
    console.error("Get prevention rule error:", error);
    return NextResponse.json(
      { error: "获取防错规则失败" },
      { status: 500 }
    );
  }
}

// 更新防错规则
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { rule, isActive } = body;

    // 验证规则存在且属于当前用户
    const existingRule = await prisma.preventionRule.findUnique({
      where: { id },
    });

    if (!existingRule) {
      return NextResponse.json(
        { error: "防错规则不存在" },
        { status: 404 }
      );
    }

    if (existingRule.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权修改此规则" },
        { status: 403 }
      );
    }

    // 构建更新数据
    const updateData: {
      rule?: string;
      isActive?: boolean;
    } = {};

    if (rule !== undefined) updateData.rule = rule;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedRule = await prisma.preventionRule.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ rule: updatedRule });
  } catch (error) {
    console.error("Update prevention rule error:", error);
    return NextResponse.json(
      { error: "更新防错规则失败" },
      { status: 500 }
    );
  }
}

// 删除防错规则
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;

    // 验证规则存在且属于当前用户
    const existingRule = await prisma.preventionRule.findUnique({
      where: { id },
    });

    if (!existingRule) {
      return NextResponse.json(
        { error: "防错规则不存在" },
        { status: 404 }
      );
    }

    if (existingRule.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权删除此规则" },
        { status: 403 }
      );
    }

    // 先清除关联的错题记录的 preventionRuleId
    await prisma.errorCase.updateMany({
      where: { preventionRuleId: id },
      data: { preventionRuleId: null },
    });

    // 删除规则
    await prisma.preventionRule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete prevention rule error:", error);
    return NextResponse.json(
      { error: "删除防错规则失败" },
      { status: 500 }
    );
  }
}

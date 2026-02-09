import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 获取错题详情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { id } = await params;

    const errorCase = await prisma.errorCase.findUnique({
      where: { id },
      include: {
        problem: true,
        submission: true,
        preventionRule: true,
      },
    });

    if (!errorCase) {
      return NextResponse.json(
        { error: "错题记录不存在" },
        { status: 404 }
      );
    }

    if (errorCase.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权访问此错题记录" },
        { status: 403 }
      );
    }

    return NextResponse.json({ errorCase });
  } catch (error) {
    console.error("Get error case error:", error);
    return NextResponse.json(
      { error: "获取错题详情失败" },
      { status: 500 }
    );
  }
}

// 更新错题记录（提交三问答案）
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { id } = await params;
    const body = await request.json();
    const { q1Answer, q2Answer, q3Answer, status, errorType } = body;

    // 验证错题记录存在且属于当前用户
    const existingErrorCase = await prisma.errorCase.findUnique({
      where: { id },
    });

    if (!existingErrorCase) {
      return NextResponse.json(
        { error: "错题记录不存在" },
        { status: 404 }
      );
    }

    if (existingErrorCase.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权操作此错题记录" },
        { status: 403 }
      );
    }

    // 构建更新数据
    const updateData: {
      q1Answer?: string;
      q2Answer?: string;
      q3Answer?: string;
      status?: string;
      errorType?: string;
    } = {};

    if (q1Answer !== undefined) updateData.q1Answer = q1Answer;
    if (q2Answer !== undefined) updateData.q2Answer = q2Answer;
    if (q3Answer !== undefined) updateData.q3Answer = q3Answer;
    if (status !== undefined) updateData.status = status;
    if (errorType !== undefined) updateData.errorType = errorType;

    // 如果三问都已回答，自动更新状态为已完成
    const finalQ1 = q1Answer ?? existingErrorCase.q1Answer;
    const finalQ2 = q2Answer ?? existingErrorCase.q2Answer;
    const finalQ3 = q3Answer ?? existingErrorCase.q3Answer;

    if (finalQ1 && finalQ2 && finalQ3 && !status) {
      updateData.status = "completed";
    }

    const errorCase = await prisma.errorCase.update({
      where: { id },
      data: updateData,
      include: {
        problem: true,
        submission: true,
        preventionRule: true,
      },
    });

    return NextResponse.json({ errorCase });
  } catch (error) {
    console.error("Update error case error:", error);
    return NextResponse.json(
      { error: "更新错题记录失败" },
      { status: 500 }
    );
  }
}

// 删除错题记录
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { id } = await params;

    // 验证错题记录存在且属于当前用户
    const existingErrorCase = await prisma.errorCase.findUnique({
      where: { id },
    });

    if (!existingErrorCase) {
      return NextResponse.json(
        { error: "错题记录不存在" },
        { status: 404 }
      );
    }

    if (existingErrorCase.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权删除此错题记录" },
        { status: 403 }
      );
    }

    await prisma.errorCase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error case error:", error);
    return NextResponse.json(
      { error: "删除错题记录失败" },
      { status: 500 }
    );
  }
}

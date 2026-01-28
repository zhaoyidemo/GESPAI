import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// 获取题目详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;

    const problem = await prisma.problem.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        level: true,
        difficulty: true,
        knowledgePoints: true,
        description: true,
        inputFormat: true,
        outputFormat: true,
        samples: true,
        timeLimit: true,
        memoryLimit: true,
        source: true,
        sourceUrl: true,
        hint: true,
      },
    });

    if (!problem) {
      return NextResponse.json({ error: "题目不存在" }, { status: 404 });
    }

    // 获取用户的提交历史
    const submissions = await prisma.submission.findMany({
      where: {
        userId: session.user.id,
        problemId: id,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        status: true,
        score: true,
        createdAt: true,
      },
    });

    // 获取最佳提交
    const bestSubmission = await prisma.submission.findFirst({
      where: {
        userId: session.user.id,
        problemId: id,
        status: "accepted",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      problem,
      submissions,
      bestSubmission,
    });
  } catch (error) {
    console.error("Get problem error:", error);
    return NextResponse.json(
      { error: "获取题目详情失败" },
      { status: 500 }
    );
  }
}

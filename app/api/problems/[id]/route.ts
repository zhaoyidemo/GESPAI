import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";

// 获取题目详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { id } = await params;

    // 并行获取题目详情、提交历史和最佳提交
    const [problem, submissions, bestSubmission] = await Promise.all([
      prisma.problem.findUnique({
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
      }),
      prisma.submission.findMany({
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
      }),
      prisma.submission.findFirst({
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
      }),
    ]);

    if (!problem) {
      return NextResponse.json({ error: "题目不存在" }, { status: 404 });
    }

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

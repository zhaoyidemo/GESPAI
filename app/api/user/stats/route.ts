import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const [user, solvedProblems, totalSubmissions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          targetLevel: true,
          examDate: true,
        },
      }),
      prisma.submission.groupBy({
        by: ["problemId"],
        where: {
          userId: session.user.id,
          status: "accepted",
        },
      }),
      prisma.submission.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json({
      targetLevel: user.targetLevel,
      examDate: user.examDate?.toISOString() || null,
      problemsSolved: solvedProblems.length,
      totalSubmissions,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    return NextResponse.json(
      { error: "获取用户统计失败" },
      { status: 500 }
    );
  }
}

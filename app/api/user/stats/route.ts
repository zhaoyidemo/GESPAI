import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    // 获取用户基本信息
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        streakDays: true,
        totalXp: true,
        targetLevel: true,
        examDate: true,
        badges: true,
        lastActiveDate: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 获取用户解决的题目数
    const solvedProblems = await prisma.submission.groupBy({
      by: ["problemId"],
      where: {
        userId: session.user.id,
        status: "accepted",
      },
    });

    // 获取总提交次数
    const totalSubmissions = await prisma.submission.count({
      where: {
        userId: session.user.id,
      },
    });

    // 检查并更新连胜天数
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streakDays = user.streakDays;

    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

      // 如果超过1天没活动，重置连胜
      if (diffDays > 1) {
        streakDays = 0;
        await prisma.user.update({
          where: { id: session.user.id },
          data: { streakDays: 0 },
        });
      }
    }

    return NextResponse.json({
      streakDays,
      totalXp: user.totalXp,
      targetLevel: user.targetLevel,
      examDate: user.examDate?.toISOString() || null,
      badges: user.badges,
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

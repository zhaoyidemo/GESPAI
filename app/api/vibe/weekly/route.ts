import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const userId = authResult.user.id;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [submissions, errorCases, learningRecords, mockExams, user] =
      await Promise.all([
        prisma.submission.findMany({
          where: {
            userId,
            createdAt: { gte: sevenDaysAgo },
          },
          include: { problem: { select: { title: true, level: true } } },
          orderBy: { createdAt: "desc" },
        }),
        prisma.errorCase.findMany({
          where: {
            userId,
            createdAt: { gte: sevenDaysAgo },
          },
          select: { id: true, status: true, errorType: true },
        }),
        prisma.learningRecord.findMany({
          where: {
            userId,
            lastStudiedAt: { gte: sevenDaysAgo },
          },
          include: {
            knowledgePoint: { select: { name: true } },
          },
        }),
        prisma.mockExamResult.findMany({
          where: {
            userId,
            createdAt: { gte: sevenDaysAgo },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { streakDays: true, totalXp: true, username: true },
        }),
      ]);

    // 聚合统计
    const acCount = submissions.filter((s) => s.status === "accepted").length;
    const totalSubmissions = submissions.length;
    const errorFixed = errorCases.filter(
      (e) => e.status === "completed"
    ).length;
    const totalErrors = errorCases.length;
    const knowledgeStudied = learningRecords.length;
    const feynmanCompleted = learningRecords.filter(
      (r) => r.feynmanCompleted
    ).length;

    // 解题的题目列表（去重）
    const acProblems = submissions
      .filter((s) => s.status === "accepted" && s.problem)
      .reduce(
        (acc, s) => {
          const key = s.problemId;
          if (!acc.seen.has(key)) {
            acc.seen.add(key);
            acc.list.push({
              title: s.problem!.title,
              level: s.problem!.level,
            });
          }
          return acc;
        },
        { seen: new Set<string>(), list: [] as { title: string; level: number }[] }
      ).list;

    // 模考成绩
    const examSummary = mockExams.map((e) => ({
      level: e.targetLevel,
      score: e.totalScore,
      passed: e.passed,
    }));

    // 生成周报素材文本
    const lines: string[] = [];
    lines.push(`📅 本周学习周报（${user?.username || "同学"}）`);
    lines.push("");

    if (totalSubmissions > 0) {
      lines.push(
        `📝 提交了 ${totalSubmissions} 次代码，其中 ${acCount} 次 AC`
      );
      if (acProblems.length > 0) {
        const problemList = acProblems
          .slice(0, 5)
          .map((p) => `${p.title}(${p.level}级)`)
          .join("、");
        lines.push(`✅ 通过题目：${problemList}`);
      }
    }

    if (totalErrors > 0) {
      lines.push(
        `🔍 新增 ${totalErrors} 道错题，已复盘 ${errorFixed} 道`
      );
    }

    if (knowledgeStudied > 0) {
      lines.push(
        `📚 学习了 ${knowledgeStudied} 个知识点，费曼验证通过 ${feynmanCompleted} 个`
      );
    }

    if (examSummary.length > 0) {
      for (const exam of examSummary) {
        lines.push(
          `🎯 ${exam.level} 级模考 ${exam.score} 分${exam.passed ? "（通过）" : ""}`
        );
      }
    }

    if (user?.streakDays && user.streakDays > 0) {
      lines.push(`🔥 当前连胜 ${user.streakDays} 天`);
    }

    if (user?.totalXp) {
      lines.push(`⭐ 累计 ${user.totalXp} XP`);
    }

    const rawInput = lines.join("\n");

    // 判断本周是否有足够的活动数据
    const hasActivity =
      totalSubmissions > 0 ||
      totalErrors > 0 ||
      knowledgeStudied > 0 ||
      examSummary.length > 0;

    return NextResponse.json({
      rawInput,
      hasActivity,
      stats: {
        totalSubmissions,
        acCount,
        totalErrors,
        errorFixed,
        knowledgeStudied,
        feynmanCompleted,
        examCount: examSummary.length,
        streakDays: user?.streakDays || 0,
        totalXp: user?.totalXp || 0,
      },
    });
  } catch (error) {
    console.error("Weekly summary error:", error);
    return NextResponse.json(
      { error: "获取周报数据失败" },
      { status: 500 }
    );
  }
}

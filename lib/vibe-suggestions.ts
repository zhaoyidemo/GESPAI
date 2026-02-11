import { prisma } from "@/lib/db";
import type { ContentType } from "@/stores/vibe-store";

export interface VibeSuggestion {
  id: string;
  label: string;
  contentType: ContentType;
  rawInput: string;
  emoji: string;
}

interface RecentActivity {
  submissions: Array<{
    id: string;
    score: number;
    createdAt: Date;
    problem: { title: string; level: number };
  }>;
  errorCases: Array<{
    id: string;
    q1Answer: string | null;
    q2Answer: string | null;
    q3Answer: string | null;
    problem: { title: string };
  }>;
  learningRecords: Array<{
    id: string;
    feynmanCompleted: boolean;
    masteryLevel: number;
    knowledgePoint: { name: string };
  }>;
  mockExamResults: Array<{
    id: string;
    totalScore: number;
    passScore: number;
    passed: boolean;
    targetLevel: number;
  }>;
  user: {
    streakDays: number;
    totalXp: number;
  } | null;
}

const STREAK_MILESTONES = [7, 14, 30, 50, 100];

export async function fetchRecentActivity(
  userId: string
): Promise<RecentActivity> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [submissions, errorCases, learningRecords, mockExamResults, user] =
    await Promise.all([
      prisma.submission.findMany({
        where: {
          userId,
          status: "accepted",
          createdAt: { gte: sevenDaysAgo },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          score: true,
          createdAt: true,
          problem: { select: { title: true, level: true } },
        },
      }),
      prisma.errorCase.findMany({
        where: {
          userId,
          status: "completed",
          updatedAt: { gte: sevenDaysAgo },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          q1Answer: true,
          q2Answer: true,
          q3Answer: true,
          problem: { select: { title: true } },
        },
      }),
      prisma.learningRecord.findMany({
        where: {
          userId,
          OR: [{ feynmanCompleted: true }, { masteryLevel: { gte: 80 } }],
        },
        orderBy: { lastStudiedAt: "desc" },
        take: 5,
        select: {
          id: true,
          feynmanCompleted: true,
          masteryLevel: true,
          knowledgePoint: { select: { name: true } },
        },
      }),
      prisma.mockExamResult.findMany({
        where: {
          userId,
          createdAt: { gte: sevenDaysAgo },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          totalScore: true,
          passScore: true,
          passed: true,
          targetLevel: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { streakDays: true, totalXp: true },
      }),
    ]);

  return { submissions, errorCases, learningRecords, mockExamResults, user };
}

export function generateSuggestions(data: RecentActivity): VibeSuggestion[] {
  const suggestions: VibeSuggestion[] = [];

  // 规则 1：近期 AC 提交
  if (data.submissions.length > 0) {
    const sub = data.submissions[0];
    suggestions.push({
      id: `ac-${sub.id}`,
      label: `满分通过「${sub.problem.title}」`,
      contentType: "build",
      rawInput: `成功 AC 了 GESP ${sub.problem.level} 级题目「${sub.problem.title}」，得分 ${sub.score}/100！`,
      emoji: "🎯",
    });
  }

  // 规则 2：完成三问的错题
  if (data.errorCases.length > 0) {
    const ec = data.errorCases[0];
    const answers = [ec.q1Answer, ec.q2Answer, ec.q3Answer]
      .filter(Boolean)
      .join("\n");
    suggestions.push({
      id: `error-${ec.id}`,
      label: `错题逆袭「${ec.problem.title}」`,
      contentType: "learn",
      rawInput: `完成了「${ec.problem.title}」的错题三问复盘：\n${answers}`,
      emoji: "💪",
    });
  }

  // 规则 3：连胜里程碑
  if (data.user) {
    const milestone = STREAK_MILESTONES.find(
      (m) => data.user!.streakDays >= m && data.user!.streakDays < m + 7
    );
    if (milestone) {
      suggestions.push({
        id: `streak-${milestone}`,
        label: `连胜 ${data.user.streakDays} 天打卡`,
        contentType: "learn",
        rawInput: `坚持学习打卡连胜 ${data.user.streakDays} 天！累计获得 ${data.user.totalXp} XP 经验值。`,
        emoji: "🔥",
      });
    }
  }

  // 规则 4：模考成绩
  if (data.mockExamResults.length > 0) {
    const exam = data.mockExamResults[0];
    suggestions.push({
      id: `exam-${exam.id}`,
      label: exam.passed
        ? `模考通过 ${exam.targetLevel} 级`
        : `模考复盘 ${exam.targetLevel} 级`,
      contentType: "learn",
      rawInput: exam.passed
        ? `GESP ${exam.targetLevel} 级模考通过！总分 ${exam.totalScore} 分（及格线 ${exam.passScore} 分）`
        : `GESP ${exam.targetLevel} 级模考 ${exam.totalScore} 分（及格线 ${exam.passScore} 分），继续努力！`,
      emoji: exam.passed ? "🏆" : "📝",
    });
  }

  // 规则 5：费曼验证高分
  if (data.learningRecords.length > 0) {
    const lr = data.learningRecords[0];
    if (lr.feynmanCompleted) {
      suggestions.push({
        id: `feynman-${lr.id}`,
        label: `攻克「${lr.knowledgePoint.name}」`,
        contentType: "learn",
        rawInput: `通过费曼验证攻克了知识点「${lr.knowledgePoint.name}」，掌握度达到 ${lr.masteryLevel}%！`,
        emoji: "🧠",
      });
    }
  }

  // 返回最多 3 个
  return suggestions.slice(0, 3);
}

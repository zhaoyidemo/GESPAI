import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateStudyPlan } from "@/lib/claude";

// 生成学习计划
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { targetLevel, examDate, weeklyHours } = body;

    if (!targetLevel || !examDate || !weeklyHours) {
      return NextResponse.json(
        { error: "请填写所有必填信息" },
        { status: 400 }
      );
    }

    // 获取用户当前的学习进度
    const learningRecords = await prisma.learningRecord.findMany({
      where: { userId: session.user.id },
      select: {
        knowledgePointId: true,
        status: true,
        progress: true,
      },
    });

    const currentProgress = learningRecords.reduce(
      (acc, record) => {
        acc[record.knowledgePointId] = record.progress;
        return acc;
      },
      {} as Record<string, number>
    );

    // 调用 AI 生成学习计划
    const plan = await generateStudyPlan(
      targetLevel,
      new Date(examDate),
      weeklyHours,
      Object.keys(currentProgress).length > 0 ? currentProgress : undefined
    );

    // 保存学习计划
    const studyPlan = await prisma.studyPlan.create({
      data: {
        userId: session.user.id,
        startDate: new Date(),
        endDate: new Date(examDate),
        targetLevel,
        weeklyPlan: plan,
        isActive: true,
      },
    });

    // 更新用户目标
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        targetLevel,
        examDate: new Date(examDate),
        weeklySchedule: { weeklyHours },
      },
    });

    // 生成今日任务
    await generateDailyTasks(session.user.id, plan);

    return NextResponse.json({
      success: true,
      planId: studyPlan.id,
      plan,
    });
  } catch (error) {
    console.error("Generate plan error:", error);
    return NextResponse.json(
      { error: "生成学习计划失败" },
      { status: 500 }
    );
  }
}

// 获取当前学习计划
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const studyPlan = await prisma.studyPlan.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!studyPlan) {
      return NextResponse.json({ plan: null });
    }

    // 获取今日任务
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyTask = await prisma.dailyTask.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    });

    return NextResponse.json({
      plan: studyPlan,
      dailyTask,
    });
  } catch (error) {
    console.error("Get plan error:", error);
    return NextResponse.json(
      { error: "获取学习计划失败" },
      { status: 500 }
    );
  }
}

// 辅助函数：生成今日任务
async function generateDailyTasks(userId: string, plan: object) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 检查今日任务是否已存在
  const existingTask = await prisma.dailyTask.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  if (existingTask) {
    return existingTask;
  }

  // 获取用户目标级别
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { targetLevel: true },
  });

  const targetLevel = user?.targetLevel || 5;

  // 获取用户的学习记录，找出未完成的知识点
  const learningRecords = await prisma.learningRecord.findMany({
    where: { userId },
    select: {
      knowledgePointId: true,
      status: true,
      tutorCompleted: true,
      feynmanCompleted: true,
      practiceCount: true,
    },
  });

  const completedKPs = new Set(
    learningRecords
      .filter((r) => r.status === "completed" || r.status === "mastered")
      .map((r) => r.knowledgePointId)
  );

  // 导入知识点数据
  const { gespKnowledgeData } = await import("@/lib/gesp-knowledge");
  const levelData = gespKnowledgeData[targetLevel.toString()];

  if (!levelData) {
    // 如果找不到级别数据，使用默认任务
    const tasks = [
      {
        type: "learn",
        targetId: "recursion",
        title: "学习递归算法",
        completed: false,
        xpReward: 20,
      },
    ];

    return await prisma.dailyTask.create({
      data: {
        userId,
        date: today,
        tasks,
        totalXp: 20,
        completedXp: 0,
        isCompleted: false,
      },
    });
  }

  // 找出需要学习的知识点（按顺序）
  const pendingKPs = levelData.points.filter((kp) => !completedKPs.has(kp.id));

  const tasks: Array<{
    type: string;
    targetId: string;
    title: string;
    completed: boolean;
    xpReward: number;
  }> = [];

  // 添加1-2个学习任务
  const learnCount = Math.min(2, pendingKPs.length);
  for (let i = 0; i < learnCount; i++) {
    const kp = pendingKPs[i];
    const record = learningRecords.find((r) => r.knowledgePointId === kp.id);

    // 如果未完成私教学习
    if (!record?.tutorCompleted) {
      tasks.push({
        type: "learn",
        targetId: kp.id,
        title: `学习${kp.name}`,
        completed: false,
        xpReward: 20,
      });
    }
    // 如果完成私教但未完成费曼
    else if (!record?.feynmanCompleted) {
      tasks.push({
        type: "feynman",
        targetId: kp.id,
        title: `GESP AI 私教·验证: ${kp.name}`,
        completed: false,
        xpReward: 25,
      });
    }
  }

  // 添加1个练习任务（如果有相关题目）
  if (pendingKPs.length > 0) {
    const kpForPractice = pendingKPs[0];
    const problemForPractice = await prisma.problem.findFirst({
      where: {
        level: targetLevel,
        knowledgePoints: { has: kpForPractice.id },
      },
      select: { id: true, title: true },
    });

    if (problemForPractice) {
      tasks.push({
        type: "practice",
        targetId: problemForPractice.id,
        title: `练习: ${problemForPractice.title}`,
        completed: false,
        xpReward: 30,
      });
    }
  }

  // 如果没有生成任何任务，添加一个复习任务
  if (tasks.length === 0) {
    const randomKP =
      levelData.points[Math.floor(Math.random() * levelData.points.length)];
    tasks.push({
      type: "review",
      targetId: randomKP.id,
      title: `复习${randomKP.name}`,
      completed: false,
      xpReward: 15,
    });
  }

  const dailyTask = await prisma.dailyTask.create({
    data: {
      userId,
      date: today,
      tasks,
      totalXp: tasks.reduce((sum, t) => sum + t.xpReward, 0),
      completedXp: 0,
      isCompleted: false,
    },
  });

  return dailyTask;
}

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

  // 根据计划生成今日任务
  // 这里简化处理，实际应该根据 plan 的内容智能生成
  const tasks = [
    {
      type: "learn",
      targetId: "recursion",
      title: "学习递归基础概念",
      completed: false,
      xpReward: 20,
    },
    {
      type: "practice",
      targetId: "problem-1",
      title: "完成递归练习题",
      completed: false,
      xpReward: 30,
    },
  ];

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

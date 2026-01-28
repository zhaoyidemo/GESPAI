import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// 获取题目列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level");
    const difficulty = searchParams.get("difficulty");
    const knowledgePoint = searchParams.get("knowledgePoint");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // 构建查询条件
    const where: {
      level?: number;
      difficulty?: string;
      knowledgePoints?: { has: string };
    } = {};

    if (level) {
      where.level = parseInt(level);
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (knowledgePoint) {
      where.knowledgePoints = { has: knowledgePoint };
    }

    // 获取题目列表
    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        select: {
          id: true,
          title: true,
          level: true,
          difficulty: true,
          knowledgePoints: true,
          source: true,
          _count: {
            select: { submissions: true },
          },
        },
        orderBy: [{ level: "asc" }, { difficulty: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.problem.count({ where }),
    ]);

    // 获取用户的提交状态
    const userSubmissions = await prisma.submission.groupBy({
      by: ["problemId"],
      where: {
        userId: session.user.id,
        problemId: { in: problems.map((p) => p.id) },
      },
      _max: {
        status: true,
      },
    });

    const submissionMap = new Map(
      userSubmissions.map((s) => [s.problemId, s._max.status])
    );

    const problemsWithStatus = problems.map((p) => ({
      ...p,
      userStatus: submissionMap.get(p.id) || null,
      submissionCount: p._count.submissions,
    }));

    return NextResponse.json({
      problems: problemsWithStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get problems error:", error);
    return NextResponse.json(
      { error: "获取题目列表失败" },
      { status: 500 }
    );
  }
}

// 创建题目（管理员功能）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // TODO: 添加管理员权限检查

    const body = await request.json();
    const {
      title,
      level,
      difficulty,
      knowledgePoints,
      description,
      inputFormat,
      outputFormat,
      samples,
      testCases,
      timeLimit,
      memoryLimit,
      source,
      sourceId,
      sourceUrl,
      hint,
      solution,
    } = body;

    // 验证必填字段
    if (!title || !level || !difficulty || !description || !testCases) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.create({
      data: {
        title,
        level,
        difficulty,
        knowledgePoints: knowledgePoints || [],
        description,
        inputFormat,
        outputFormat,
        samples: samples || [],
        testCases,
        timeLimit: timeLimit || 1000,
        memoryLimit: memoryLimit || 256,
        source: source || "custom",
        sourceId,
        sourceUrl,
        hint,
        solution,
      },
    });

    return NextResponse.json({ problem });
  } catch (error) {
    console.error("Create problem error:", error);
    return NextResponse.json(
      { error: "创建题目失败" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// 获取错题列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const errorType = searchParams.get("errorType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // 构建查询条件
    const where: {
      userId: string;
      status?: string;
      errorType?: string;
    } = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (errorType) {
      where.errorType = errorType;
    }

    // 获取错题列表
    const [errorCases, total] = await Promise.all([
      prisma.errorCase.findMany({
        where,
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              level: true,
              difficulty: true,
              knowledgePoints: true,
            },
          },
          submission: {
            select: {
              id: true,
              status: true,
              code: true,
              testResults: true,
              createdAt: true,
            },
          },
          preventionRule: {
            select: {
              id: true,
              rule: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.errorCase.count({ where }),
    ]);

    return NextResponse.json({
      errorCases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get error cases error:", error);
    return NextResponse.json(
      { error: "获取错题列表失败" },
      { status: 500 }
    );
  }
}

// 创建错题记录
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "请提供提交ID" },
        { status: 400 }
      );
    }

    // 验证提交记录存在且属于当前用户
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { problem: true },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "提交记录不存在" },
        { status: 404 }
      );
    }

    if (submission.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权操作此提交记录" },
        { status: 403 }
      );
    }

    // 检查是否已存在错题记录
    const existingErrorCase = await prisma.errorCase.findUnique({
      where: { submissionId },
    });

    if (existingErrorCase) {
      return NextResponse.json({
        errorCase: existingErrorCase,
        message: "错题记录已存在",
      });
    }

    // 创建错题记录
    const errorCase = await prisma.errorCase.create({
      data: {
        userId: session.user.id,
        submissionId,
        problemId: submission.problemId,
        status: "pending",
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            level: true,
            difficulty: true,
            knowledgePoints: true,
          },
        },
        submission: {
          select: {
            id: true,
            status: true,
            code: true,
            testResults: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({ errorCase });
  } catch (error) {
    console.error("Create error case error:", error);
    return NextResponse.json(
      { error: "创建错题记录失败" },
      { status: 500 }
    );
  }
}

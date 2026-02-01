import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { chat } from "@/lib/claude";
import { baseSystemPrompt, generateRulePrompt } from "@/lib/prompts/error-diagnosis";

// 获取防错规则列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const errorType = searchParams.get("errorType");
    const isActive = searchParams.get("isActive");

    // 构建查询条件
    const where: {
      userId: string;
      errorType?: string;
      isActive?: boolean;
    } = {
      userId: session.user.id,
    };

    if (errorType) {
      where.errorType = errorType;
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const rules = await prisma.preventionRule.findMany({
      where,
      include: {
        _count: {
          select: { errorCases: true },
        },
      },
      orderBy: [
        { hitCount: "desc" },
        { createdAt: "desc" },
      ],
    });

    // 按错误类型分组
    const groupedRules = rules.reduce((acc, rule) => {
      if (!acc[rule.errorType]) {
        acc[rule.errorType] = [];
      }
      acc[rule.errorType].push({
        ...rule,
        relatedCasesCount: rule._count.errorCases,
      });
      return acc;
    }, {} as Record<string, typeof rules>);

    return NextResponse.json({
      rules,
      groupedRules,
    });
  } catch (error) {
    console.error("Get prevention rules error:", error);
    return NextResponse.json(
      { error: "获取防错规则失败" },
      { status: 500 }
    );
  }
}

// 创建防错规则
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { errorCaseId, rule, errorType, autoGenerate } = body;

    if (!errorType) {
      return NextResponse.json(
        { error: "请提供错误类型" },
        { status: 400 }
      );
    }

    let finalRule = rule;

    // 如果需要自动生成规则
    if (autoGenerate && errorCaseId) {
      const errorCase = await prisma.errorCase.findUnique({
        where: { id: errorCaseId },
      });

      if (!errorCase) {
        return NextResponse.json(
          { error: "错题记录不存在" },
          { status: 404 }
        );
      }

      if (errorCase.userId !== session.user.id) {
        return NextResponse.json(
          { error: "无权操作此错题记录" },
          { status: 403 }
        );
      }

      // 调用 AI 生成规则
      const contextInfo = `**错误类型**: ${errorType}

**第一问回答（错了哪）**: ${errorCase.q1Answer || "未回答"}
**第二问回答（为什么错）**: ${errorCase.q2Answer || "未回答"}
**第三问回答（下次怎么避免）**: ${errorCase.q3Answer || "未回答"}

请根据以上信息生成一条简短的防错规则。`;

      finalRule = await chat(
        [{ role: "user", content: contextInfo }],
        `${baseSystemPrompt}\n\n${generateRulePrompt}`,
        256
      );
    }

    if (!finalRule) {
      return NextResponse.json(
        { error: "请提供规则内容" },
        { status: 400 }
      );
    }

    // 创建规则
    const preventionRule = await prisma.preventionRule.create({
      data: {
        userId: session.user.id,
        errorType,
        rule: finalRule.trim(),
        examples: errorCaseId ? [errorCaseId] : [],
      },
    });

    // 如果有关联的错题记录，更新关联
    if (errorCaseId) {
      await prisma.errorCase.update({
        where: { id: errorCaseId },
        data: { preventionRuleId: preventionRule.id },
      });
    }

    return NextResponse.json({ preventionRule });
  } catch (error) {
    console.error("Create prevention rule error:", error);
    return NextResponse.json(
      { error: "创建防错规则失败" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";
import { chat } from "@/lib/claude";
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt";

// 检查是否触发已有规则
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const body = await request.json();
    const { code, problemId, problemDescription } = body;

    if (!code) {
      return NextResponse.json(
        { error: "请提供代码" },
        { status: 400 }
      );
    }

    // 获取用户的所有活跃规则
    const rules = await prisma.preventionRule.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      select: {
        id: true,
        errorType: true,
        rule: true,
        hitCount: true,
      },
      orderBy: { hitCount: "desc" },
    });

    if (rules.length === 0) {
      return NextResponse.json({
        triggered: false,
        message: "暂无防错规则",
      });
    }

    // 构建规则列表
    const rulesText = rules.map((r, i) =>
      `${i + 1}. [${r.errorType}] ${r.rule}`
    ).join("\n");

    // 调用 AI 检查代码是否可能触发规则
    const checkPrompt = `你是一位代码检查助手。请分析学生的代码，检查是否可能违反以下防错规则。

**防错规则列表**:
${rulesText}

**学生代码**:
\`\`\`cpp
${code}
\`\`\`

${problemDescription ? `**题目描述**:\n${problemDescription}` : ""}

请分析代码，返回以下 JSON 格式：
{
  "triggered": true/false,
  "triggeredRules": [规则序号数组，如 [1, 3]],
  "warnings": [
    {
      "ruleIndex": 规则序号,
      "issue": "具体问题描述",
      "suggestion": "改进建议"
    }
  ]
}

如果代码没有明显违反任何规则，triggered 应为 false。
只有当代码有较高可能违反规则时才返回 triggered: true。`;

    const errorBase = await getSystemPrompt("error-base");
    const response = await chat(
      [{ role: "user", content: checkPrompt }],
      errorBase,
      1024
    );

    // 解析响应
    let checkResult = {
      triggered: false,
      triggeredRules: [] as number[],
      warnings: [] as Array<{
        ruleIndex: number;
        issue: string;
        suggestion: string;
      }>,
    };

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        checkResult = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // 解析失败，使用默认结果
    }

    // 如果触发了规则，更新规则的命中次数
    if (checkResult.triggered && checkResult.triggeredRules.length > 0) {
      const triggeredRuleIds = checkResult.triggeredRules
        .map((index) => rules[index - 1]?.id)
        .filter(Boolean);

      await Promise.all(
        triggeredRuleIds.map((ruleId) =>
          prisma.preventionRule.update({
            where: { id: ruleId },
            data: {
              hitCount: { increment: 1 },
              lastHitAt: new Date(),
            },
          })
        )
      );
    }

    // 返回详细的触发信息
    const triggeredRulesDetails = checkResult.triggeredRules
      .map((index) => rules[index - 1])
      .filter(Boolean)
      .map((rule) => ({
        id: rule.id,
        errorType: rule.errorType,
        rule: rule.rule,
        hitCount: rule.hitCount,
      }));

    return NextResponse.json({
      triggered: checkResult.triggered,
      triggeredRules: triggeredRulesDetails,
      warnings: checkResult.warnings.map((w) => ({
        ...w,
        rule: rules[w.ruleIndex - 1]?.rule || "",
      })),
    });
  } catch (error) {
    console.error("Check prevention rules error:", error);
    return NextResponse.json(
      { error: "检查防错规则失败" },
      { status: 500 }
    );
  }
}

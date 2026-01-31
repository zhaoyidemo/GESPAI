import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { mapDifficulty } from "@/lib/luogu-sync";

/**
 * POST: 批量导入洛谷题目数据
 * 接收从浏览器脚本获取的原始洛谷数据
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problems, level } = body;

    if (!Array.isArray(problems) || problems.length === 0) {
      return NextResponse.json(
        { success: false, error: "请提供题目数据数组" },
        { status: 400 }
      );
    }

    if (!level || level < 4 || level > 6) {
      return NextResponse.json(
        { success: false, error: "请提供有效的级别 (4-6)" },
        { status: 400 }
      );
    }

    const results: Array<{
      problemId: string;
      action: string;
      title?: string;
      error?: string;
    }> = [];

    for (const p of problems) {
      try {
        // 验证必要字段
        if (!p.pid || !p.title) {
          results.push({
            problemId: p.pid || "unknown",
            action: "error",
            error: "缺少 pid 或 title",
          });
          continue;
        }

        // 解析样例数据
        const samples: Array<{ input: string; output: string }> = [];
        if (p.samples && Array.isArray(p.samples)) {
          for (const sample of p.samples) {
            if (Array.isArray(sample)) {
              samples.push({
                input: sample[0] || "",
                output: sample[1] || "",
              });
            } else if (sample.input !== undefined) {
              samples.push({
                input: sample.input || "",
                output: sample.output || "",
              });
            }
          }
        }

        // 构建题目数据 - 注意：不包含 background 字段
        const problemData = {
          title: p.title,
          source: "gesp_official",
          sourceId: p.pid,
          sourceUrl: `https://www.luogu.com.cn/problem/${p.pid}`,
          level: level,
          // background 已移除
          description: p.description || "",
          inputFormat: p.inputFormat || "",
          outputFormat: p.outputFormat || "",
          samples: samples,
          testCases: samples,
          hint: p.hint || "",
          difficulty: mapDifficulty(p.difficulty || 0),
          knowledgePoints: p.tags?.map((t: { name: string } | string) =>
            typeof t === "string" ? t : t.name
          ) || [],
          timeLimit: p.limits?.time?.[0] || 1000,
          memoryLimit: Math.floor((p.limits?.memory?.[0] || 262144) / 1024), // 转换为 MB
        };

        // 检查是否存在
        const existing = await prisma.problem.findFirst({
          where: { sourceId: p.pid },
        });

        if (existing) {
          // 更新现有题目
          await prisma.problem.update({
            where: { id: existing.id },
            data: problemData,
          });
          results.push({
            problemId: p.pid,
            action: "updated",
            title: p.title,
          });
        } else {
          // 创建新题目
          await prisma.problem.create({
            data: problemData,
          });
          results.push({
            problemId: p.pid,
            action: "created",
            title: p.title,
          });
        }
      } catch (error) {
        results.push({
          problemId: p.pid || "unknown",
          action: "error",
          error: String(error),
        });
      }
    }

    const summary = {
      total: problems.length,
      created: results.filter((r) => r.action === "created").length,
      updated: results.filter((r) => r.action === "updated").length,
      errors: results.filter((r) => r.action === "error").length,
    };

    return NextResponse.json({
      success: true,
      level,
      summary,
      results,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET: 生成浏览器脚本
 * 用户在洛谷运行此脚本来获取题目数据
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get("level") || "5";

  // GESP 题目 ID 列表
  const problemLists: Record<string, string[]> = {
    "4": [
      "B3921", "B3922", "B3861", "B3862", "B3899", "B3900",
      "B3955", "B3956", "P10696", "P10697", "B4029", "B4030",
      "B4056", "B4057", "P11929", "P11930", "P12977", "P12978",
      "P14038", "P14039", "P14881", "P14882"
    ],
    "5": [
      "B3941", "B3951", "B3871", "B3872", "B3929", "B3930",
      "B3968", "B3969", "P10719", "P10720", "B4050", "B4051",
      "B4070", "B4071", "P11960", "P11961", "P13013", "P13014",
      "P14073", "P14074", "P14917", "P14918"
    ],
    "6": [
      "B3924", "B3923", "B3880", "B3879", "B3912", "B3911",
      "B3982", "B3981", "P10724", "P10723", "B4040", "B4039",
      "B4085", "B4084", "P11993", "P11992", "P13048", "P13047",
      "P14108", "P14107", "P14952", "P14951"
    ],
  };

  const problemIds = problemLists[level] || problemLists["5"];

  // 生成浏览器脚本
  const script = `
// GESP AI 洛谷题目同步脚本
// 在洛谷任意页面的 Console 中运行此脚本

(async function() {
  const problemIds = ${JSON.stringify(problemIds)};
  const level = ${level};
  const results = [];
  const errors = [];

  console.log('开始获取 GESP ' + level + ' 级题目数据...');
  console.log('共 ' + problemIds.length + ' 道题目');

  for (let i = 0; i < problemIds.length; i++) {
    const pid = problemIds[i];
    console.log('正在获取 [' + (i+1) + '/' + problemIds.length + ']: ' + pid);

    try {
      const response = await fetch('/problem/' + pid + '?_contentOnly=1');
      const data = await response.json();

      if (data.code === 200 && data.currentData && data.currentData.problem) {
        results.push(data.currentData.problem);
        console.log('✓ ' + pid + ': ' + data.currentData.problem.title);
      } else {
        errors.push({ pid, error: '获取失败' });
        console.error('✗ ' + pid + ': 获取失败');
      }
    } catch (e) {
      errors.push({ pid, error: e.message });
      console.error('✗ ' + pid + ': ' + e.message);
    }

    // 添加延迟避免请求过快
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\\n========== 完成 ==========');
  console.log('成功: ' + results.length + ' / ' + problemIds.length);
  if (errors.length > 0) {
    console.log('失败: ' + errors.length);
    console.log('失败的题目:', errors);
  }

  // 生成导入数据
  const importData = JSON.stringify({ level, problems: results });

  console.log('\\n复制以下数据到 GESP AI 管理后台:');
  console.log('='.repeat(50));
  console.log(importData);
  console.log('='.repeat(50));

  // 尝试复制到剪贴板
  try {
    await navigator.clipboard.writeText(importData);
    console.log('\\n✓ 数据已自动复制到剪贴板！');
  } catch (e) {
    console.log('\\n无法自动复制，请手动选择上方数据复制');
  }

  return { success: results.length, failed: errors.length, data: importData };
})();
`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
    },
  });
}

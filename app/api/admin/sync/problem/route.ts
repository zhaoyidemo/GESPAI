import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { fetchLuoguProblem, mapDifficulty } from "@/lib/luogu-sync";

/**
 * GET: 测试接口是否可用
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "使用 POST 方法同步题目",
    usage: "POST { problemId: 'B3941', level: 5 }"
  });
}

/**
 * POST: 同步单个题目
 * body: { problemId: "B4051", level: 5 }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemId, level } = body;

    if (!problemId) {
      return NextResponse.json(
        { success: false, error: "缺少 problemId" },
        { status: 400 }
      );
    }

    // 从洛谷获取题目
    const result = await fetchLuoguProblem(problemId);

    if (!result.success || !result.problem) {
      return NextResponse.json({
        success: false,
        error: result.error || "无法获取洛谷题目",
        problemId,
      });
    }

    const remote = result.problem;

    // 构建题目数据
    const problemData = {
      title: remote.title,
      source: "gesp_official",
      sourceId: remote.pid,
      sourceUrl: `https://www.luogu.com.cn/problem/${remote.pid}`,
      level: level || 5,
      background: remote.background,
      description: remote.description,
      inputFormat: remote.inputFormat,
      outputFormat: remote.outputFormat,
      samples: remote.samples,
      testCases: remote.samples,
      hint: remote.hint,
      difficulty: mapDifficulty(remote.difficulty),
      knowledgePoints: remote.tags,
      timeLimit: 1000,
      memoryLimit: 256,
    };

    // 检查本地是否存在
    const existing = await prisma.problem.findFirst({
      where: { sourceId: problemId },
    });

    if (existing) {
      // 更新
      await prisma.problem.update({
        where: { id: existing.id },
        data: problemData,
      });
      return NextResponse.json({
        success: true,
        action: "updated",
        problemId,
        title: remote.title,
      });
    } else {
      // 新增
      await prisma.problem.create({
        data: problemData,
      });
      return NextResponse.json({
        success: true,
        action: "created",
        problemId,
        title: remote.title,
      });
    }
  } catch (error) {
    console.error("Sync problem error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

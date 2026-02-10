import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  fetchLuoguProblem,
  fetchLuoguTrainingProblems,
  compareProblem,
  GESP_TRAINING_IDS,
  mapDifficulty,
  LuoguProblem,
} from "@/lib/luogu-sync";
import { requireAdmin } from "@/lib/require-admin";

/**
 * GET: 检查题库同步状态
 * - ?level=5 检查指定级别的所有题目
 * - ?problemId=B4051 检查单个题目
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get("level");
  const problemId = searchParams.get("problemId");

  try {
    if (problemId) {
      // 检查单个题目
      return await checkSingleProblem(problemId);
    } else if (level) {
      // 检查整个级别
      return await checkLevel(parseInt(level));
    } else {
      return NextResponse.json({
        error: "请提供 level 或 problemId 参数",
        usage: {
          checkLevel: "/api/admin/sync?level=5",
          checkProblem: "/api/admin/sync?problemId=B4051",
        },
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Sync check error:", error);
    return NextResponse.json({ error: "同步检查失败" }, { status: 500 });
  }
}

/**
 * POST: 执行同步
 * - body: { level: 5 } 同步整个级别
 * - body: { problemId: "B4051" } 同步单个题目
 * - body: { level: 5, force: true } 强制重新同步（删除后重建）
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await request.json();
    const { level, problemId, force } = body;

    if (problemId) {
      return await syncSingleProblem(problemId, force);
    } else if (level) {
      return await syncLevel(parseInt(level), force);
    } else {
      return NextResponse.json({
        error: "请提供 level 或 problemId",
        usage: {
          syncLevel: "POST { level: 5 }",
          syncProblem: "POST { problemId: 'B4051' }",
          forceSync: "POST { level: 5, force: true }",
        },
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "同步执行失败" }, { status: 500 });
  }
}

// ============ 辅助函数 ============

async function checkSingleProblem(problemId: string) {
  // 获取本地题目
  const localProblem = await prisma.problem.findFirst({
    where: { sourceId: problemId },
  });

  // 获取洛谷题目
  const remoteResult = await fetchLuoguProblem(problemId);

  if (!remoteResult.success || !remoteResult.problem) {
    return NextResponse.json({
      problemId,
      error: remoteResult.error || "无法获取洛谷题目",
    });
  }

  const remote = remoteResult.problem;

  if (!localProblem) {
    return NextResponse.json({
      problemId,
      status: "missing",
      message: "本地不存在该题目",
      remote: {
        title: remote.title,
        pid: remote.pid,
      },
    });
  }

  // 对比差异
  const diffs = compareProblem(
    {
      background: localProblem.background || "",
      description: localProblem.description,
      inputFormat: localProblem.inputFormat || "",
      outputFormat: localProblem.outputFormat || "",
      samples: localProblem.samples as Array<{ input: string; output: string }>,
      hint: localProblem.hint || "",
    },
    remote
  );

  const hasDiff = diffs.some((d) => d.isDifferent);

  return NextResponse.json({
    problemId,
    localTitle: localProblem.title,
    remoteTitle: remote.title,
    status: hasDiff ? "different" : "synced",
    differences: diffs.filter((d) => d.isDifferent),
  });
}

async function checkLevel(level: number) {
  const trainingId = GESP_TRAINING_IDS[level];
  if (!trainingId) {
    return NextResponse.json({ error: `不支持的级别: ${level}` }, { status: 400 });
  }

  // 获取洛谷题单中的所有题目ID
  const trainingResult = await fetchLuoguTrainingProblems(trainingId);
  if (!trainingResult.success || !trainingResult.problemIds) {
    return NextResponse.json({
      error: trainingResult.error || "无法获取洛谷题单",
    }, { status: 500 });
  }

  const remoteProblemIds = trainingResult.problemIds;

  // 获取本地该级别的所有题目
  const localProblems = await prisma.problem.findMany({
    where: { level },
    select: { sourceId: true, title: true },
  });

  const localIds = new Set(localProblems.map((p) => p.sourceId));
  const remoteIds = new Set(remoteProblemIds);

  // 找出差异
  const missing = remoteProblemIds.filter((id: string) => !localIds.has(id));
  const extra = localProblems.filter((p) => p.sourceId && !remoteIds.has(p.sourceId));
  const synced = remoteProblemIds.filter((id: string) => localIds.has(id));

  return NextResponse.json({
    level,
    trainingId,
    trainingUrl: `https://www.luogu.com.cn/training/${trainingId}`,
    summary: {
      remote: remoteProblemIds.length,
      local: localProblems.length,
      synced: synced.length,
      missing: missing.length,
      extra: extra.length,
    },
    missing,  // 洛谷有但本地没有
    extra,    // 本地有但洛谷没有
    synced,   // 都有的
  });
}

async function syncSingleProblem(problemId: string, force: boolean = false) {
  // 从洛谷获取题目
  const result = await fetchLuoguProblem(problemId);

  if (!result.success || !result.problem) {
    return NextResponse.json({
      success: false,
      error: result.error || "无法获取洛谷题目",
    }, { status: 500 });
  }

  const remote = result.problem;

  // 检查本地是否存在
  const existing = await prisma.problem.findFirst({
    where: { sourceId: problemId },
  });

  const problemData = {
    title: remote.title,
    source: "gesp_official",
    sourceId: remote.pid,
    sourceUrl: `https://www.luogu.com.cn/problem/${remote.pid}`,
    // background 已移除
    description: remote.description,
    inputFormat: remote.inputFormat,
    outputFormat: remote.outputFormat,
    samples: remote.samples,
    testCases: remote.samples, // 使用样例作为测试用例
    hint: remote.hint,
    difficulty: mapDifficulty(remote.difficulty),
    knowledgePoints: remote.tags,
    timeLimit: 1000,
    memoryLimit: 256,
  };

  if (existing) {
    if (force) {
      // 强制更新
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
      // 对比差异
      const diffs = compareProblem(
        {
          background: existing.background || "",
          description: existing.description,
          inputFormat: existing.inputFormat || "",
          outputFormat: existing.outputFormat || "",
          samples: existing.samples as Array<{ input: string; output: string }>,
          hint: existing.hint || "",
        },
        remote
      );

      const hasDiff = diffs.some((d) => d.isDifferent);

      if (hasDiff) {
        // 有差异，更新
        await prisma.problem.update({
          where: { id: existing.id },
          data: problemData,
        });
        return NextResponse.json({
          success: true,
          action: "updated",
          problemId,
          title: remote.title,
          updatedFields: diffs.filter((d) => d.isDifferent).map((d) => d.field),
        });
      } else {
        return NextResponse.json({
          success: true,
          action: "unchanged",
          problemId,
          title: remote.title,
          message: "题目内容与洛谷一致，无需更新",
        });
      }
    }
  } else {
    // 新增题目 - 需要级别信息
    // 从题目ID推断级别（如果是GESP题目的话）
    return NextResponse.json({
      success: false,
      error: "题目不存在，请使用级别同步功能添加新题目",
      problemId,
    }, { status: 400 });
  }
}

async function syncLevel(level: number, force: boolean = false) {
  const trainingId = GESP_TRAINING_IDS[level];
  if (!trainingId) {
    return NextResponse.json({ error: `不支持的级别: ${level}` }, { status: 400 });
  }

  // 获取洛谷题单
  const trainingResult = await fetchLuoguTrainingProblems(trainingId);
  if (!trainingResult.success || !trainingResult.problemIds) {
    return NextResponse.json({
      error: trainingResult.error || "无法获取洛谷题单",
    }, { status: 500 });
  }

  const problemIds = trainingResult.problemIds;
  const results: Array<{
    problemId: string;
    action: string;
    title?: string;
    error?: string;
  }> = [];

  // 如果强制同步，先删除该级别所有题目
  if (force) {
    await prisma.problem.deleteMany({
      where: { level },
    });
  }

  // 逐个同步题目
  for (const problemId of problemIds) {
    try {
      const result = await fetchLuoguProblem(problemId);

      if (!result.success || !result.problem) {
        results.push({
          problemId,
          action: "error",
          error: result.error || "获取失败",
        });
        continue;
      }

      const remote = result.problem;

      const problemData = {
        title: remote.title,
        source: "gesp_official",
        sourceId: remote.pid,
        sourceUrl: `https://www.luogu.com.cn/problem/${remote.pid}`,
        level,
        // background 已移除
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

      // 检查是否存在
      const existing = await prisma.problem.findFirst({
        where: { sourceId: problemId },
      });

      if (existing) {
        await prisma.problem.update({
          where: { id: existing.id },
          data: problemData,
        });
        results.push({
          problemId,
          action: "updated",
          title: remote.title,
        });
      } else {
        await prisma.problem.create({
          data: problemData,
        });
        results.push({
          problemId,
          action: "created",
          title: remote.title,
        });
      }

      // 添加延迟避免请求过快
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      results.push({
        problemId,
        action: "error",
        error: String(error),
      });
    }
  }

  const summary = {
    total: problemIds.length,
    created: results.filter((r) => r.action === "created").length,
    updated: results.filter((r) => r.action === "updated").length,
    errors: results.filter((r) => r.action === "error").length,
  };

  return NextResponse.json({
    success: true,
    level,
    trainingId,
    summary,
    results,
  });
}

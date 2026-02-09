import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export interface SeedProblem {
  title: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  level: number;
  knowledgePoints: string[];
  difficulty: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  background?: string;
  samples: Array<{ input: string; output: string; explanation?: string }>;
  testCases: Array<{ input: string; output: string }>;
  timeLimit: number;
  memoryLimit: number;
  hint?: string;
  solution?: string;
}

export async function seedProblems(
  problems: SeedProblem[],
  levelLabel: string
): Promise<NextResponse> {
  try {
    let addedCount = 0;
    let updatedCount = 0;

    for (const problem of problems) {
      const existing = await prisma.problem.findFirst({
        where: { sourceId: problem.sourceId },
      });

      if (existing) {
        await prisma.problem.update({
          where: { id: existing.id },
          data: problem,
        });
        updatedCount++;
      } else {
        await prisma.problem.create({
          data: problem,
        });
        addedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${levelLabel}：新增 ${addedCount} 道，更新 ${updatedCount} 道`,
      addedCount,
      updatedCount,
      totalCount: problems.length,
    });
  } catch (error) {
    console.error(`Seed ${levelLabel} error:`, error);
    return NextResponse.json(
      { error: "添加题目失败", details: String(error) },
      { status: 500 }
    );
  }
}

export function createSeedHandler(
  problems: SeedProblem[],
  levelLabel: string
) {
  async function handler() {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;
    return seedProblems(problems, levelLabel);
  }

  return { GET: handler, POST: handler };
}

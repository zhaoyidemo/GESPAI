import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// 清理数据库中 1-3 级和 7-8 级的题目和知识点
// 只保留 4-6 级的数据
async function cleanupLevels() {
  try {
    // 删除 1-3 级和 7-8 级的题目
    const deletedProblems = await prisma.problem.deleteMany({
      where: {
        OR: [
          { level: 1 },
          { level: 2 },
          { level: 3 },
          { level: 7 },
          { level: 8 },
        ]
      }
    });

    // 删除 1-3 级和 7-8 级的知识点
    const deletedKnowledgePoints = await prisma.knowledgePoint.deleteMany({
      where: {
        OR: [
          { level: 1 },
          { level: 2 },
          { level: 3 },
          { level: 7 },
          { level: 8 },
        ]
      }
    });

    return NextResponse.json({
      success: true,
      message: "已清理 1-3 级和 7-8 级的数据，只保留 4-6 级",
      deleted: {
        problems: deletedProblems.count,
        knowledgePoints: deletedKnowledgePoints.count,
      }
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json({ error: "清理数据失败", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return cleanupLevels();
}

export async function POST() {
  return cleanupLevels();
}

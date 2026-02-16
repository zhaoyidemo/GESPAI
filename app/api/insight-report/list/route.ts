import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const reports = await prisma.insightReport.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      select: {
        id: true,
        level: true,
        totalProblems: true,
        solvedProblems: true,
        insights: true,
        generatedAt: true,
        createdAt: true,
      }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('获取历史报告失败:', error)
    return NextResponse.json(
      { error: '获取历史报告失败' },
      { status: 500 }
    )
  }
}

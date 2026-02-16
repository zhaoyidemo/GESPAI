import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  const reportId = params.id

  try {
    const report = await prisma.insightReport.findUnique({
      where: { id: reportId }
    })

    if (!report) {
      return NextResponse.json({ error: "报告不存在" }, { status: 404 })
    }

    // 检查权限（只能查看自己的报告）
    if (report.userId !== session.user.id) {
      return NextResponse.json({ error: "无权访问" }, { status: 403 })
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('获取报告失败:', error)
    return NextResponse.json(
      { error: '获取报告失败' },
      { status: 500 }
    )
  }
}

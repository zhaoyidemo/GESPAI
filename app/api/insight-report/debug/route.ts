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
  const level = 5

  try {
    // 获取所有提交
    const submissions = await prisma.submission.findMany({
      where: {
        userId,
        problem: { level }
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            knowledgePoints: true,
            difficulty: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // 统计
    const uniqueProblems = new Set(submissions.map(s => s.problemId))
    const acceptedProblems = new Set(
      submissions.filter(s => s.status === 'accepted').map(s => s.problemId)
    )

    // 按题目分组
    const problemGroups: Record<string, any[]> = {}
    submissions.forEach(sub => {
      if (!problemGroups[sub.problemId]) {
        problemGroups[sub.problemId] = []
      }
      problemGroups[sub.problemId].push({
        status: sub.status,
        createdAt: sub.createdAt,
      })
    })

    // 题目列表
    const problemList = Array.from(uniqueProblems).map(problemId => {
      const subs = problemGroups[problemId]
      const problem = submissions.find(s => s.problemId === problemId)?.problem
      const hasAccepted = subs.some(s => s.status === 'accepted')

      return {
        id: problemId,
        title: problem?.title,
        knowledgePoints: problem?.knowledgePoints,
        submissionCount: subs.length,
        statuses: subs.map(s => s.status),
        hasAccepted,
        firstSubmitAt: subs[subs.length - 1].createdAt,
        lastSubmitAt: subs[0].createdAt,
      }
    })

    return NextResponse.json({
      summary: {
        totalSubmissions: submissions.length,
        uniqueProblems: uniqueProblems.size,
        acceptedProblems: acceptedProblems.size,
        passRate: Math.round((acceptedProblems.size / uniqueProblems.size) * 100) + '%',
      },
      problemList: problemList.sort((a, b) =>
        new Date(b.lastSubmitAt).getTime() - new Date(a.lastSubmitAt).getTime()
      ),
      statusDistribution: {
        accepted: submissions.filter(s => s.status === 'accepted').length,
        wrong_answer: submissions.filter(s => s.status === 'wrong_answer').length,
        time_limit: submissions.filter(s => s.status === 'time_limit').length,
        compile_error: submissions.filter(s => s.status === 'compile_error').length,
        runtime_error: submissions.filter(s => s.status === 'runtime_error').length,
      }
    })
  } catch (error) {
    console.error('调试接口错误:', error)
    return NextResponse.json(
      { error: '获取数据失败' },
      { status: 500 }
    )
  }
}

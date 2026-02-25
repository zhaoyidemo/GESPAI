import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Anthropic from "@anthropic-ai/sdk"
import { GESP_LEVEL5_SYLLABUS, mapKnowledgePoint, getKnowledgePointConfig } from "@/lib/gesp-syllabus"
import { getSystemPrompt } from "@/lib/prompts/get-system-prompt"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  const userId = session.user.id
  const level = 5 // 目前只做5级

  try {
    // ============================================================
    // 1. 全面数据收集（6个数据源并行查询）
    // ============================================================
    const [submissions, problems, errorCases, preventionRules, learningRecords] = await Promise.all([
      // 1) 提交记录（含 testResults 和 aiConversations）
      prisma.submission.findMany({
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
        orderBy: { createdAt: 'asc' }
      }),

      // 2) 5级所有题目
      prisma.problem.findMany({
        where: { level },
        select: {
          id: true,
          title: true,
          knowledgePoints: true,
          difficulty: true,
        }
      }),

      // 3) 错题本：只取已完成且三问已填写的记录
      prisma.errorCase.findMany({
        where: {
          userId,
          problem: { level },
          status: 'completed',
          q1Answer: { not: null },
        },
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              knowledgePoints: true,
            }
          },
          submission: {
            select: {
              status: true,
              code: true,
              testResults: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),

      // 4) 防错规则（活跃的）
      prisma.preventionRule.findMany({
        where: {
          userId,
          isActive: true,
        },
        include: {
          errorCases: {
            select: {
              problem: {
                select: { title: true }
              }
            }
          }
        },
        orderBy: { hitCount: 'desc' }
      }),

      // 5) 知识点学习记录
      prisma.learningRecord.findMany({
        where: { userId },
        include: {
          knowledgePoint: {
            select: {
              name: true,
              level: true,
              category: true,
            }
          }
        }
      }),
    ])

    // 检查题数要求
    const uniqueProblems = new Set(submissions.map(s => s.problemId))
    if (uniqueProblems.size < 20) {
      return NextResponse.json(
        { error: `至少需要完成20道题才能生成报告，当前已完成 ${uniqueProblems.size} 道题` },
        { status: 400 }
      )
    }

    // ============================================================
    // 2. 数据清洗与计算
    // ============================================================

    // 2a. 防错规则去重合并
    const deduplicatedRules = deduplicatePreventionRules(preventionRules)

    // 2b. 计算 AI 求助依赖度
    const aiDependency = analyzeAIDependency(submissions)

    // 2c. 分析反思质量
    const reflectionQuality = analyzeReflectionQuality(errorCases)

    // 2d. 知识点掌握度（从 LearningRecord）
    const masteryData = analyzeMastery(learningRecords, level)

    // 2e. 知识点练习统计（不再强调正确率）
    const knowledgeStats = analyzeKnowledgePoints(submissions)

    // 2f. 基础统计
    const totalProblems = uniqueProblems.size
    const solvedProblems = new Set(
      submissions.filter(s => s.status === 'accepted').map(s => s.problemId)
    ).size

    // ============================================================
    // 3. 调用 Claude 生成报告
    // ============================================================
    const report = await generateReportWithAI({
      userId,
      level,
      totalProblems,
      solvedProblems,
      knowledgeStats,
      errorCases,
      deduplicatedRules,
      aiDependency,
      reflectionQuality,
      masteryData,
      submissions,
    })

    // 4. 保存报告
    const savedReport = await prisma.insightReport.create({
      data: {
        userId,
        level,
        totalProblems,
        solvedProblems,
        knowledgePointsCoverage: JSON.parse(JSON.stringify(knowledgeStats)),
        studentVersion: report.studentVersion,
        parentVersion: report.parentVersion,
        teacherVersion: report.teacherVersion,
        insights: JSON.parse(JSON.stringify(report.insights)),
        modelUsed: 'claude-opus-4-6',
        promptVersion: 'v2.0',
      }
    })

    return NextResponse.json({ reportId: savedReport.id })
  } catch (error) {
    console.error('生成报告失败:', error)
    return NextResponse.json(
      { error: '生成报告失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// ============================================================
// 防错规则去重合并
// ============================================================
function deduplicatePreventionRules(rules: any[]) {
  const seen = new Map<string, any>()

  for (const rule of rules) {
    // 用规则内容的前20字符作为去重 key
    const key = rule.rule.trim().substring(0, 20)
    const existing = seen.get(key)

    if (!existing || rule.hitCount > existing.hitCount) {
      seen.set(key, {
        ...rule,
        // 合并 hitCount
        hitCount: existing ? existing.hitCount + rule.hitCount : rule.hitCount,
        // 收集关联的题目名
        relatedProblems: rule.errorCases?.map((ec: any) => ec.problem.title).filter(Boolean) || [],
      })
    }
  }

  return Array.from(seen.values())
    .sort((a, b) => b.hitCount - a.hitCount)
}

// ============================================================
// AI 求助依赖度分析
// ============================================================
function analyzeAIDependency(submissions: any[]) {
  // 按题目分组
  const problemMap = new Map<string, { title: string, totalSubmissions: number, aiHelpTotal: number, hasAIConversations: boolean }>()

  for (const sub of submissions) {
    const pid = sub.problemId
    const existing = problemMap.get(pid) || {
      title: sub.problem.title,
      totalSubmissions: 0,
      aiHelpTotal: 0,
      hasAIConversations: false,
    }

    existing.totalSubmissions++
    existing.aiHelpTotal += sub.aiHelpCount || 0
    if (sub.aiConversations && Array.isArray(sub.aiConversations) && sub.aiConversations.length > 0) {
      existing.hasAIConversations = true
    }

    problemMap.set(pid, existing)
  }

  const allProblems = Array.from(problemMap.values())
  const totalAIHelp = allProblems.reduce((sum, p) => sum + p.aiHelpTotal, 0)
  const problemsWithAIHelp = allProblems.filter(p => p.aiHelpTotal > 0)
  const heavyDependency = allProblems.filter(p => p.aiHelpTotal >= 3)

  return {
    totalProblems: allProblems.length,
    totalAIHelpRequests: totalAIHelp,
    averageAIHelpPerProblem: allProblems.length > 0
      ? (totalAIHelp / allProblems.length).toFixed(1)
      : '0',
    problemsWithAIHelp: problemsWithAIHelp.length,
    heavyDependencyProblems: heavyDependency.map(p => ({
      title: p.title,
      aiHelpCount: p.aiHelpTotal,
    })),
    independencRate: allProblems.length > 0
      ? Math.round(((allProblems.length - problemsWithAIHelp.length) / allProblems.length) * 100)
      : 0,
  }
}

// ============================================================
// 反思质量分析
// ============================================================
function analyzeReflectionQuality(errorCases: any[]) {
  if (errorCases.length === 0) {
    return {
      totalCompleted: 0,
      averageDepth: '无数据',
      qualityDistribution: { deep: 0, moderate: 0, shallow: 0 },
      commonPatterns: [],
      bestReflection: null,
    }
  }

  let deep = 0, moderate = 0, shallow = 0
  const patterns: string[] = []

  const scored = errorCases.map(ec => {
    const q1Len = ec.q1Answer?.length || 0
    const q2Len = ec.q2Answer?.length || 0
    const q3Len = ec.q3Answer?.length || 0
    const totalLen = q1Len + q2Len + q3Len

    // 反思深度评分：根据回答长度和是否有具体内容
    let depthScore = 0

    // 长度评分（0-40分）
    depthScore += Math.min(totalLen / 3, 40)

    // q2 "为什么错" 是最重要的问题
    if (q2Len > 15) depthScore += 20
    else if (q2Len > 5) depthScore += 10

    // q3 "怎么避免" 有具体行动
    if (q3Len > 15) depthScore += 20
    else if (q3Len > 5) depthScore += 10

    // 关键词加分（深层思考的标志）
    const allText = `${ec.q1Answer || ''} ${ec.q2Answer || ''} ${ec.q3Answer || ''}`
    if (allText.includes('因为') || allText.includes('原因')) depthScore += 5
    if (allText.includes('以后') || allText.includes('下次') || allText.includes('避免')) depthScore += 5
    if (allText.includes('检查') || allText.includes('确认') || allText.includes('审题')) depthScore += 5

    if (depthScore >= 60) deep++
    else if (depthScore >= 30) moderate++
    else shallow++

    // 收集错误模式
    if (ec.q2Answer) patterns.push(ec.q2Answer)

    return { ...ec, depthScore }
  })

  // 找最佳反思
  const best = scored.sort((a, b) => b.depthScore - a.depthScore)[0]

  // 提取常见错误模式
  const commonPatterns = extractCommonPatterns(patterns)

  return {
    totalCompleted: errorCases.length,
    averageDepth: scored.length > 0
      ? Math.round(scored.reduce((sum, s) => sum + s.depthScore, 0) / scored.length)
      : 0,
    qualityDistribution: { deep, moderate, shallow },
    commonPatterns,
    bestReflection: best ? {
      problem: best.problem.title,
      q1: best.q1Answer,
      q2: best.q2Answer,
      q3: best.q3Answer,
      score: best.depthScore,
    } : null,
  }
}

// 提取常见错误模式
function extractCommonPatterns(answers: string[]) {
  const keywords = new Map<string, number>()
  const patterns = [
    { key: '审题不仔细', words: ['没有仔细', '读题', '审题', '读错', '题意'] },
    { key: '边界条件遗漏', words: ['边界', '特殊情况', '极端', '特判', '特殊'] },
    { key: '变量初始化错误', words: ['初始', '初始值', '初始化'] },
    { key: '数据类型选择错误', words: ['long long', '溢出', 'int', '数据类型', 'double'] },
    { key: '循环边界错误', words: ['循环', '下标', '越界', '多一', '少一'] },
    { key: '逻辑条件写反', words: ['>=', '<=', '大于', '小于', '等于', '判断', '条件'] },
  ]

  for (const answer of answers) {
    for (const pattern of patterns) {
      if (pattern.words.some(w => answer.includes(w))) {
        keywords.set(pattern.key, (keywords.get(pattern.key) || 0) + 1)
      }
    }
  }

  return Array.from(keywords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pattern, count]) => ({ pattern, count }))
}

// ============================================================
// 知识点掌握度分析（来自 LearningRecord）
// ============================================================
function analyzeMastery(records: any[], level: number) {
  const level5Records = records.filter(r => r.knowledgePoint.level === level)

  return level5Records.map(r => ({
    name: r.knowledgePoint.name,
    category: r.knowledgePoint.category,
    masteryLevel: r.masteryLevel,
    status: r.status,
    studyTime: r.studyTime,
    tutorCompleted: r.tutorCompleted,
    feynmanCompleted: r.feynmanCompleted,
    feynmanScore: r.feynmanScore,
  })).sort((a, b) => b.masteryLevel - a.masteryLevel)
}

// ============================================================
// 知识点练习统计（弱化正确率）
// ============================================================
function analyzeKnowledgePoints(submissions: any[]) {
  const stats: Record<string, any> = {}

  submissions.forEach(sub => {
    sub.problem.knowledgePoints.forEach((kp: string) => {
      const mappedKP = mapKnowledgePoint(kp)

      if (!stats[mappedKP]) {
        stats[mappedKP] = {
          name: mappedKP,
          attempted: new Set(),
          solved: new Set(),
          totalSubmissions: 0,
          totalAIHelp: 0,
        }
      }

      stats[mappedKP].attempted.add(sub.problemId)
      if (sub.status === 'accepted') {
        stats[mappedKP].solved.add(sub.problemId)
      }
      stats[mappedKP].totalSubmissions++
      stats[mappedKP].totalAIHelp += sub.aiHelpCount || 0
    })
  })

  return Object.entries(stats).map(([kp, data]: [string, any]) => {
    const config = getKnowledgePointConfig(kp)
    const attemptedCount = data.attempted.size
    return {
      name: kp,
      attemptedCount,
      averageSubmissionsPerProblem: attemptedCount > 0
        ? (data.totalSubmissions / attemptedCount).toFixed(1)
        : '0',
      averageAIHelpPerProblem: attemptedCount > 0
        ? (data.totalAIHelp / attemptedCount).toFixed(1)
        : '0',
      syllabus: config ? {
        weight: config.weight,
        importance: config.importance,
        minProblems: config.minProblems
      } : null,
    }
  })
}

// ============================================================
// AI 生成报告
// ============================================================
async function generateReportWithAI(data: any) {
  const promptTemplate = await getSystemPrompt('insight_report_generate')
  const systemPrompt = await getSystemPrompt('insight_report_system')

  // --- 格式化各数据段 ---

  // 1. 知识点统计
  const knowledgeStatsText = data.knowledgeStats.map((kp: any) =>
`${kp.name}：
- 练习题数：${kp.attemptedCount} 题（考纲建议≥${kp.syllabus?.minProblems || 0}题）
- 平均每题提交次数：${kp.averageSubmissionsPerProblem} 次
- 平均每题AI求助：${kp.averageAIHelpPerProblem} 次
- 考纲权重：${kp.syllabus ? (kp.syllabus.weight * 100).toFixed(0) : 0}%
- 重要程度：${kp.syllabus?.importance || 'unknown'}`
  ).join('\n\n')

  // 2. 错题本（只展示已完成反思的高质量记录）
  const errorCasesText = data.errorCases.length > 0
    ? data.errorCases.slice(0, 8).map((ec: any) =>
`题目：${ec.problem.title}
知识点：${ec.problem.knowledgePoints?.join(', ')}
错误类型：${ec.errorType || '未分类'}

【三问反思】
1. 错了哪？${ec.q1Answer}
2. 为什么错？${ec.q2Answer}
3. 怎么避免？${ec.q3Answer || '未填写'}`
    ).join('\n---\n')
    : '学生尚未完成任何错题反思'

  // 3. 防错规则（去重后）
  const preventionRulesText = data.deduplicatedRules.length > 0
    ? data.deduplicatedRules.slice(0, 15).map((rule: any) =>
`[${rule.errorType}] ${rule.rule}
再犯次数：${rule.hitCount}次
相关题目：${rule.relatedProblems.join('、') || '无'}`
    ).join('\n---\n')
    : '学生尚未总结任何防错规则'

  // 4. AI 求助依赖度
  const aiDependencyText =
`总做题数：${data.aiDependency.totalProblems} 题
累计AI求助次数：${data.aiDependency.totalAIHelpRequests} 次
平均每题AI求助：${data.aiDependency.averageAIHelpPerProblem} 次
独立完成比例：${data.aiDependency.independencRate}%（${data.aiDependency.totalProblems - data.aiDependency.problemsWithAIHelp}/${data.aiDependency.totalProblems} 题未求助AI）
${data.aiDependency.heavyDependencyProblems.length > 0
  ? `高度依赖AI的题目（≥3次求助）：\n${data.aiDependency.heavyDependencyProblems.map((p: any) => `- ${p.title}（${p.aiHelpCount}次）`).join('\n')}`
  : '无高度依赖AI的题目'}`

  // 5. 反思质量
  const rq = data.reflectionQuality
  const reflectionQualityText =
`已完成反思的错题数：${rq.totalCompleted} 道
反思平均深度评分：${rq.averageDepth}（满分100）
深度分布：深入${rq.qualityDistribution.deep}条 | 一般${rq.qualityDistribution.moderate}条 | 浅层${rq.qualityDistribution.shallow}条
${rq.commonPatterns.length > 0
  ? `常见错误模式：\n${rq.commonPatterns.map((p: any) => `- ${p.pattern}（出现${p.count}次）`).join('\n')}`
  : ''}
${rq.bestReflection
  ? `最佳反思示例（${rq.bestReflection.problem}）：\n  错了哪：${rq.bestReflection.q1}\n  为什么：${rq.bestReflection.q2}\n  避免：${rq.bestReflection.q3}`
  : ''}`

  // 6. 知识点掌握度（来自 LearningRecord）
  const masteryText = data.masteryData.length > 0
    ? data.masteryData.map((m: any) =>
`${m.name}：掌握度${m.masteryLevel}%${m.feynmanCompleted ? `，费曼验证${m.feynmanScore}分` : ''}${m.tutorCompleted ? '，已完成AI私教' : ''}，累计学习${m.studyTime}分钟`
    ).join('\n')
    : '暂无学习记录数据'

  // --- 变量替换 ---
  const prompt = promptTemplate
    .replace('{{totalProblems}}', data.totalProblems.toString())
    .replace('{{solvedProblems}}', data.solvedProblems.toString())
    .replace('{{knowledgeStats}}', knowledgeStatsText)
    .replace('{{errorCases}}', errorCasesText)
    .replace('{{preventionRules}}', preventionRulesText)
    .replace('{{aiDependency}}', aiDependencyText)
    .replace('{{reflectionQuality}}', reflectionQualityText)
    .replace('{{masteryData}}', masteryText)

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 8000,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      { role: 'user', content: prompt }
    ]
  })

  const firstBlock = response.content[0]
  const content = firstBlock.type === 'text' ? firstBlock.text : ''

  // 解析 JSON
  try {
    const codeBlockMatch = content.match(/```json\s*\n([\s\S]*?)\n```/)
    if (codeBlockMatch) {
      return JSON.parse(codeBlockMatch[1])
    }
    return JSON.parse(content.trim())
  } catch (e) {
    console.error('❌ JSON 解析失败:', e)
    console.log('原始内容:', content.substring(0, 500))
  }

  // 解析失败，返回原始内容
  return {
    studentVersion: content,
    parentVersion: content,
    teacherVersion: content,
    insights: {}
  }
}

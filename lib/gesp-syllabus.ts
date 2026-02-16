// GESP C++ 5级考纲配置

export const GESP_LEVEL5_SYLLABUS = {
  level: 5,
  name: 'GESP C++ 五级',
  examDuration: 180, // 分钟
  examFormat: {
    multipleChoice: { count: 15, scorePerItem: 2, totalScore: 30 },
    trueFalse: { count: 10, scorePerItem: 2, totalScore: 20 },
    programming: { count: 2, scorePerItem: 25, totalScore: 50 }
  },
  knowledgePoints: {
    '贪心': {
      weight: 0.20,
      importance: 'must' as const,
      minProblems: 5,
      aliases: ['贪心算法']
    },
    '前缀和': {
      weight: 0.15,
      importance: 'must' as const,
      minProblems: 4,
      aliases: ['差分']
    },
    '二分查找': {
      weight: 0.12,
      importance: 'high' as const,
      minProblems: 3,
      aliases: ['二分', '二分答案', '二分枚举']
    },
    '递归': {
      weight: 0.10,
      importance: 'high' as const,
      minProblems: 3,
      aliases: ['递归算法']
    },
    '分治': {
      weight: 0.12,
      importance: 'high' as const,
      minProblems: 2,
      aliases: ['分治算法', '归并排序', '快速排序']
    },
    '数论': {
      weight: 0.15,
      importance: 'high' as const,
      minProblems: 3,
      aliases: ['初等数论', '素数', '质数', '最大公约数', '欧几里得算法', '埃氏筛', '线性筛']
    },
    '链表': {
      weight: 0.10,
      importance: 'medium' as const,
      minProblems: 2,
      aliases: ['单链表', '双链表', '循环链表']
    },
    '高精度': {
      weight: 0.06,
      importance: 'medium' as const,
      minProblems: 2,
      aliases: ['高精度运算', '大整数']
    },
  }
} as const

// 知识点映射（处理同义词和别名）
export function mapKnowledgePoint(kp: string): string {
  // 标准化知识点名称
  for (const [standardName, config] of Object.entries(GESP_LEVEL5_SYLLABUS.knowledgePoints)) {
    if (standardName === kp) {
      return standardName
    }
    if (config.aliases && (config.aliases as readonly string[]).includes(kp)) {
      return standardName
    }
  }

  // 如果没有找到映射，返回原名称
  return kp
}

// 获取知识点配置
export function getKnowledgePointConfig(kp: string) {
  const standardName = mapKnowledgePoint(kp)
  const knowledgePoints = GESP_LEVEL5_SYLLABUS.knowledgePoints as Record<string, any>
  return knowledgePoints[standardName] || null
}

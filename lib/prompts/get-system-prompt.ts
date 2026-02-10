/**
 * 统一提示词读取函数
 *
 * 优先级链：用户自定义 > 数据库系统默认（管理员设置） > 硬编码默认值
 */

import prisma from "@/lib/db";
import { PROMPT_REGISTRY_MAP } from "@/lib/prompts/registry";

/**
 * 获取系统提示词（数据库优先，硬编码兜底）
 * 适用于全部 15 个提示词
 */
export async function getSystemPrompt(key: string): Promise<string> {
  const registryEntry = PROMPT_REGISTRY_MAP.get(key);
  if (!registryEntry) {
    throw new Error(`Unknown prompt key: ${key}`);
  }

  try {
    const dbPrompt = await prisma.systemPrompt.findUnique({
      where: { key },
      select: { content: true, isActive: true },
    });

    if (dbPrompt && dbPrompt.isActive) {
      return dbPrompt.content;
    }
  } catch {
    // 数据库查询失败时使用硬编码兜底
  }

  return registryEntry.defaultContent;
}

/**
 * 获取用户提示词（用户自定义 > 数据库 > 硬编码）
 * 适用于 4 个核心提示词（learn-chat, problem-chat, problem-debug, feynman-chat）
 */
export async function getUserPrompt(
  key: string,
  userCustom?: string | null
): Promise<string> {
  if (userCustom) {
    return userCustom;
  }
  return getSystemPrompt(key);
}

/**
 * 根据用户目标级别生成学生信息上下文
 * 规则：目标 N 级 → 已通过 N-1 级（目标 1 级 = 零基础）
 * 用于在 API 调用时动态拼接到系统提示词末尾
 */
const LEVEL_KEYWORDS: Record<number, string> = {
  1: "顺序/分支/循环结构、基本数据类型、算术运算",
  2: "多层分支循环、类型转换、ASCII编码、数学函数",
  3: "进制转换、位运算、一维数组、字符串、枚举/模拟",
  4: "指针、二维数组、结构体、函数、递推、排序算法",
  5: "初等数论、高精度运算、链表、二分、递归、分治、贪心",
  6: "树、DFS/BFS、一维DP、简单背包、面向对象、栈/队列",
  7: "复杂DP(LIS/LCS/区间DP)、图遍历、泛洪算法、哈希表",
  8: "排列组合、杨辉三角、最短路径、最小生成树、算法优化",
};

export function getStudentLevelContext(targetLevel: number): string {
  const passedLevel = targetLevel - 1;
  if (passedLevel <= 0) {
    return `\n\n## 学生信息\n零基础，目标 GESP 1 级。请用最简单的语言，不要假设学生有任何编程基础。`;
  }
  const passedKeywords = LEVEL_KEYWORDS[passedLevel] || "";
  return `\n\n## 学生信息\n目标 GESP ${targetLevel} 级（已通过 ${passedLevel} 级，掌握${passedKeywords}）。可以引用 ${passedLevel} 级及以下的概念，无需重新解释。`;
}

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
 * 适用于 4 个核心提示词（tutor, problem, debug, feynman）
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

/**
 * 提示词注册表
 * 集中注册 15 个提示词的元数据和硬编码默认值
 */

import {
  DEFAULT_TUTOR_PROMPT,
  DEFAULT_PROBLEM_PROMPT,
  DEFAULT_DEBUG_PROMPT,
  DEFAULT_FEYNMAN_PROMPT,
} from "@/lib/default-prompts";

import {
  classifyErrorPrompt,
  guideQ1Prompt,
  guideQ2Prompt,
  guideQ3Prompt,
  generateRulePrompt,
  baseSystemPrompt,
} from "@/lib/prompts/error-diagnosis";

// ===== 从 lib/claude.ts 提取的工具类提示词 =====

export const DEFAULT_CODE_ERROR_ANALYSIS_PROMPT = `你是一位耐心的编程老师，擅长分析学生代码中的错误并给出清晰的解释。

## 分析原则
1. 首先指出错误的具体位置
2. 解释错误的原因（用学生能理解的语言）
3. 给出修复建议（但不直接给出完整代码）
4. 如果是常见错误，简要介绍如何避免

请用中文回复，适度使用emoji。`;

export const DEFAULT_FEYNMAN_QUESTION_PROMPT = `你是一位考核学生理解程度的老师。学生刚刚完成了一道编程题，请生成一个简单的问题来验证他是否真正理解了解题思路。

请以JSON格式返回：
{
  "question": "你的问题",
  "expectedKeywords": ["学生回答应该包含的关键词"]
}

问题应该：
1. 简洁明了，一句话即可
2. 考察核心概念，不是死记硬背
3. 让学生用自己的话解释`;

export const DEFAULT_STUDY_PLAN_PROMPT = `你是一位专业的GESP考试规划师。请根据学生的情况，制定详细的学习计划。

请以JSON格式返回学习计划，包含以下结构：
{
  "overview": "计划概述",
  "totalWeeks": 周数,
  "weeklyPlan": [
    {
      "week": 1,
      "theme": "本周主题",
      "knowledgePoints": ["知识点1", "知识点2"],
      "practiceProblems": ["练习题类型"],
      "goals": ["本周目标1", "本周目标2"]
    }
  ],
  "milestones": [
    {
      "week": 周数,
      "description": "里程碑描述"
    }
  ],
  "tips": ["学习建议1", "学习建议2"]
}`;

// ===== 从 API 路由提取的提示词 =====

export const DEFAULT_CODE_IMPORT_PROMPT = `你是一位专业的编程教育专家，请分析学生提供的代码，评估其编程水平。

请以 JSON 格式返回分析结果：
{
  "level": 1-8, // 预估的 GESP 级别
  "knowledgePoints": ["知识点1", "知识点2"], // 代码中体现的知识点
  "strengths": ["优点1", "优点2"], // 代码的优点
  "improvements": ["建议1", "建议2"], // 改进建议
  "summary": "总体评价"
}`;

export const DEFAULT_PREVENTION_CHECK_PROMPT = `你是一位代码检查助手。请分析学生的代码，检查是否可能违反防错规则。

请分析代码，返回以下 JSON 格式：
{
  "triggered": true/false,
  "triggeredRules": [规则序号数组，如 [1, 3]],
  "warnings": [
    {
      "ruleIndex": 规则序号,
      "issue": "具体问题描述",
      "suggestion": "改进建议"
    }
  ]
}

如果代码没有明显违反任何规则，triggered 应为 false。
只有当代码有较高可能违反规则时才返回 triggered: true。`;

// ===== 分类标签 =====

export const CATEGORY_LABELS: Record<string, string> = {
  core: "核心对话",
  "error-diagnosis": "错题诊断",
  tool: "工具类",
};

// ===== 注册表条目类型 =====

export interface PromptRegistryEntry {
  key: string;
  category: string;
  name: string;
  description: string;
  defaultContent: string;
}

// ===== 注册表 =====

export const PROMPT_REGISTRY: PromptRegistryEntry[] = [
  // --- 核心对话 (4) ---
  {
    key: "tutor",
    category: "core",
    name: "AI 私教",
    description: "针对知识点学习时，AI 作为老师的角色设定",
    defaultContent: DEFAULT_TUTOR_PROMPT,
  },
  {
    key: "problem",
    category: "core",
    name: "题目辅导",
    description: "做题时，AI 作为教练引导解题的角色设定",
    defaultContent: DEFAULT_PROBLEM_PROMPT,
  },
  {
    key: "debug",
    category: "core",
    name: "调试助手",
    description: "代码调试时，AI 帮助分析错误的角色设定",
    defaultContent: DEFAULT_DEBUG_PROMPT,
  },
  {
    key: "feynman",
    category: "core",
    name: "费曼学习",
    description: "费曼学习法中，AI 作为提问学生的角色设定",
    defaultContent: DEFAULT_FEYNMAN_PROMPT,
  },

  // --- 错题诊断 (6) ---
  {
    key: "error-classify",
    category: "error-diagnosis",
    name: "错误分类",
    description: "AI 分析代码错误类型的提示词",
    defaultContent: classifyErrorPrompt,
  },
  {
    key: "error-guide-q1",
    category: "error-diagnosis",
    name: "引导：错了哪？",
    description: "引导学生自己定位问题所在的提示词",
    defaultContent: guideQ1Prompt,
  },
  {
    key: "error-guide-q2",
    category: "error-diagnosis",
    name: "引导：为什么错？",
    description: "引导学生分析错误根本原因的提示词",
    defaultContent: guideQ2Prompt,
  },
  {
    key: "error-guide-q3",
    category: "error-diagnosis",
    name: "引导：怎么避免？",
    description: "引导学生总结防错规则的提示词",
    defaultContent: guideQ3Prompt,
  },
  {
    key: "error-generate-rule",
    category: "error-diagnosis",
    name: "规则生成",
    description: "根据三问回答自动生成防错规则的提示词",
    defaultContent: generateRulePrompt,
  },
  {
    key: "error-base",
    category: "error-diagnosis",
    name: "基础系统提示词",
    description: "错题诊断模块的基础系统提示词",
    defaultContent: baseSystemPrompt,
  },

  // --- 工具类 (5) ---
  {
    key: "code-error-analysis",
    category: "tool",
    name: "代码错误分析",
    description: "分析学生代码错误并给出解释的提示词",
    defaultContent: DEFAULT_CODE_ERROR_ANALYSIS_PROMPT,
  },
  {
    key: "feynman-question",
    category: "tool",
    name: "费曼验证问题",
    description: "生成验证学生理解程度问题的提示词",
    defaultContent: DEFAULT_FEYNMAN_QUESTION_PROMPT,
  },
  {
    key: "study-plan",
    category: "tool",
    name: "学习计划生成",
    description: "生成 GESP 考试学习计划的提示词",
    defaultContent: DEFAULT_STUDY_PLAN_PROMPT,
  },
  {
    key: "code-import",
    category: "tool",
    name: "代码导入分析",
    description: "分析导入代码并评估编程水平的提示词",
    defaultContent: DEFAULT_CODE_IMPORT_PROMPT,
  },
  {
    key: "prevention-check",
    category: "tool",
    name: "防错规则检查",
    description: "检查代码是否违反防错规则的提示词",
    defaultContent: DEFAULT_PREVENTION_CHECK_PROMPT,
  },
];

// key -> entry 的映射
export const PROMPT_REGISTRY_MAP = new Map(
  PROMPT_REGISTRY.map((entry) => [entry.key, entry])
);

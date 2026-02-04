"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 10 种错误类型，覆盖 OJ 判题状态和 GESP 学生高频错误
export type ErrorType =
  | "misread"    // 审题疏漏 [WA]
  | "boundary"   // 边界遗漏 [WA]
  | "syntax"     // 语法错误 [CE]
  | "careless"   // 粗心笔误 [WA]
  | "logic"      // 逻辑错误 [WA]
  | "algorithm"  // 思路错误 [WA]
  | "timeout"    // 效率不足 [TLE]
  | "runtime"    // 运行崩溃 [RE]
  | "overflow"   // 数值溢出 [WA]
  | "uninit";    // 未初始化 [WA/RE]

interface ErrorTypeBadgeProps {
  type: ErrorType | string | null | undefined;
  className?: string;
  size?: "sm" | "md" | "lg";
  showOjStatus?: boolean;
}

const ERROR_TYPE_CONFIG: Record<
  ErrorType,
  {
    label: string;
    emoji: string;
    description: string;
    ojStatus: string;
    className: string;
    examples: string[];
  }
> = {
  // === 审题相关 [WA] ===
  misread: {
    label: "审题疏漏",
    emoji: "📖",
    description: "没看清题目条件、遗漏约束、误解题意",
    ojStatus: "WA",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    examples: ["没看到「按升序输出」", "漏掉了「不超过」的条件", "误解了输入格式"],
  },

  // === 边界相关 [WA] ===
  boundary: {
    label: "边界遗漏",
    emoji: "🔲",
    description: "没有处理特殊输入或极端情况",
    ojStatus: "WA",
    className: "bg-orange-100 text-orange-800 border-orange-200",
    examples: ["n=0 或 n=1 的情况", "数组为空", "最大值/最小值边界"],
  },

  // === 编译相关 [CE] ===
  syntax: {
    label: "语法错误",
    emoji: "✏️",
    description: "代码无法通过编译",
    ojStatus: "CE",
    className: "bg-red-100 text-red-800 border-red-200",
    examples: ["缺少分号", "括号不匹配", "头文件缺失", "变量未声明"],
  },

  // === 粗心相关 [WA] ===
  careless: {
    label: "粗心笔误",
    emoji: "👀",
    description: "思路正确但手误写错，如变量名打错、复制后忘改",
    ojStatus: "WA",
    className: "bg-cyan-100 text-cyan-800 border-cyan-200",
    examples: ["变量名 sum 写成 sun", "复制后忘改变量", "+ 写成 -", "mod 少写一个 0"],
  },

  // === 逻辑相关 [WA] ===
  logic: {
    label: "逻辑错误",
    emoji: "🧩",
    description: "思路正确但代码实现有漏洞，改几行就能修好",
    ojStatus: "WA",
    className: "bg-purple-100 text-purple-800 border-purple-200",
    examples: ["循环边界 < 写成 <=", "条件判断方向反了", "if-else 分支遗漏"],
  },

  // === 算法相关 [WA] ===
  algorithm: {
    label: "思路错误",
    emoji: "💡",
    description: "解题方法选错了，需要换一种思路重写",
    ojStatus: "WA",
    className: "bg-pink-100 text-pink-800 border-pink-200",
    examples: ["该用 BFS 的题用了 DFS", "递推公式推导错误", "贪心策略不成立"],
  },

  // === 超时相关 [TLE] ===
  timeout: {
    label: "效率不足",
    emoji: "⏰",
    description: "程序运行太慢，算法复杂度过高",
    ojStatus: "TLE",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    examples: ["O(n²) 应该用 O(n log n)", "暴力枚举数据量太大", "递归没有记忆化"],
  },

  // === 运行错误 [RE] ===
  runtime: {
    label: "运行崩溃",
    emoji: "💥",
    description: "程序运行中途崩溃退出",
    ojStatus: "RE",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    examples: ["数组下标越界", "除以 0 或取模 0", "递归太深栈溢出"],
  },

  // === 溢出相关 [WA] ===
  overflow: {
    label: "数值溢出",
    emoji: "💣",
    description: "计算结果超出 int 范围，需要用 long long",
    ojStatus: "WA",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    examples: ["int 乘法溢出", "阶乘/幂运算结果过大", "中间计算结果溢出"],
  },

  // === 初始化相关 [WA/RE] ===
  uninit: {
    label: "未初始化",
    emoji: "🔧",
    description: "变量、数组没有赋初值，或多组数据之间没有重置",
    ojStatus: "WA",
    className: "bg-green-100 text-green-800 border-green-200",
    examples: ["局部变量未赋初值", "数组没有 memset 清零", "多组数据间忘记重置变量"],
  },
};

export function ErrorTypeBadge({ type, className, size = "md", showOjStatus = false }: ErrorTypeBadgeProps) {
  if (!type || !(type in ERROR_TYPE_CONFIG)) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-gray-100 text-gray-600",
          size === "sm" && "text-xs px-1.5 py-0.5",
          size === "lg" && "text-sm px-3 py-1",
          className
        )}
      >
        ❓ 未分类
      </Badge>
    );
  }

  const config = ERROR_TYPE_CONFIG[type as ErrorType];

  return (
    <Badge
      variant="outline"
      className={cn(
        config.className,
        size === "sm" && "text-xs px-1.5 py-0.5",
        size === "lg" && "text-sm px-3 py-1",
        className
      )}
      title={config.description}
    >
      {config.emoji} {config.label}
      {showOjStatus && <span className="ml-1 opacity-60">[{config.ojStatus}]</span>}
    </Badge>
  );
}

export function ErrorTypeInfo({ type }: { type: ErrorType | string | null | undefined }) {
  if (!type || !(type in ERROR_TYPE_CONFIG)) {
    return null;
  }

  const config = ERROR_TYPE_CONFIG[type as ErrorType];

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
      <span className="text-3xl">{config.emoji}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-lg">{config.label}</p>
          <Badge variant="outline" className="text-xs">{config.ojStatus}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {config.examples.map((example, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-background rounded border">
              {example}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function getErrorTypeLabel(type: ErrorType | string | null | undefined): string {
  if (!type || !(type in ERROR_TYPE_CONFIG)) {
    return "未分类";
  }
  const config = ERROR_TYPE_CONFIG[type as ErrorType];
  return `${config.emoji} ${config.label}`;
}

// 按 OJ 状态分组的错误类型
export const ERROR_TYPES_BY_OJ_STATUS = {
  CE: ["syntax"],
  WA: ["misread", "boundary", "careless", "uninit", "logic", "algorithm", "overflow"],
  TLE: ["timeout"],
  RE: ["runtime", "uninit"],
} as const;

// 获取所有错误类型列表
export function getAllErrorTypes(): Array<{ code: ErrorType; label: string; emoji: string }> {
  return Object.entries(ERROR_TYPE_CONFIG).map(([code, config]) => ({
    code: code as ErrorType,
    label: config.label,
    emoji: config.emoji,
  }));
}

export { ERROR_TYPE_CONFIG };

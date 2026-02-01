"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 10 种错误类型，覆盖 OJ 判题状态和 GESP 学生高频错误
export type ErrorType =
  | "misread"    // 读错题 [WA]
  | "boundary"   // 边界漏 [WA]
  | "syntax"     // 语法错 [CE]
  | "logic"      // 逻辑错 [WA]
  | "algorithm"  // 算法错 [WA]
  | "timeout"    // 超时了 [TLE]
  | "runtime"    // 运行崩 [RE]
  | "overflow"   // 溢出了 [WA]
  | "memory"     // 内存超 [MLE]
  | "format";    // 格式错 [PE]

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
  // === 审题相关 ===
  misread: {
    label: "读错题",
    emoji: "📖",
    description: "审题不清、遗漏条件、误解题意",
    ojStatus: "WA",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    examples: ["没看到「按升序输出」", "漏掉了「不超过」的条件", "误解了输入格式"],
  },

  // === 边界相关 ===
  boundary: {
    label: "边界漏",
    emoji: "🔲",
    description: "边界条件、特殊情况未处理",
    ojStatus: "WA",
    className: "bg-orange-100 text-orange-800 border-orange-200",
    examples: ["n=0 或 n=1 的情况", "数组为空", "最大值/最小值边界"],
  },

  // === 编译相关 [CE] ===
  syntax: {
    label: "语法错",
    emoji: "✏️",
    description: "编译错误、语法问题",
    ojStatus: "CE",
    className: "bg-red-100 text-red-800 border-red-200",
    examples: ["缺少分号", "括号不匹配", "头文件缺失", "变量未声明"],
  },

  // === 逻辑相关 ===
  logic: {
    label: "逻辑错",
    emoji: "🧩",
    description: "算法思路对但代码实现有bug",
    ojStatus: "WA",
    className: "bg-purple-100 text-purple-800 border-purple-200",
    examples: ["循环边界 < 写成 <=", "条件判断反了", "变量用错"],
  },

  // === 算法相关 ===
  algorithm: {
    label: "算法错",
    emoji: "🎯",
    description: "算法思路本身有问题",
    ojStatus: "WA",
    className: "bg-pink-100 text-pink-800 border-pink-200",
    examples: ["用错了算法", "递推公式推错", "贪心策略不对"],
  },

  // === 超时相关 [TLE] ===
  timeout: {
    label: "超时了",
    emoji: "🐢",
    description: "算法复杂度过高",
    ojStatus: "TLE",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    examples: ["O(n²) 应该用 O(n log n)", "暴力枚举数据量太大", "递归没有记忆化"],
  },

  // === 运行错误 [RE] ===
  runtime: {
    label: "运行崩",
    emoji: "💥",
    description: "数组越界、除零、栈溢出",
    ojStatus: "RE",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    examples: ["数组下标越界", "除以0或取模0", "递归太深栈溢出"],
  },

  // === 溢出相关 ===
  overflow: {
    label: "溢出了",
    emoji: "💣",
    description: "整数溢出、数据类型不当",
    ojStatus: "WA",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    examples: ["int 乘法溢出要用 long long", "阶乘/幂运算溢出", "中间结果溢出"],
  },

  // === 内存相关 [MLE] ===
  memory: {
    label: "内存超",
    emoji: "📦",
    description: "内存使用超出限制",
    ojStatus: "MLE",
    className: "bg-cyan-100 text-cyan-800 border-cyan-200",
    examples: ["数组开得太大", "递归占用栈空间过多"],
  },

  // === 格式相关 [PE] ===
  format: {
    label: "格式错",
    emoji: "📝",
    description: "输出格式不符合要求",
    ojStatus: "PE",
    className: "bg-green-100 text-green-800 border-green-200",
    examples: ["多输出/少输出空格", "换行符问题", "小数位数不对"],
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
  WA: ["misread", "boundary", "logic", "algorithm", "overflow"],
  TLE: ["timeout"],
  RE: ["runtime"],
  MLE: ["memory"],
  PE: ["format"],
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

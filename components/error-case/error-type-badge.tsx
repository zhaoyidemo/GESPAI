"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ErrorType = "misread" | "boundary" | "implementation" | "timeout";

interface ErrorTypeBadgeProps {
  type: ErrorType | string | null | undefined;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const ERROR_TYPE_CONFIG: Record<
  ErrorType,
  {
    label: string;
    emoji: string;
    description: string;
    className: string;
  }
> = {
  misread: {
    label: "读错题",
    emoji: "\ud83d\udcd6",
    description: "审题不清、遗漏条件",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  boundary: {
    label: "边界漏",
    emoji: "\ud83d\udd32",
    description: "边界条件、特殊情况未处理",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  implementation: {
    label: "写法错",
    emoji: "\u270f\ufe0f",
    description: "语法错误、逻辑错误、算法实现问题",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  timeout: {
    label: "太慢了",
    emoji: "\ud83d\udc22",
    description: "算法复杂度不够优、TLE",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
};

export function ErrorTypeBadge({ type, className, size = "md" }: ErrorTypeBadgeProps) {
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
        \u2753 未分类
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
    </Badge>
  );
}

export function ErrorTypeInfo({ type }: { type: ErrorType | string | null | undefined }) {
  if (!type || !(type in ERROR_TYPE_CONFIG)) {
    return null;
  }

  const config = ERROR_TYPE_CONFIG[type as ErrorType];

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
      <span className="text-2xl">{config.emoji}</span>
      <div>
        <p className="font-medium">{config.label}</p>
        <p className="text-sm text-muted-foreground">{config.description}</p>
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

export { ERROR_TYPE_CONFIG };

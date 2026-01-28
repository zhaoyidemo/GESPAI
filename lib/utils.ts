import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getDaysUntil(targetDate: Date | string): number {
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateXpForLevel(level: number): number {
  // 每个级别需要的总XP
  const xpTable: Record<number, number> = {
    1: 100,
    2: 300,
    3: 600,
    4: 1000,
    5: 1500,
    6: 2100,
    7: 2800,
    8: 3600,
  };
  return xpTable[level] || 0;
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return "text-green-500";
  if (progress >= 50) return "text-yellow-500";
  if (progress >= 20) return "text-orange-500";
  return "text-gray-400";
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case "completed":
    case "mastered":
      return "✅";
    case "in_progress":
      return "⏳";
    case "not_started":
    default:
      return "○";
  }
}

export function getDifficultyLabel(difficulty: string): { label: string; color: string } {
  switch (difficulty) {
    case "easy":
      return { label: "简单", color: "text-green-500 bg-green-50" };
    case "medium":
      return { label: "中等", color: "text-yellow-600 bg-yellow-50" };
    case "hard":
      return { label: "困难", color: "text-red-500 bg-red-50" };
    default:
      return { label: "未知", color: "text-gray-500 bg-gray-50" };
  }
}

export function getJudgeStatusLabel(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "等待中", color: "text-gray-500" },
    running: { label: "运行中", color: "text-blue-500" },
    accepted: { label: "通过", color: "text-green-500" },
    wrong_answer: { label: "答案错误", color: "text-red-500" },
    time_limit: { label: "超时", color: "text-orange-500" },
    memory_limit: { label: "内存超限", color: "text-purple-500" },
    runtime_error: { label: "运行错误", color: "text-red-600" },
    compile_error: { label: "编译错误", color: "text-yellow-600" },
  };
  return statusMap[status] || { label: status, color: "text-gray-500" };
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

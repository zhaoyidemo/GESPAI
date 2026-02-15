"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Clock } from "lucide-react";

interface FocusSummary {
  totalSeconds: number;
  focusSeconds: number;
  blurCount: number;
  sessionCount: number;
  focusScore: number;
}

interface FocusReportCardProps {
  range?: "today" | "week" | "month";
  compact?: boolean;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-500";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-green-500/10";
  if (score >= 60) return "bg-amber-500/10";
  return "bg-red-500/10";
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}秒`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const remainMin = minutes % 60;
  return remainMin > 0 ? `${hours}小时${remainMin}分钟` : `${hours}小时`;
}

export function FocusReportCard({ range = "today", compact = false }: FocusReportCardProps) {
  const [summary, setSummary] = useState<FocusSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/focus?range=${range}`);
        if (response.ok) {
          const data = await response.json();
          setSummary(data.summary);
        }
      } catch {
        // 静默忽略
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [range]);

  if (loading) {
    return compact ? (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    ) : null;
  }

  if (!summary || summary.sessionCount === 0) {
    if (!compact) return null;
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">今日专注</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">还没有学习记录</p>
          <p className="text-xs text-muted-foreground mt-1">开始做题或学习后自动记录</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${getScoreBg(summary.focusScore)} flex items-center justify-center`}>
            <Eye className={`h-5 w-5 ${getScoreColor(summary.focusScore)}`} />
          </div>
          <h3 className="font-semibold">今日专注</h3>
        </div>
        <div className="text-center py-2">
          <span className={`text-5xl font-bold stat-number ${getScoreColor(summary.focusScore)}`}>
            {summary.focusScore}
          </span>
          <span className="text-lg text-muted-foreground ml-1">分</span>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              专注时长
            </span>
            <span className="font-medium">{formatDuration(summary.focusSeconds)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <EyeOff className="h-3.5 w-3.5" />
              分心次数
            </span>
            <span className="font-medium">{summary.blurCount} 次</span>
          </div>
        </div>
      </div>
    );
  }

  // 完整版（Profile 页）
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            专注得分
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-bold ${getScoreColor(summary.focusScore)}`}>
              {summary.focusScore}
            </span>
            <span className="text-muted-foreground">/ 100</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            分心 {summary.blurCount} 次 · {summary.sessionCount} 个会话
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            专注时长
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {formatDuration(summary.focusSeconds)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            总停留 {formatDuration(summary.totalSeconds)}
          </p>
        </CardContent>
      </Card>
    </>
  );
}

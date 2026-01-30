"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  RefreshCw,
  Check,
  AlertTriangle,
  Download,
  ExternalLink,
  Loader2,
  Database,
  CloudDownload,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelStatus {
  level: number;
  trainingId: string;
  trainingUrl: string;
  summary: {
    remote: number;
    local: number;
    synced: number;
    missing: number;
    extra: number;
  };
  missing: string[];
  extra: Array<{ sourceId: string; title: string }>;
  synced: string[];
}

interface SyncProgress {
  current: number;
  total: number;
  currentProblem: string;
  results: Array<{
    problemId: string;
    action: string;
    title?: string;
    error?: string;
  }>;
}

const GESP_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ProblemsAdminPage() {
  const [levelStatuses, setLevelStatuses] = useState<Record<number, LevelStatus | null>>({});
  const [loadingLevels, setLoadingLevels] = useState<Set<number>>(new Set());
  const [syncingLevel, setSyncingLevel] = useState<number | null>(null);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(5);

  // 检查单个级别的同步状态
  const checkLevel = async (level: number) => {
    setLoadingLevels((prev) => new Set(prev).add(level));
    try {
      const response = await fetch(`/api/admin/sync?level=${level}`);
      const data = await response.json();
      setLevelStatuses((prev) => ({ ...prev, [level]: data }));
    } catch (error) {
      console.error(`检查级别 ${level} 失败:`, error);
    } finally {
      setLoadingLevels((prev) => {
        const next = new Set(prev);
        next.delete(level);
        return next;
      });
    }
  };

  // 逐个同步题目（避免超时）
  const syncLevelOneByOne = async (level: number, force: boolean = false) => {
    setSyncingLevel(level);
    setSyncProgress({ current: 0, total: 0, currentProblem: "", results: [] });

    try {
      // 先获取需要同步的题目列表
      const checkResponse = await fetch(`/api/admin/sync?level=${level}`);
      const checkData: LevelStatus = await checkResponse.json();

      // 如果强制同步，同步所有题目；否则只同步缺失的
      const problemsToSync = force
        ? [...checkData.missing, ...checkData.synced]
        : checkData.missing;

      if (problemsToSync.length === 0) {
        setSyncProgress({
          current: 0,
          total: 0,
          currentProblem: "",
          results: [{ problemId: "-", action: "info", title: "所有题目已同步，无需更新" }],
        });
        setSyncingLevel(null);
        return;
      }

      setSyncProgress({
        current: 0,
        total: problemsToSync.length,
        currentProblem: "",
        results: [],
      });

      // 逐个同步
      for (let i = 0; i < problemsToSync.length; i++) {
        const problemId = problemsToSync[i];
        setSyncProgress((prev) => ({
          ...prev!,
          current: i,
          currentProblem: problemId,
        }));

        try {
          const response = await fetch("/api/admin/sync/problem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ problemId, level }),
          });
          const result = await response.json();

          setSyncProgress((prev) => ({
            ...prev!,
            current: i + 1,
            results: [
              ...prev!.results,
              {
                problemId,
                action: result.success ? result.action : "error",
                title: result.title,
                error: result.error,
              },
            ],
          }));
        } catch (error) {
          setSyncProgress((prev) => ({
            ...prev!,
            current: i + 1,
            results: [
              ...prev!.results,
              { problemId, action: "error", error: String(error) },
            ],
          }));
        }
      }

      // 同步完成后刷新状态
      await checkLevel(level);
    } catch (error) {
      console.error(`同步级别 ${level} 失败:`, error);
    } finally {
      setSyncingLevel(null);
    }
  };

  // 初始加载
  useEffect(() => {
    checkLevel(selectedLevel);
  }, [selectedLevel]);

  const getStatusColor = (status: LevelStatus | null) => {
    if (!status) return "bg-muted";
    if (status.summary.missing === 0 && status.summary.extra === 0) {
      return "bg-success/20 text-success border-success/30";
    }
    if (status.summary.missing > 0) {
      return "bg-warning/20 text-warning border-warning/30";
    }
    return "bg-muted";
  };

  const getStatusIcon = (status: LevelStatus | null) => {
    if (!status) return <Clock className="w-4 h-4" />;
    if (status.summary.missing === 0 && status.summary.extra === 0) {
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    }
    return <AlertTriangle className="w-4 h-4 text-warning" />;
  };

  const status = levelStatuses[selectedLevel];
  const isLoading = loadingLevels.has(selectedLevel);
  const isSyncing = syncingLevel === selectedLevel;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">题库管理</h1>
          <p className="text-muted-foreground mt-1">
            从洛谷同步 GESP 官方真题，确保题目内容 100% 一致
          </p>
        </div>
      </div>

      {/* 级别选择卡片 */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {GESP_LEVELS.map((level) => {
          const levelStatus = levelStatuses[level];
          const levelLoading = loadingLevels.has(level);
          const levelSyncing = syncingLevel === level;

          return (
            <Card
              key={level}
              className={cn(
                "cursor-pointer transition-all hover:scale-105",
                selectedLevel === level && "ring-2 ring-primary",
                getStatusColor(levelStatus)
              )}
              onClick={() => setSelectedLevel(level)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  {levelLoading || levelSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    getStatusIcon(levelStatus)
                  )}
                  <span className="text-lg font-bold">{level}级</span>
                </div>
                {levelStatus && (
                  <div className="text-xs mt-1 opacity-70">
                    {levelStatus.summary.local}/{levelStatus.summary.remote}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 选中级别详情 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                GESP {selectedLevel} 级题库
              </CardTitle>
              <CardDescription>
                {status?.trainingUrl && (
                  <a
                    href={status.trainingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    洛谷官方题单
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => checkLevel(selectedLevel)}
                disabled={isLoading || isSyncing}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                检查状态
              </Button>
              <Button
                size="sm"
                onClick={() => syncLevelOneByOne(selectedLevel, false)}
                disabled={isLoading || isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                同步缺失
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => syncLevelOneByOne(selectedLevel, true)}
                disabled={isLoading || isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                全部重建
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3">正在检查同步状态...</span>
            </div>
          ) : isSyncing && syncProgress ? (
            <div className="space-y-4 py-4">
              {/* 进度条 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    正在同步: {syncProgress.currentProblem || "准备中..."}
                  </span>
                  <span>
                    {syncProgress.current} / {syncProgress.total}
                  </span>
                </div>
                <Progress
                  value={
                    syncProgress.total > 0
                      ? (syncProgress.current / syncProgress.total) * 100
                      : 0
                  }
                />
              </div>

              {/* 实时结果 */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {syncProgress.results.map((result, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded text-sm",
                      result.action === "created" && "bg-success/10",
                      result.action === "updated" && "bg-primary/10",
                      result.action === "error" && "bg-destructive/10",
                      result.action === "info" && "bg-muted"
                    )}
                  >
                    {result.action === "created" && (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                    {result.action === "updated" && (
                      <RefreshCw className="w-4 h-4 text-primary" />
                    )}
                    {result.action === "error" && (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                    {result.action === "info" && (
                      <Check className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-mono">{result.problemId}</span>
                    {result.title && (
                      <span className="text-muted-foreground truncate">
                        {result.title}
                      </span>
                    )}
                    {result.error && (
                      <span className="text-destructive">{result.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : status ? (
            <div className="space-y-4">
              {/* 统计卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="洛谷题目"
                  value={status.summary.remote}
                  icon={<ExternalLink className="w-4 h-4" />}
                />
                <StatCard
                  label="本地题目"
                  value={status.summary.local}
                  icon={<Database className="w-4 h-4" />}
                />
                <StatCard
                  label="已同步"
                  value={status.summary.synced}
                  icon={<CheckCircle2 className="w-4 h-4 text-success" />}
                  className="text-success"
                />
                <StatCard
                  label="缺少"
                  value={status.summary.missing}
                  icon={<AlertTriangle className="w-4 h-4 text-warning" />}
                  className={status.summary.missing > 0 ? "text-warning" : ""}
                />
              </div>

              {/* 题目列表 */}
              {status.summary.missing > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    缺少的题目 ({status.summary.missing})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {status.missing.map((problemId) => (
                      <a
                        key={problemId}
                        href={`https://www.luogu.com.cn/problem/${problemId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded bg-warning/10 border border-warning/20 hover:bg-warning/20 transition-colors"
                      >
                        <span className="font-mono text-sm">{problemId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {status.summary.synced > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    已同步的题目 ({status.summary.synced})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {status.synced.map((problemId) => (
                      <a
                        key={problemId}
                        href={`https://www.luogu.com.cn/problem/${problemId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded bg-success/10 border border-success/20 hover:bg-success/20 transition-colors"
                      >
                        <span className="font-mono text-sm">{problemId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {status.summary.missing === 0 && status.summary.synced > 0 && (
                <div className="text-center py-8 text-success">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-medium">所有题目已同步完成</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>点击「检查状态」查看同步情况</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-muted/50 border">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        {label}
      </div>
      <div className={cn("text-2xl font-bold mt-1", className)}>{value}</div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface SyncResult {
  success: boolean;
  level: number;
  summary: {
    total: number;
    created: number;
    updated: number;
    errors: number;
  };
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
  const [syncingLevels, setSyncingLevels] = useState<Set<number>>(new Set());
  const [syncResults, setSyncResults] = useState<Record<number, SyncResult | null>>({});
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

  // 同步单个级别
  const syncLevel = async (level: number, force: boolean = false) => {
    setSyncingLevels((prev) => new Set(prev).add(level));
    setSyncResults((prev) => ({ ...prev, [level]: null }));
    try {
      const response = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, force }),
      });
      const data = await response.json();
      setSyncResults((prev) => ({ ...prev, [level]: data }));
      // 同步完成后刷新状态
      await checkLevel(level);
    } catch (error) {
      console.error(`同步级别 ${level} 失败:`, error);
    } finally {
      setSyncingLevels((prev) => {
        const next = new Set(prev);
        next.delete(level);
        return next;
      });
    }
  };

  // 检查所有级别
  const checkAllLevels = async () => {
    for (const level of GESP_LEVELS) {
      await checkLevel(level);
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
        <Button onClick={checkAllLevels} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          检查所有级别
        </Button>
      </div>

      {/* 级别选择卡片 */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {GESP_LEVELS.map((level) => {
          const status = levelStatuses[level];
          const isLoading = loadingLevels.has(level);
          const isSyncing = syncingLevels.has(level);

          return (
            <Card
              key={level}
              className={cn(
                "cursor-pointer transition-all hover:scale-105",
                selectedLevel === level && "ring-2 ring-primary",
                getStatusColor(status)
              )}
              onClick={() => setSelectedLevel(level)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    getStatusIcon(status)
                  )}
                  <span className="text-lg font-bold">{level}级</span>
                </div>
                {status && (
                  <div className="text-xs mt-1 opacity-70">
                    {status.summary.local}/{status.summary.remote}
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
                {levelStatuses[selectedLevel]?.trainingUrl && (
                  <a
                    href={levelStatuses[selectedLevel]?.trainingUrl}
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
                disabled={loadingLevels.has(selectedLevel)}
              >
                {loadingLevels.has(selectedLevel) ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                检查状态
              </Button>
              <Button
                size="sm"
                onClick={() => syncLevel(selectedLevel, false)}
                disabled={syncingLevels.has(selectedLevel)}
              >
                {syncingLevels.has(selectedLevel) ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CloudDownload className="w-4 h-4 mr-2" />
                )}
                智能同步
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => syncLevel(selectedLevel, true)}
                disabled={syncingLevels.has(selectedLevel)}
              >
                {syncingLevels.has(selectedLevel) ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                强制重建
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingLevels.has(selectedLevel) ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3">正在检查同步状态...</span>
            </div>
          ) : syncingLevels.has(selectedLevel) ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="mt-3">正在从洛谷同步题目...</span>
              <span className="text-sm text-muted-foreground mt-1">
                这可能需要一些时间，请勿关闭页面
              </span>
            </div>
          ) : levelStatuses[selectedLevel] ? (
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="missing">
                  缺少 ({levelStatuses[selectedLevel]?.summary.missing || 0})
                </TabsTrigger>
                <TabsTrigger value="synced">
                  已同步 ({levelStatuses[selectedLevel]?.summary.synced || 0})
                </TabsTrigger>
                {syncResults[selectedLevel] && (
                  <TabsTrigger value="result">同步结果</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    label="洛谷题目数"
                    value={levelStatuses[selectedLevel]?.summary.remote || 0}
                    icon={<ExternalLink className="w-4 h-4" />}
                  />
                  <StatCard
                    label="本地题目数"
                    value={levelStatuses[selectedLevel]?.summary.local || 0}
                    icon={<Database className="w-4 h-4" />}
                  />
                  <StatCard
                    label="已同步"
                    value={levelStatuses[selectedLevel]?.summary.synced || 0}
                    icon={<CheckCircle2 className="w-4 h-4 text-success" />}
                    className="text-success"
                  />
                  <StatCard
                    label="缺少"
                    value={levelStatuses[selectedLevel]?.summary.missing || 0}
                    icon={<AlertTriangle className="w-4 h-4 text-warning" />}
                    className={
                      (levelStatuses[selectedLevel]?.summary.missing || 0) > 0
                        ? "text-warning"
                        : ""
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="missing" className="mt-4">
                <div className="space-y-2">
                  {levelStatuses[selectedLevel]?.missing.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success" />
                      <p>所有题目已同步，无缺失</p>
                    </div>
                  ) : (
                    levelStatuses[selectedLevel]?.missing.map((problemId) => (
                      <div
                        key={problemId}
                        className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="font-mono">{problemId}</span>
                        </div>
                        <a
                          href={`https://www.luogu.com.cn/problem/${problemId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          在洛谷查看
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="synced" className="mt-4">
                <div className="space-y-2">
                  {levelStatuses[selectedLevel]?.synced.map((problemId) => (
                    <div
                      key={problemId}
                      className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span className="font-mono">{problemId}</span>
                      </div>
                      <a
                        href={`https://www.luogu.com.cn/problem/${problemId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        在洛谷查看
                      </a>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {syncResults[selectedLevel] && (
                <TabsContent value="result" className="mt-4">
                  <div className="space-y-4">
                    {/* 同步摘要 */}
                    <div className="grid grid-cols-4 gap-4">
                      <StatCard
                        label="总计"
                        value={syncResults[selectedLevel]?.summary.total || 0}
                        icon={<Database className="w-4 h-4" />}
                      />
                      <StatCard
                        label="新增"
                        value={syncResults[selectedLevel]?.summary.created || 0}
                        icon={<Check className="w-4 h-4 text-success" />}
                        className="text-success"
                      />
                      <StatCard
                        label="更新"
                        value={syncResults[selectedLevel]?.summary.updated || 0}
                        icon={<RefreshCw className="w-4 h-4 text-primary" />}
                        className="text-primary"
                      />
                      <StatCard
                        label="错误"
                        value={syncResults[selectedLevel]?.summary.errors || 0}
                        icon={<XCircle className="w-4 h-4 text-destructive" />}
                        className={
                          (syncResults[selectedLevel]?.summary.errors || 0) > 0
                            ? "text-destructive"
                            : ""
                        }
                      />
                    </div>

                    {/* 详细结果 */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {syncResults[selectedLevel]?.results.map((result, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border",
                            result.action === "created" &&
                              "bg-success/10 border-success/20",
                            result.action === "updated" &&
                              "bg-primary/10 border-primary/20",
                            result.action === "error" &&
                              "bg-destructive/10 border-destructive/20"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {result.action === "created" && (
                              <Badge variant="default" className="bg-success">
                                新增
                              </Badge>
                            )}
                            {result.action === "updated" && (
                              <Badge variant="default">更新</Badge>
                            )}
                            {result.action === "error" && (
                              <Badge variant="destructive">错误</Badge>
                            )}
                            <span className="font-mono">{result.problemId}</span>
                            {result.title && (
                              <span className="text-muted-foreground text-sm truncate max-w-xs">
                                {result.title}
                              </span>
                            )}
                          </div>
                          {result.error && (
                            <span className="text-destructive text-sm">
                              {result.error}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>点击"检查状态"查看同步情况</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 统计卡片组件
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

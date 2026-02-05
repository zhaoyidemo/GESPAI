"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ErrorCaseCard,
  ErrorCaseCardSkeleton,
  ERROR_TYPE_CONFIG,
} from "@/components/error-case";
import { BookOpen, Shield, Filter, AlertTriangle, TrendingDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ErrorCase {
  id: string;
  status: string;
  errorType: string | null;
  q1Answer: string | null;
  q2Answer: string | null;
  q3Answer: string | null;
  createdAt: string;
  problem: {
    id: string;
    title: string;
    level: number;
    difficulty: string;
    knowledgePoints: string[];
  };
  submission: {
    status: string;
    createdAt: string;
  };
  preventionRule?: {
    id: string;
    rule: string;
  } | null;
}

export default function ErrorBookPage() {
  const [errorCases, setErrorCases] = useState<ErrorCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [errorTypeFilter, setErrorTypeFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchErrorCases();
  }, [statusFilter, errorTypeFilter]);

  const handleDeleteErrorCase = async (id: string) => {
    try {
      const response = await fetch(`/api/error-case/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setErrorCases((prev) => prev.filter((e) => e.id !== id));
        toast({
          title: "删除成功",
          description: "错题记录已删除",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "删除失败");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: error instanceof Error ? error.message : "请重试",
      });
      throw error;
    }
  };

  const fetchErrorCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (errorTypeFilter !== "all") {
        params.set("errorType", errorTypeFilter);
      }

      const response = await fetch(`/api/error-case?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setErrorCases(data.errorCases);
      }
    } catch (error) {
      console.error("Failed to fetch error cases:", error);
    } finally {
      setLoading(false);
    }
  };

  // 统计数据
  const stats = {
    total: errorCases.length,
    pending: errorCases.filter((e) => e.status === "pending").length,
    inProgress: errorCases.filter((e) => e.status === "in_progress").length,
    completed: errorCases.filter((e) => e.status === "completed").length,
  };

  const errorTypeStats = Object.keys(ERROR_TYPE_CONFIG).reduce(
    (acc, type) => {
      acc[type] = errorCases.filter((e) => e.errorType === type).length;
      return acc;
    },
    {} as Record<string, number>
  );

  // 双维度分析：错误类型 + 知识点
  const weakPointAnalysis = useMemo(() => {
    // 按知识点和错误类型分组统计
    const analysis: Record<string, Record<string, number>> = {};

    errorCases.forEach((errorCase) => {
      if (!errorCase.errorType) return;

      const knowledgePoints = errorCase.problem.knowledgePoints || [];
      knowledgePoints.forEach((kp) => {
        if (!analysis[kp]) {
          analysis[kp] = {};
        }
        if (!analysis[kp][errorCase.errorType!]) {
          analysis[kp][errorCase.errorType!] = 0;
        }
        analysis[kp][errorCase.errorType!]++;
      });
    });

    // 找出高频错误组合（同一知识点+错误类型 >= 2次）
    const weakPoints: Array<{
      knowledgePoint: string;
      errorType: string;
      count: number;
    }> = [];

    Object.entries(analysis).forEach(([kp, types]) => {
      Object.entries(types).forEach(([type, count]) => {
        if (count >= 2) {
          weakPoints.push({
            knowledgePoint: kp,
            errorType: type,
            count,
          });
        }
      });
    });

    // 按次数排序
    weakPoints.sort((a, b) => b.count - a.count);

    return weakPoints.slice(0, 5); // 最多显示5个
  }, [errorCases]);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">错题本</h1>
            <p className="text-muted-foreground">记录错误，总结经验，避免再犯</p>
          </div>
        </div>
        <Link href="/error-book/rules">
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            防错规则
          </Button>
        </Link>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">总错题数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-muted-foreground">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">待复盘</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-500">{stats.inProgress}</p>
            <p className="text-sm text-muted-foreground">复盘中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">已完成</p>
          </CardContent>
        </Card>
      </div>

      {/* 双维度薄弱点分析 */}
      {weakPointAnalysis.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-800">
              <TrendingDown className="h-5 w-5" />
              薄弱点分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700 mb-4">
              以下知识点+错误类型组合出现多次，建议重点关注：
            </p>
            <div className="space-y-3">
              {weakPointAnalysis.map((item, index) => {
                const typeConfig =
                  ERROR_TYPE_CONFIG[item.errorType as keyof typeof ERROR_TYPE_CONFIG];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-red-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">
                          在 <span className="text-primary">{item.knowledgePoint}</span> 相关题目上
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          常犯 <span>{typeConfig?.emoji}</span>
                          <span className="font-medium">{typeConfig?.label}</span> 错误
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive">{item.count} 次</Badge>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                建议：针对这些薄弱点进行专项练习，并仔细复盘相关错题
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 错误类型分布 - 按 OJ 状态分组 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">错误类型分布</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* WA 相关错误 */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">答案错误 [WA]</p>
            <div className="flex flex-wrap gap-2">
              {["misread", "boundary", "careless", "uninit", "logic", "algorithm", "overflow"].map((type) => {
                const config = ERROR_TYPE_CONFIG[type as keyof typeof ERROR_TYPE_CONFIG];
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 text-sm"
                  >
                    <span>{config.emoji}</span>
                    <span>{config.label}</span>
                    <Badge variant="secondary" className="ml-1">{errorTypeStats[type] || 0}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
          {/* 其他状态 */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">其他状态 [CE/TLE/RE]</p>
            <div className="flex flex-wrap gap-2">
              {["syntax", "timeout", "runtime"].map((type) => {
                const config = ERROR_TYPE_CONFIG[type as keyof typeof ERROR_TYPE_CONFIG];
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 text-sm"
                  >
                    <span>{config.emoji}</span>
                    <span>{config.label}</span>
                    <span className="text-xs text-muted-foreground">[{config.ojStatus}]</span>
                    <Badge variant="secondary" className="ml-1">{errorTypeStats[type] || 0}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 筛选和列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              错题列表
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待复盘</SelectItem>
                  <SelectItem value="in_progress">复盘中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
              <Select value={errorTypeFilter} onValueChange={setErrorTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="错误类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">答案错误 [WA]</div>
                  {["misread", "boundary", "careless", "uninit", "logic", "algorithm", "overflow"].map((type) => {
                    const config = ERROR_TYPE_CONFIG[type as keyof typeof ERROR_TYPE_CONFIG];
                    return (
                      <SelectItem key={type} value={type}>
                        {config.emoji} {config.label}
                      </SelectItem>
                    );
                  })}
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">其他状态</div>
                  {["syntax", "timeout", "runtime"].map((type) => {
                    const config = ERROR_TYPE_CONFIG[type as keyof typeof ERROR_TYPE_CONFIG];
                    return (
                      <SelectItem key={type} value={type}>
                        {config.emoji} {config.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <ErrorCaseCardSkeleton key={i} />
              ))}
            </div>
          ) : errorCases.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold text-lg mb-2">还没有错题记录</h3>
              <p className="text-muted-foreground mb-4">
                做题时遇到错误，可以记录到错题本进行复盘
              </p>
              <Link href="/problem">
                <Button>去做题</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {errorCases.map((errorCase) => (
                <ErrorCaseCard
                  key={errorCase.id}
                  errorCase={errorCase}
                  onDelete={handleDeleteErrorCase}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

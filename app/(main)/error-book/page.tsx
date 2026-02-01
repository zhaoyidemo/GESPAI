"use client";

import { useState, useEffect } from "react";
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
import { BookOpen, Shield, Filter } from "lucide-react";

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

  useEffect(() => {
    fetchErrorCases();
  }, [statusFilter, errorTypeFilter]);

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
            <p className="text-3xl font-bold text-gray-500">{stats.pending}</p>
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

      {/* 错误类型分布 - 按 OJ 状态分组 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">错误类型分布（10种）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* WA 相关错误 */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">答案错误 [WA]</p>
            <div className="flex flex-wrap gap-2">
              {["misread", "boundary", "logic", "algorithm", "overflow"].map((type) => {
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
            <p className="text-xs text-muted-foreground mb-2 font-medium">其他状态 [CE/TLE/RE/MLE/PE]</p>
            <div className="flex flex-wrap gap-2">
              {["syntax", "timeout", "runtime", "memory", "format"].map((type) => {
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
                  {["misread", "boundary", "logic", "algorithm", "overflow"].map((type) => {
                    const config = ERROR_TYPE_CONFIG[type as keyof typeof ERROR_TYPE_CONFIG];
                    return (
                      <SelectItem key={type} value={type}>
                        {config.emoji} {config.label}
                      </SelectItem>
                    );
                  })}
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">其他状态</div>
                  {["syntax", "timeout", "runtime", "memory", "format"].map((type) => {
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
                <ErrorCaseCard key={errorCase.id} errorCase={errorCase} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PreventionRuleCard,
  PreventionRuleCardSkeleton,
  ERROR_TYPE_CONFIG,
} from "@/components/error-case";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Shield, AlertTriangle } from "lucide-react";

interface PreventionRule {
  id: string;
  errorType: string;
  rule: string;
  hitCount: number;
  lastHitAt: string | null;
  isActive: boolean;
  createdAt: string;
  relatedCasesCount?: number;
}

export default function PreventionRulesPage() {
  const { toast } = useToast();
  const [rules, setRules] = useState<PreventionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorTypeFilter, setErrorTypeFilter] = useState<string>("all");

  useEffect(() => {
    fetchRules();
  }, [errorTypeFilter]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (errorTypeFilter !== "all") {
        params.set("errorType", errorTypeFilter);
      }

      const response = await fetch(`/api/prevention-rules?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setRules(data.rules);
      }
    } catch (error) {
      console.error("Failed to fetch rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/prevention-rules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setRules((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isActive } : r))
        );
        toast({
          title: isActive ? "规则已启用" : "规则已停用",
        });
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Failed to toggle rule:", error);
      toast({
        title: "操作失败",
        description: "请重试",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/prevention-rules/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRules((prev) => prev.filter((r) => r.id !== id));
        toast({
          title: "规则已删除",
        });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete rule:", error);
      toast({
        title: "删除失败",
        description: "请重试",
        variant: "destructive",
      });
    }
  };

  // 按错误类型分组
  const groupedRules = rules.reduce((acc, rule) => {
    if (!acc[rule.errorType]) {
      acc[rule.errorType] = [];
    }
    acc[rule.errorType].push(rule);
    return acc;
  }, {} as Record<string, PreventionRule[]>);

  // 统计
  const stats = {
    total: rules.length,
    active: rules.filter((r) => r.isActive).length,
    totalHits: rules.reduce((sum, r) => sum + r.hitCount, 0),
  };

  // 高频触发规则（命中次数 > 0）
  const frequentRules = rules
    .filter((r) => r.hitCount > 0)
    .sort((a, b) => b.hitCount - a.hitCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/error-book">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回错题本
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">防错规则</h1>
              <p className="text-muted-foreground">
                从错误中总结的规则，帮助你避免再次犯错
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">总规则数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">{stats.active}</p>
            <p className="text-sm text-muted-foreground">启用中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats.totalHits}</p>
            <p className="text-sm text-muted-foreground">总触发次数</p>
          </CardContent>
        </Card>
      </div>

      {/* 高频触发警告 */}
      {frequentRules.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              需要注意的规则
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 mb-4">
              以下规则被多次触发，建议重点关注：
            </p>
            <div className="space-y-2">
              {frequentRules.map((rule) => {
                const typeConfig =
                  ERROR_TYPE_CONFIG[
                    rule.errorType as keyof typeof ERROR_TYPE_CONFIG
                  ];
                return (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <span>{typeConfig?.emoji || "\u2753"}</span>
                      <span className="text-sm">{rule.rule}</span>
                    </div>
                    <Badge variant="destructive">
                      触发 {rule.hitCount} 次
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 筛选 */}
      <div className="flex items-center gap-4">
        <Select value={errorTypeFilter} onValueChange={setErrorTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="按错误类型筛选" />
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
        <p className="text-sm text-muted-foreground">
          共 {rules.length} 条规则
        </p>
      </div>

      {/* 规则列表 */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <PreventionRuleCardSkeleton key={i} />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold text-lg mb-2">还没有防错规则</h3>
              <p className="text-muted-foreground mb-4">
                完成错题三问后，会自动生成防错规则
              </p>
              <Link href="/error-book">
                <Button>去复盘错题</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : errorTypeFilter === "all" ? (
        // 按类型分组显示
        <div className="space-y-6">
          {Object.entries(groupedRules).map(([type, typeRules]) => {
            const typeConfig =
              ERROR_TYPE_CONFIG[type as keyof typeof ERROR_TYPE_CONFIG];
            return (
              <div key={type}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-xl">{typeConfig?.emoji || "\u2753"}</span>
                  <span>{typeConfig?.label || type}</span>
                  <Badge variant="secondary">{typeRules.length}</Badge>
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {typeRules.map((rule) => (
                    <PreventionRuleCard
                      key={rule.id}
                      rule={rule}
                      onToggleActive={handleToggleActive}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // 不分组显示
        <div className="grid gap-4 md:grid-cols-2">
          {rules.map((rule) => (
            <PreventionRuleCard
              key={rule.id}
              rule={rule}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

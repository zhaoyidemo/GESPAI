"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Code, Search, Filter, CheckCircle, Circle, XCircle } from "lucide-react";
import { getDifficultyLabel } from "@/lib/utils";

interface Problem {
  id: string;
  title: string;
  level: number;
  difficulty: string;
  knowledgePoints: string[];
  source: string;
  userStatus: string | null;
  submissionCount: number;
}

export default function ProblemListPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: "",
    difficulty: "",
    search: "",
  });

  useEffect(() => {
    fetchProblems();
  }, [filters.level, filters.difficulty]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.level) params.append("level", filters.level);
      if (filters.difficulty) params.append("difficulty", filters.difficulty);

      const response = await fetch(`/api/problems?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProblems(data.problems);
      }
    } catch (error) {
      console.error("Fetch problems error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string | null) => {
    if (status === "accepted") {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (status && status !== "accepted") {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <Circle className="h-5 w-5 text-gray-300" />;
  };

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span>题库</span>
        </h1>
        <p className="text-muted-foreground">练习 GESP 编程题目，提升算法能力</p>
      </div>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索题目..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={filters.level}
              onValueChange={(value) =>
                setFilters({ ...filters, level: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部级别</SelectItem>
                <SelectItem value="3">3 级</SelectItem>
                <SelectItem value="4">4 级</SelectItem>
                <SelectItem value="5">5 级</SelectItem>
                <SelectItem value="6">6 级</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.difficulty}
              onValueChange={(value) =>
                setFilters({ ...filters, difficulty: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="难度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部难度</SelectItem>
                <SelectItem value="easy">简单</SelectItem>
                <SelectItem value="medium">中等</SelectItem>
                <SelectItem value="hard">困难</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 题目列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            题目列表（{filteredProblems.length} 题）
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">加载中...</p>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Code className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>暂无题目</p>
              <p className="text-sm">题库正在建设中，敬请期待</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProblems.map((problem) => {
                const difficultyInfo = getDifficultyLabel(problem.difficulty);
                return (
                  <Link
                    key={problem.id}
                    href={`/problem/${problem.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(problem.userStatus)}
                      <div>
                        <h3 className="font-medium">{problem.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {problem.level} 级
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${difficultyInfo.color}`}
                          >
                            {difficultyInfo.label}
                          </Badge>
                          {problem.knowledgePoints.slice(0, 2).map((kp) => (
                            <Badge
                              key={kp}
                              variant="secondary"
                              className="text-xs"
                            >
                              {kp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      做题
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

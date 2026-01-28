"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, BookOpen, CheckCircle, Circle, Clock, Lock } from "lucide-react";

// GESP 5级知识点数据
const knowledgePoints = {
  level5: [
    {
      id: "recursion",
      name: "递归",
      category: "算法基础",
      status: "in_progress",
      progress: 30,
      description: "函数调用自身的编程技巧",
    },
    {
      id: "dfs",
      name: "深度优先搜索（DFS）",
      category: "搜索算法",
      status: "not_started",
      progress: 0,
      description: "沿着分支深度遍历图或树",
    },
    {
      id: "bfs",
      name: "广度优先搜索（BFS）",
      category: "搜索算法",
      status: "not_started",
      progress: 0,
      description: "逐层遍历图或树",
    },
    {
      id: "memoization",
      name: "记忆化搜索",
      category: "优化技术",
      status: "not_started",
      progress: 0,
      description: "缓存计算结果避免重复计算",
    },
    {
      id: "backtracking",
      name: "回溯算法",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "通过试错寻找所有解",
    },
    {
      id: "divide-conquer",
      name: "分治算法",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "将大问题分解为小问题",
    },
  ],
  level4: [
    {
      id: "sorting",
      name: "排序算法",
      category: "算法基础",
      status: "completed",
      progress: 100,
      description: "冒泡、选择、插入等排序",
    },
    {
      id: "binary-search",
      name: "二分查找",
      category: "搜索算法",
      status: "completed",
      progress: 100,
      description: "在有序数组中高效查找",
    },
    {
      id: "stack-queue",
      name: "栈和队列",
      category: "数据结构",
      status: "completed",
      progress: 100,
      description: "基本的线性数据结构",
    },
  ],
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "in_progress":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "locked":
      return <Lock className="h-5 w-5 text-gray-400" />;
    default:
      return <Circle className="h-5 w-5 text-gray-300" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="success">已完成</Badge>;
    case "in_progress":
      return <Badge variant="warning">学习中</Badge>;
    case "locked":
      return <Badge variant="outline">未解锁</Badge>;
    default:
      return <Badge variant="outline">未开始</Badge>;
  }
};

export default function KnowledgeMapPage() {
  const [selectedLevel, setSelectedLevel] = useState("5");

  const currentPoints = selectedLevel === "5" ? knowledgePoints.level5 : knowledgePoints.level4;

  const completedCount = currentPoints.filter(p => p.status === "completed").length;
  const totalCount = currentPoints.length;
  const overallProgress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Map className="h-6 w-6" />
          <span>知识点地图</span>
        </h1>
        <p className="text-muted-foreground">系统化学习 GESP 考试知识点</p>
      </div>

      {/* 进度概览 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">GESP {selectedLevel} 级学习进度</h3>
              <p className="text-sm text-muted-foreground">
                已完成 {completedCount}/{totalCount} 个知识点
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{overallProgress}%</p>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* 级别切换 */}
      <Tabs value={selectedLevel} onValueChange={setSelectedLevel}>
        <TabsList>
          <TabsTrigger value="4">GESP 4 级</TabsTrigger>
          <TabsTrigger value="5">GESP 5 级</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedLevel} className="mt-4">
          {/* 知识点分类 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPoints.map((point) => (
              <Link
                key={point.id}
                href={`/learn/${point.id}`}
                className="block"
              >
                <Card className="hover:border-primary/50 hover:shadow-md transition-all knowledge-node h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(point.status)}
                        <CardTitle className="text-base">{point.name}</CardTitle>
                      </div>
                      {getStatusBadge(point.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {point.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {point.category}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Progress value={point.progress} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground">
                          {point.progress}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 学习建议 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>学习建议</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                1
              </div>
              <div>
                <p className="font-medium">先掌握递归</p>
                <p className="text-sm text-muted-foreground">
                  递归是 DFS、回溯等算法的基础，务必先理解透彻
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                2
              </div>
              <div>
                <p className="font-medium">多做练习题</p>
                <p className="text-sm text-muted-foreground">
                  每个知识点至少完成 5 道练习题，加深理解
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                3
              </div>
              <div>
                <p className="font-medium">及时复习</p>
                <p className="text-sm text-muted-foreground">
                  学完新知识后，定期回顾已学内容，巩固记忆
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

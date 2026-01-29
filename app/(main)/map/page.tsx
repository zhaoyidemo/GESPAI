"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, BookOpen, CheckCircle, Circle, Clock, Lock } from "lucide-react";

// GESP 1-8级知识点数据（基于官方标准和现有题库）
const knowledgePointsByLevel: Record<string, Array<{
  id: string;
  name: string;
  category: string;
  status: string;
  progress: number;
  description: string;
}>> = {
  "1": [
    {
      id: "loop-basic",
      name: "循环语句",
      category: "C++基础",
      status: "not_started",
      progress: 0,
      description: "for和while循环的基本使用",
    },
    {
      id: "condition",
      name: "条件判断",
      category: "C++基础",
      status: "not_started",
      progress: 0,
      description: "if-else分支结构",
    },
    {
      id: "modulo",
      name: "取模运算",
      category: "数学基础",
      status: "not_started",
      progress: 0,
      description: "取余运算和整除判断",
    },
    {
      id: "time-calc",
      name: "时间计算",
      category: "数学应用",
      status: "not_started",
      progress: 0,
      description: "时分秒转换和计算",
    },
    {
      id: "sum",
      name: "累加求和",
      category: "数学基础",
      status: "not_started",
      progress: 0,
      description: "循环累加和求和公式",
    },
    {
      id: "divisor",
      name: "因数与倍数",
      category: "数学基础",
      status: "not_started",
      progress: 0,
      description: "判断因数和倍数关系",
    },
  ],
  "2": [
    {
      id: "nested-loop",
      name: "循环嵌套",
      category: "C++基础",
      status: "not_started",
      progress: 0,
      description: "二重循环和多重循环",
    },
    {
      id: "char-output",
      name: "字符输出",
      category: "C++基础",
      status: "not_started",
      progress: 0,
      description: "字符和ASCII码输出",
    },
    {
      id: "matrix-output",
      name: "矩阵输出",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "二维图案和矩阵打印",
    },
    {
      id: "prime",
      name: "素数判断",
      category: "数学基础",
      status: "not_started",
      progress: 0,
      description: "判断质数的基本方法",
    },
    {
      id: "digit",
      name: "数位分离",
      category: "数学基础",
      status: "not_started",
      progress: 0,
      description: "分离数字的各个位",
    },
    {
      id: "fibonacci",
      name: "斐波那契数列",
      category: "数学应用",
      status: "not_started",
      progress: 0,
      description: "递推求斐波那契数",
    },
  ],
  "3": [
    {
      id: "array",
      name: "一维数组",
      category: "数据结构",
      status: "not_started",
      progress: 0,
      description: "数组的定义和使用",
    },
    {
      id: "string",
      name: "字符串基础",
      category: "数据结构",
      status: "not_started",
      progress: 0,
      description: "字符串处理和操作",
    },
    {
      id: "function",
      name: "函数",
      category: "C++基础",
      status: "not_started",
      progress: 0,
      description: "函数定义和调用",
    },
    {
      id: "base-conversion",
      name: "进制转换",
      category: "数学基础",
      status: "not_started",
      progress: 0,
      description: "二进制、八进制、十六进制",
    },
    {
      id: "bit-operation",
      name: "位运算基础",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "按位与、或、异或运算",
    },
    {
      id: "prefix-sum",
      name: "前缀和",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "一维前缀和的计算",
    },
  ],
  "4": [
    {
      id: "sorting",
      name: "排序算法",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "冒泡、选择、插入排序",
    },
    {
      id: "2d-array",
      name: "二维数组",
      category: "数据结构",
      status: "not_started",
      progress: 0,
      description: "矩阵和二维数组操作",
    },
    {
      id: "greedy",
      name: "贪心算法入门",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "简单贪心策略",
    },
    {
      id: "two-pointers",
      name: "双指针",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "双指针技巧",
    },
    {
      id: "string-adv",
      name: "字符串进阶",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "字符串匹配和处理",
    },
    {
      id: "stl-basic",
      name: "STL容器基础",
      category: "C++基础",
      status: "not_started",
      progress: 0,
      description: "vector、set等基本容器",
    },
  ],
  "5": [
    {
      id: "gcd-lcm",
      name: "最大公约数与最小公倍数",
      category: "数论",
      status: "not_started",
      progress: 0,
      description: "辗转相除法",
    },
    {
      id: "prime-factor",
      name: "质因数分解",
      category: "数论",
      status: "not_started",
      progress: 0,
      description: "分解质因数",
    },
    {
      id: "binary-search",
      name: "二分查找",
      category: "搜索算法",
      status: "not_started",
      progress: 0,
      description: "在有序数组中高效查找",
    },
    {
      id: "bit-adv",
      name: "位运算进阶",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "位运算技巧和应用",
    },
    {
      id: "prefix-2d",
      name: "二维前缀和",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "矩阵前缀和",
    },
    {
      id: "fast-power",
      name: "快速幂",
      category: "数论",
      status: "not_started",
      progress: 0,
      description: "快速幂算法",
    },
  ],
  "6": [
    {
      id: "dp-basic",
      name: "动态规划入门",
      category: "动态规划",
      status: "not_started",
      progress: 0,
      description: "简单DP和递推",
    },
    {
      id: "knapsack",
      name: "背包问题",
      category: "动态规划",
      status: "not_started",
      progress: 0,
      description: "01背包和完全背包",
    },
    {
      id: "merge-sort",
      name: "归并排序",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "分治思想和归并排序",
    },
    {
      id: "tree-basic",
      name: "树的基础",
      category: "数据结构",
      status: "not_started",
      progress: 0,
      description: "树的表示和遍历",
    },
    {
      id: "lca",
      name: "最近公共祖先（LCA）",
      category: "数据结构",
      status: "not_started",
      progress: 0,
      description: "树上LCA问题",
    },
    {
      id: "dfs-tree",
      name: "树的DFS",
      category: "搜索算法",
      status: "not_started",
      progress: 0,
      description: "深度优先搜索树",
    },
  ],
  "7": [
    {
      id: "graph-basic",
      name: "图论基础",
      category: "图论",
      status: "not_started",
      progress: 0,
      description: "图的表示和遍历",
    },
    {
      id: "shortest-path",
      name: "最短路算法",
      category: "图论",
      status: "not_started",
      progress: 0,
      description: "Dijkstra和SPFA",
    },
    {
      id: "dp-adv",
      name: "动态规划进阶",
      category: "动态规划",
      status: "not_started",
      progress: 0,
      description: "LIS、LCS等经典DP",
    },
    {
      id: "dag",
      name: "拓扑排序",
      category: "图论",
      status: "not_started",
      progress: 0,
      description: "DAG上的拓扑排序",
    },
    {
      id: "bipartite",
      name: "二分图",
      category: "图论",
      status: "not_started",
      progress: 0,
      description: "二分图判定和染色",
    },
    {
      id: "interval-dp",
      name: "区间DP",
      category: "动态规划",
      status: "not_started",
      progress: 0,
      description: "区间动态规划",
    },
  ],
  "8": [
    {
      id: "data-structure-adv",
      name: "高级数据结构",
      category: "数据结构",
      status: "not_started",
      progress: 0,
      description: "线段树、树状数组等",
    },
    {
      id: "graph-adv",
      name: "图论进阶",
      category: "图论",
      status: "not_started",
      progress: 0,
      description: "最小生成树、网络流",
    },
    {
      id: "combinatorics",
      name: "组合数学",
      category: "数论",
      status: "not_started",
      progress: 0,
      description: "排列组合和容斥原理",
    },
    {
      id: "tree-diameter",
      name: "树的直径",
      category: "图论",
      status: "not_started",
      progress: 0,
      description: "求树的直径",
    },
    {
      id: "sliding-window",
      name: "滑动窗口",
      category: "算法基础",
      status: "not_started",
      progress: 0,
      description: "双指针和滑动窗口",
    },
    {
      id: "discretization",
      name: "离散化",
      category: "算法技巧",
      status: "not_started",
      progress: 0,
      description: "坐标压缩和离散化",
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

  const currentPoints = knowledgePointsByLevel[selectedLevel] || [];

  const completedCount = currentPoints.filter(p => p.status === "completed").length;
  const totalCount = currentPoints.length;
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Map className="h-6 w-6" />
          <span>知识点地图</span>
        </h1>
        <p className="text-muted-foreground">系统化学习 GESP C++ 考试知识点（1-8级）</p>
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
        <TabsList className="grid grid-cols-8 w-full">
          <TabsTrigger value="1">1级</TabsTrigger>
          <TabsTrigger value="2">2级</TabsTrigger>
          <TabsTrigger value="3">3级</TabsTrigger>
          <TabsTrigger value="4">4级</TabsTrigger>
          <TabsTrigger value="5">5级</TabsTrigger>
          <TabsTrigger value="6">6级</TabsTrigger>
          <TabsTrigger value="7">7级</TabsTrigger>
          <TabsTrigger value="8">8级</TabsTrigger>
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

          {/* 级别说明 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>GESP {selectedLevel} 级说明</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                {selectedLevel === "1" && (
                  <p>1级主要考查C++基础语法和简单数学运算，包括循环、条件判断、时间计算等基础知识点。</p>
                )}
                {selectedLevel === "2" && (
                  <p>2级在1级基础上增加了循环嵌套、字符处理、矩阵输出等知识点，开始接触简单的算法思想。</p>
                )}
                {selectedLevel === "3" && (
                  <p>3级引入数组、字符串、函数等数据结构，以及进制转换、位运算、前缀和等算法基础。</p>
                )}
                {selectedLevel === "4" && (
                  <p>4级开始学习排序算法、二维数组、贪心算法、双指针等重要算法技巧，并接触STL容器。</p>
                )}
                {selectedLevel === "5" && (
                  <p>5级深入数论（GCD/LCM、质因数分解）、二分查找、高级位运算和快速幂等算法。</p>
                )}
                {selectedLevel === "6" && (
                  <p>6级引入动态规划、背包问题、归并排序、树的基础知识等重要算法和数据结构。</p>
                )}
                {selectedLevel === "7" && (
                  <p>7级主要学习图论（最短路、拓扑排序、二分图）和高级动态规划（LIS、区间DP）。</p>
                )}
                {selectedLevel === "8" && (
                  <p>8级涉及高级数据结构（线段树、树状数组）、图论进阶、组合数学等竞赛级别的知识点。</p>
                )}
              </div>
            </CardContent>
          </Card>
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
                <p className="font-medium">循序渐进</p>
                <p className="text-sm text-muted-foreground">
                  建议从低级别开始学习，扎实掌握基础知识后再进阶
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

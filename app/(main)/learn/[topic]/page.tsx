"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/chat-interface";
import { BookOpen, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

// 知识点数据
const knowledgePointsData: Record<string, { title: string; description: string; level: number }> = {
  recursion: {
    title: "递归",
    description: "递归是一种函数调用自身的编程技巧，是解决分治问题的重要方法。",
    level: 5,
  },
  dfs: {
    title: "深度优先搜索（DFS）",
    description: "DFS 是一种遍历或搜索树或图的算法，沿着分支尽可能深地搜索。",
    level: 5,
  },
  bfs: {
    title: "广度优先搜索（BFS）",
    description: "BFS 是一种遍历或搜索树或图的算法，逐层向外扩展搜索。",
    level: 5,
  },
  memoization: {
    title: "记忆化搜索",
    description: "记忆化搜索是一种优化技术，通过存储已计算的结果避免重复计算。",
    level: 5,
  },
  "binary-search": {
    title: "二分查找",
    description: "二分查找是一种在有序数组中查找特定元素的高效算法。",
    level: 4,
  },
  sorting: {
    title: "排序算法",
    description: "排序算法是将一组数据按特定顺序排列的方法，包括冒泡、选择、插入等。",
    level: 4,
  },
};

export default function LearnTopicPage() {
  const params = useParams();
  const topic = params.topic as string;
  const knowledgePoint = knowledgePointsData[topic] || {
    title: topic,
    description: "正在加载知识点信息...",
    level: 5,
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/map">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>{knowledgePoint.title}</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              GESP {knowledgePoint.level} 级
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <CheckCircle className="h-4 w-4 mr-2" />
          标记完成
        </Button>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* 知识点介绍 */}
        <Card className="lg:col-span-1 overflow-auto">
          <CardHeader>
            <CardTitle className="text-base">知识点介绍</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {knowledgePoint.description}
            </p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">学习要点</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {topic === "recursion" && (
                  <>
                    <li>• 理解递归的基本概念</li>
                    <li>• 掌握递归的三要素</li>
                    <li>• 学会分析递归的时间复杂度</li>
                    <li>• 了解递归与迭代的区别</li>
                  </>
                )}
                {topic === "dfs" && (
                  <>
                    <li>• 理解 DFS 的工作原理</li>
                    <li>• 掌握栈的隐式使用</li>
                    <li>• 学会处理图的遍历</li>
                    <li>• 了解回溯的概念</li>
                  </>
                )}
                {topic === "bfs" && (
                  <>
                    <li>• 理解 BFS 的工作原理</li>
                    <li>• 掌握队列的使用</li>
                    <li>• 学会求最短路径</li>
                    <li>• 了解层序遍历</li>
                  </>
                )}
                {!["recursion", "dfs", "bfs"].includes(topic) && (
                  <>
                    <li>• 理解基本概念</li>
                    <li>• 掌握核心技巧</li>
                    <li>• 完成练习题目</li>
                  </>
                )}
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">推荐练习</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li className="hover:underline cursor-pointer">• 斐波那契数列</li>
                <li className="hover:underline cursor-pointer">• 汉诺塔问题</li>
                <li className="hover:underline cursor-pointer">• 全排列</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* AI 对话 */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-base">AI 辅导</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ChatInterface
              context="learn"
              knowledgePoint={topic}
              initialMessages={[
                {
                  role: "assistant",
                  content: `你好！今天我们来学习**${knowledgePoint.title}**。\n\n${knowledgePoint.description}\n\n准备好开始了吗？有任何问题都可以问我！`,
                },
              ]}
              placeholder="问我任何关于这个知识点的问题..."
              enableVoiceInput
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/chat-interface";
import { BookOpen, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getKnowledgePointById } from "@/lib/gesp-knowledge";

export default function LearnTopicPage() {
  const params = useParams();
  const topic = params.topic as string;
  const knowledgePoint = getKnowledgePointById(topic);

  // 如果找不到知识点，显示默认信息
  const displayPoint = knowledgePoint || {
    id: topic,
    name: topic,
    description: "正在加载知识点信息...",
    level: 1,
    category: "未分类",
    details: []
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
              <span>{displayPoint.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              GESP {displayPoint.level} 级 · {displayPoint.category}
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
              {displayPoint.description}
            </p>

            {displayPoint.details && displayPoint.details.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">学习要点</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {displayPoint.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">学习建议</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 先理解基本概念</li>
                <li>• 多看代码示例</li>
                <li>• 完成相关练习题</li>
                <li>• 有问题随时问AI</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">考试提示</h4>
              <p className="text-sm text-yellow-700">
                本知识点属于 GESP {displayPoint.level} 级考试范围，
                {displayPoint.level <= 4 ? "考试时间120分钟" : "考试时间180分钟"}，
                包含单选题、判断题和编程题。
              </p>
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
                  content: `你好！今天我们来学习**${displayPoint.name}**。\n\n${displayPoint.description}\n\n${displayPoint.details && displayPoint.details.length > 0 ? `这个知识点的学习要点包括：\n${displayPoint.details.map(d => `- ${d}`).join('\n')}\n\n` : ''}准备好开始了吗？有任何问题都可以问我！`,
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

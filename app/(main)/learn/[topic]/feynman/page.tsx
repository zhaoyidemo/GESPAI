"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/chat-interface";
import { MessageCircle, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getKnowledgePointById } from "@/lib/gesp-knowledge";

export default function FeynmanPage() {
  const params = useParams();
  const topic = params.topic as string;
  const knowledgePoint = getKnowledgePointById(topic);
  const [showEndButton, setShowEndButton] = useState(true);

  const displayPoint = knowledgePoint || {
    id: topic,
    name: topic,
    description: "正在加载知识点信息...",
    level: 1,
    category: "未分类",
    details: []
  };

  // 当对话开始后显示结束按钮
  const handleMessageSent = () => {
    setShowEndButton(true);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/learn/${topic}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>费曼学习 - {displayPoint.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              GESP {displayPoint.level} 级 · {displayPoint.category}
            </p>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* 左侧说明 */}
        <Card className="lg:col-span-1 overflow-auto">
          <CardHeader>
            <CardTitle className="text-base">费曼学习法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">什么是费曼学习法？</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                费曼学习法的核心是：如果你能把一个概念讲给别人听，并让对方理解，说明你真正掌握了它。
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">你需要做什么？</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>用自己的话解释 <strong>{displayPoint.name}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>尽量用简单的语言，就像在教一个新手</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>AI 会追问问题，帮你发现理解的盲点</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>讲解完成后点击「结束讲解」获取评估</span>
                </li>
              </ul>
            </div>

            {displayPoint.details && displayPoint.details.length > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">这个知识点包含：</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {displayPoint.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                💡 <strong>提示</strong>：如果你发现讲不清楚某些地方，说明需要回去再学习一下。这正是费曼学习法的价值所在！
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 对话区域 */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
            <CardTitle className="text-base">向 AI 讲解</CardTitle>
            {showEndButton && (
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
                onClick={() => {
                  // 触发结束讲解评估
                  const event = new CustomEvent('feynman-end-explanation');
                  window.dispatchEvent(event);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                结束讲解，获取评估
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ChatInterface
              context="feynman"
              knowledgePoint={topic}
              initialMessages={[
                {
                  role: "assistant",
                  content: `嗨！👋 我听说你学了**${displayPoint.name}**这个知识点，感觉好厉害！\n\n我对这个还不太懂，你能给我讲讲吗？就用简单的话解释就行，我比较笨，太复杂的听不懂 😅\n\n你可以从最基本的概念开始讲起，比如这是什么、有什么用、怎么用之类的～`,
                },
              ]}
              placeholder="开始给 AI 讲解这个知识点..."
              enableVoiceInput
              onMessageSent={handleMessageSent}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

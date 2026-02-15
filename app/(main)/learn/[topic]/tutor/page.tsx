"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/chat-interface";
import { GraduationCap, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { getKnowledgePointById } from "@/lib/gesp-knowledge";
import { useFocusTracker } from "@/hooks/use-focus-tracker";
import { FocusReminder } from "@/components/focus/focus-reminder";

export default function TutorPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const topic = params.topic as string;
  const knowledgePoint = getKnowledgePointById(topic);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { showReminder, awayDuration, dismissReminder } = useFocusTracker({
    pageType: "tutor",
    pageId: topic,
  });

  const displayPoint = knowledgePoint || {
    id: topic,
    name: topic,
    description: "正在加载知识点信息...",
    level: 1,
    category: "未分类",
    details: []
  };

  const handleCompleteLearning = async () => {
    setCompleting(true);
    try {
      const response = await fetch("/api/learning-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          knowledgePointId: topic,
          tutorCompleted: true,
        }),
      });

      if (response.ok) {
        setCompleted(true);
        toast({
          title: "学习完成",
          description: "建议继续进行 GESP AI 私教·验证，巩固理解",
        });

        // 增加XP
        await fetch("/api/user/xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 20, reason: "完成知识点学习" }),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "请重试",
      });
    } finally {
      setCompleting(false);
    }
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
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span>GESP AI 私教·学习 - {displayPoint.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              GESP {displayPoint.level} 级 · {displayPoint.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {completed ? (
            <Button variant="outline" className="text-green-600" disabled>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              已完成
            </Button>
          ) : (
            <Button
              onClick={handleCompleteLearning}
              disabled={completing}
              className="bg-green-600 hover:bg-green-700"
            >
              {completing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  完成学习
                </>
              )}
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/learn/${topic}/feynman`}>
              私教·验证
            </Link>
          </Button>
        </div>
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
                <li>• 有问题随时问 AI</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* AI 对话 */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-base">GESP AI 私教·学习</CardTitle>
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

      <FocusReminder
        open={showReminder}
        awayDuration={awayDuration}
        onDismiss={dismissReminder}
      />
    </div>
  );
}

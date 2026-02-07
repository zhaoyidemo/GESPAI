"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, GraduationCap, MessageCircle } from "lucide-react";
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
    <div className="max-w-4xl mx-auto">
      {/* 顶部导航 */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/map">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回知识点列表
          </Link>
        </Button>
      </div>

      {/* 知识点信息 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold flex items-center justify-center space-x-2 mb-2">
          <BookOpen className="h-6 w-6" />
          <span>{displayPoint.name}</span>
        </h1>
        <p className="text-muted-foreground">
          GESP {displayPoint.level} 级 · {displayPoint.category}
        </p>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
          {displayPoint.description}
        </p>
      </div>

      {/* 学习模式选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GESP AI 私教·学习 */}
        <Link href={`/learn/${topic}/tutor`}>
          <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">GESP AI 私教·学习</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                AI 作为老师，为你讲解知识点、回答问题、提供代码示例
              </p>
              <ul className="text-sm text-left space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>循序渐进的知识讲解</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>随时提问，即时解答</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>丰富的代码示例和练习</span>
                </li>
              </ul>
              <Button className="mt-6 w-full" variant="outline">
                开始学习
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* GESP AI 私教·验证 */}
        <Link href={`/learn/${topic}/feynman`}>
          <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">GESP AI 私教·验证</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                你来当老师，把知识点讲给 AI 听，检验你的理解程度
              </p>
              <ul className="text-sm text-left space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>用自己的话解释概念</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>AI 会追问帮你发现盲点</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>最后获得详细的学习评估</span>
                </li>
              </ul>
              <Button className="mt-6 w-full" variant="outline">
                开始讲解
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 知识点详情 */}
      {displayPoint.details && displayPoint.details.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">学习要点</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {displayPoint.details.map((detail, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-muted-foreground">{detail}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

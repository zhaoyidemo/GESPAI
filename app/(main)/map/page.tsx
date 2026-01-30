"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, BookOpen, CheckCircle, Circle, Clock, Lock, Timer } from "lucide-react";
import { gespKnowledgeData, getLevelExamInfo } from "@/lib/gesp-knowledge";

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
  const [selectedLevel, setSelectedLevel] = useState("1");

  const levelData = gespKnowledgeData[selectedLevel];
  const currentPoints = levelData?.points || [];
  const examInfo = getLevelExamInfo(selectedLevel);

  const completedCount = currentPoints.filter(p => p.status === "completed").length;
  const totalCount = currentPoints.length;
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 按分类分组知识点
  const pointsByCategory = currentPoints.reduce((acc, point) => {
    if (!acc[point.category]) {
      acc[point.category] = [];
    }
    acc[point.category].push(point);
    return acc;
  }, {} as Record<string, typeof currentPoints>);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Map className="h-6 w-6" />
          <span>知识点地图</span>
        </h1>
        <p className="text-muted-foreground">系统化学习 GESP C++ 考试知识点（1-8级）- 基于官方考纲</p>
      </div>

      {/* 进度概览 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">{levelData?.title} 学习进度</h3>
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
          {/* 考试信息 */}
          {examInfo && (
            <Card className="mb-4 bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Timer className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">考试时间：{examInfo.examTime}分钟</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-blue-700">
                    {examInfo.questionTypes.map((qt, idx) => (
                      <span key={idx}>{qt.type}：{qt.count}题×{qt.score}分</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 知识点分类显示 */}
          {Object.entries(pointsByCategory).map(([category, points]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{category}</span>
                <Badge variant="outline" className="ml-2">{points.length}个知识点</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {points.map((point) => (
                  <Link
                    key={point.id}
                    href={`/learn/${point.id}`}
                    className="block"
                  >
                    <Card className="hover:border-primary/50 hover:shadow-md transition-all knowledge-node h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(point.status || "not_started")}
                            <CardTitle className="text-base">{point.name}</CardTitle>
                          </div>
                          {getStatusBadge(point.status || "not_started")}
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
                            <Progress value={point.progress || 0} className="w-16 h-2" />
                            <span className="text-xs text-muted-foreground">
                              {point.progress || 0}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* 级别说明 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{levelData?.title}说明</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">概述</h4>
                  <p className="text-sm text-muted-foreground">{levelData?.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">考核目标</h4>
                  <p className="text-sm text-muted-foreground">{levelData?.objectives}</p>
                </div>
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
                  建议从1级开始学习，扎实掌握基础知识后再进阶。每个级别的知识点都是后续级别的基础。
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
                  每个知识点配合相应的编程题练习，加深理解和记忆。
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
                  学完新知识后，定期回顾已学内容，巩固记忆。5-8级考试时间为180分钟，需要更充分的准备。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

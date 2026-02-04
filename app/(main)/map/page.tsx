"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Timer, GraduationCap, Target, CheckCircle2, Circle } from "lucide-react";
import { gespKnowledgeData, getLevelExamInfo } from "@/lib/gesp-knowledge";
import { cn } from "@/lib/utils";

interface LearningRecord {
  tutorCompleted: boolean;
  feynmanCompleted: boolean;
  feynmanScore: number | null;
  practiceCount: number;
  correctCount: number;
  masteryLevel: number;
  practiceAccuracy: number | null;
}

export default function KnowledgePointsPage() {
  const [selectedLevel, setSelectedLevel] = useState("4");
  const [learningRecords, setLearningRecords] = useState<Record<string, LearningRecord>>({});
  const [loadingRecords, setLoadingRecords] = useState(true);

  // 获取用户的学习记录
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`/api/learning-records?level=${selectedLevel}`);
        const data = await response.json();
        if (response.ok) {
          setLearningRecords(data.records || {});
        }
      } catch (error) {
        console.error("Fetch learning records error:", error);
      } finally {
        setLoadingRecords(false);
      }
    };

    setLoadingRecords(true);
    fetchRecords();
  }, [selectedLevel]);

  const levelData = gespKnowledgeData[selectedLevel];
  const currentPoints = levelData?.points || [];
  const examInfo = getLevelExamInfo(selectedLevel);

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
          <BookOpen className="h-6 w-6" />
          <span>知识点</span>
        </h1>
        <p className="text-muted-foreground">GESP C++ 考试知识点（4-6级）- 基于官方考纲</p>
      </div>

      {/* 级别切换 */}
      <Tabs value={selectedLevel} onValueChange={setSelectedLevel}>
        <TabsList className="grid grid-cols-5 w-full max-w-lg">
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
                <div className="flex items-center justify-between flex-wrap gap-2">
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
                {points.map((point) => {
                  const record = learningRecords[point.id];
                  const masteryLevel = record?.masteryLevel || 0;
                  const masteryColor = masteryLevel >= 80 ? "text-green-500" : masteryLevel >= 50 ? "text-amber-500" : "text-muted-foreground";
                  const masteryBg = masteryLevel >= 80 ? "bg-green-500" : masteryLevel >= 50 ? "bg-amber-500" : "bg-muted";

                  return (
                    <Link
                      key={point.id}
                      href={`/learn/${point.id}`}
                      className="block"
                    >
                      <Card className={cn(
                        "hover:border-primary/50 hover:shadow-md transition-all h-full",
                        masteryLevel >= 80 && "border-green-200 bg-green-50/50",
                        masteryLevel >= 50 && masteryLevel < 80 && "border-amber-200 bg-amber-50/50"
                      )}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{point.name}</CardTitle>
                            {record && (
                              <span className={cn("text-lg font-bold", masteryColor)}>
                                {masteryLevel}%
                              </span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {point.description}
                          </p>

                          {/* 掌握度进度条 */}
                          {record ? (
                            <div className="space-y-2">
                              <Progress value={masteryLevel} className="h-2" />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                {/* 学习状态指示器 */}
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1" title="AI私教">
                                    {record.tutorCompleted ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                    ) : (
                                      <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    )}
                                    <span>学习</span>
                                  </div>
                                  <div className="flex items-center gap-1" title="费曼验证">
                                    {record.feynmanCompleted ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                    ) : (
                                      <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    )}
                                    <span>费曼</span>
                                  </div>
                                  <div className="flex items-center gap-1" title="练习正确率">
                                    {record.practiceCount > 0 ? (
                                      <>
                                        <Target className="h-3.5 w-3.5 text-blue-500" />
                                        <span>{record.practiceAccuracy}%</span>
                                      </>
                                    ) : (
                                      <>
                                        <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />
                                        <span>练习</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <GraduationCap className="h-4 w-4" />
                              <span>尚未开始学习</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
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
    </div>
  );
}

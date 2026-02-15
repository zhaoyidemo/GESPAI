"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Clock,
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";
import { getDaysUntil } from "@/lib/utils";

interface MockExamResult {
  id: string;
  totalScore: number;
  passScore: number;
  passed: boolean;
  choiceScore: number;
  choiceTotal: number;
  programmingScore: number;
  programmingTotal: number;
  timeTaken: number; // 分钟
  createdAt: string;
}

interface UserStats {
  targetLevel: number;
  examDate: string | null;
  totalXp: number;
}

export default function MockExamPage() {
  const { data: session } = useSession();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [examHistory, setExamHistory] = useState<MockExamResult[]>([]);
  const [showStartDialog, setShowStartDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 并行获取用户统计和模拟考试历史
        const [statsResponse, examResponse] = await Promise.all([
          fetch("/api/user/stats"),
          fetch("/api/mock-exam?limit=10"),
        ]);

        const [statsData, examData] = await Promise.all([
          statsResponse.json(),
          examResponse.json(),
        ]);

        if (statsResponse.ok) {
          setUserStats({
            targetLevel: statsData.targetLevel || 5,
            examDate: statsData.examDate,
            totalXp: statsData.totalXp || 0,
          });
        }

        if (examResponse.ok && examData.results) {
          setExamHistory(examData.results);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const daysUntilExam = userStats?.examDate ? getDaysUntil(userStats.examDate) : null;
  const isSprintMode = daysUntilExam !== null && daysUntilExam <= 7 && daysUntilExam > 0;

  // 计算预计通过率（基于历史模拟考试和XP）
  const calculatePassProbability = () => {
    if (examHistory.length === 0) {
      // 没有模拟考试记录，基于XP估算
      const xpFactor = Math.min(userStats?.totalXp || 0, 2000) / 2000;
      return Math.round(40 + xpFactor * 40); // 40%-80%
    }

    // 基于最近3次模拟考试
    const recentExams = examHistory.slice(-3);
    const avgScore = recentExams.reduce((sum, e) => sum + e.totalScore, 0) / recentExams.length;
    const passRate = recentExams.filter((e) => e.passed).length / recentExams.length;

    return Math.round((avgScore / 100) * 50 + passRate * 50);
  };

  const passProbability = calculatePassProbability();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              模拟考试
            </h1>
            <p className="text-muted-foreground">
              GESP {userStats?.targetLevel || 5} 级模拟测试
            </p>
          </div>
        </div>
        {isSprintMode && (
          <Badge variant="destructive" className="animate-pulse">
            🔥 冲刺模式 · 还剩 {daysUntilExam} 天
          </Badge>
        )}
      </div>

      {/* 冲刺模式提示 */}
      {isSprintMode && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-orange-800">
                  考前冲刺阶段
                </h3>
                <p className="text-orange-700 mt-1">
                  距离 GESP {userStats?.targetLevel} 级考试仅剩 {daysUntilExam} 天，
                  建议每天完成一次模拟测试，熟悉考试节奏。
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => setShowStartDialog(true)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    立即开始模拟
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/error-book">复习错题</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 考试概览 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 预计通过率 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5" />
                预计通过率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={`${passProbability * 3.52} 352`}
                      strokeLinecap="round"
                      className={
                        passProbability >= 70
                          ? "text-green-500"
                          : passProbability >= 50
                          ? "text-amber-500"
                          : "text-red-500"
                      }
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{passProbability}%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground mb-2">
                    基于你的学习进度和模拟考试成绩预估
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>累计经验值</span>
                      <span className="font-medium">{userStats?.totalXp || 0} XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>模拟考试次数</span>
                      <span className="font-medium">{examHistory.length} 次</span>
                    </div>
                    {examHistory.length > 0 && (
                      <div className="flex justify-between">
                        <span>最近通过率</span>
                        <span className="font-medium">
                          {Math.round(
                            (examHistory.slice(-3).filter((e) => e.passed).length /
                              Math.min(examHistory.length, 3)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 考试说明 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">考试说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">90</p>
                  <p className="text-sm text-muted-foreground">考试时长（分钟）</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">60</p>
                  <p className="text-sm text-muted-foreground">及格分数</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>选择题：15题 × 2分 = 30分</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>编程题：2题 × 35分 = 70分</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>总分：100分，60分及格</span>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={() => setShowStartDialog(true)}
              >
                <Play className="h-5 w-5 mr-2" />
                开始模拟考试
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 历史记录 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>考试记录</span>
                {examHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        await fetch("/api/mock-exam", { method: "DELETE" });
                        setExamHistory([]);
                      } catch (error) {
                        console.error("清空记录失败:", error);
                      }
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {examHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>还没有考试记录</p>
                  <p className="text-sm mt-1">完成一次模拟考试开始</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {examHistory
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((exam, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          exam.passed
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {exam.passed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium">{exam.totalScore}分</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(exam.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          选择 {exam.choiceScore}/{exam.choiceTotal} · 编程{" "}
                          {exam.programmingScore}/{exam.programmingTotal} · 用时{" "}
                          {exam.timeTaken}分钟
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 开始考试对话框 */}
      <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>开始模拟考试</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>你即将开始 GESP {userStats?.targetLevel || 5} 级模拟考试：</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>考试时长：90分钟</li>
                  <li>选择题：15题（每题2分）</li>
                  <li>编程题：2题（每题35分）</li>
                  <li>及格线：60分</li>
                </ul>
                <p className="text-orange-600">
                  注意：考试开始后请勿离开页面，计时会持续进行。
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/mock-exam/test">
                <Play className="h-4 w-4 mr-2" />
                开始考试
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

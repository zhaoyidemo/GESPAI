"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Star,
  Calendar,
  BookOpen,
  Code,
  CheckCircle2,
  Circle,
  ArrowRight,
  Trophy,
  Target
} from "lucide-react";
import { getDaysUntil, formatDate } from "@/lib/utils";

interface DailyTask {
  tasks: Array<{
    type: string;
    targetId: string;
    title: string;
    completed: boolean;
    xpReward: number;
  }>;
  totalXp: number;
  completedXp: number;
  isCompleted: boolean;
}

interface UserStats {
  streakDays: number;
  totalXp: number;
  targetLevel: number;
  examDate: string | null;
  badges: string[];
}

export default function HomePage() {
  const { data: session } = useSession();
  const [dailyTask, setDailyTask] = useState<DailyTask | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSetup, setHasSetup] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 并行获取计划和用户统计
        const [planResponse, statsResponse] = await Promise.all([
          fetch("/api/plan"),
          fetch("/api/user/stats"),
        ]);

        const planData = await planResponse.json();
        const statsData = await statsResponse.json();

        if (planData.plan) {
          setDailyTask(planData.dailyTask);
          setHasSetup(true);
        } else {
          setHasSetup(false);
        }

        if (statsResponse.ok) {
          setUserStats({
            streakDays: statsData.streakDays || 0,
            totalXp: statsData.totalXp || 0,
            targetLevel: statsData.targetLevel || 5,
            examDate: statsData.examDate,
            badges: statsData.badges || [],
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 未设置学习目标
  if (!hasSetup) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">欢迎来到 GESP AI！</CardTitle>
            <CardDescription className="text-base">
              让我们先设置你的学习目标，AI 将为你量身定制学习计划
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href="/setup">
                开始设置
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysUntilExam = userStats?.examDate ? getDaysUntil(userStats.examDate) : null;

  return (
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              你好，{session?.user?.username}！
            </h1>
            <p className="text-white/80">
              {daysUntilExam !== null && daysUntilExam > 0
                ? `距离 GESP ${userStats?.targetLevel} 级考试还有 ${daysUntilExam} 天`
                : "今天也要加油哦！"}
            </p>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Flame className="h-6 w-6" />
                <span className="text-2xl font-bold">{userStats?.streakDays || 0}</span>
              </div>
              <p className="text-sm text-white/70">连胜天数</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-6 w-6" />
                <span className="text-2xl font-bold">{userStats?.totalXp || 0}</span>
              </div>
              <p className="text-sm text-white/70">经验值</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 今日任务 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>今日任务</span>
                  </CardTitle>
                  <CardDescription>
                    {formatDate(new Date())} · 完成任务获取经验值
                  </CardDescription>
                </div>
                {dailyTask && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {dailyTask.completedXp}/{dailyTask.totalXp} XP
                    </p>
                    <Progress
                      value={(dailyTask.completedXp / dailyTask.totalXp) * 100}
                      className="w-24 h-2 mt-1"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {dailyTask?.tasks && dailyTask.tasks.length > 0 ? (
                <div className="space-y-3">
                  {dailyTask.tasks.map((task, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        task.completed
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            {task.type === "learn" ? (
                              <BookOpen className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Code className="h-4 w-4 text-purple-500" />
                            )}
                            <span className={task.completed ? "line-through text-gray-500" : ""}>
                              {task.title}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-yellow-600 font-medium">
                          +{task.xpReward} XP
                        </span>
                        {!task.completed && (
                          <Button size="sm" asChild>
                            <Link href={task.type === "learn" ? `/learn/${task.targetId}` : `/problem/${task.targetId}`}>
                              开始
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>今日任务正在生成中...</p>
                  <Button className="mt-4" asChild>
                    <Link href="/learn/recursion">开始学习</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 考试倒计时 */}
          {daysUntilExam !== null && daysUntilExam > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>考试倒计时</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{daysUntilExam}</p>
                  <p className="text-sm text-muted-foreground">天</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    GESP {userStats?.targetLevel} 级
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 徽章展示 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>我的徽章</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userStats?.badges && userStats.badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userStats.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl"
                    >
                      {badge}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">还没有徽章</p>
                  <p className="text-xs">完成学习任务获取徽章</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 快速入口 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">快速入口</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/map">
                  <BookOpen className="h-4 w-4 mr-2" />
                  知识点地图
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/problem">
                  <Code className="h-4 w-4 mr-2" />
                  题库练习
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/import">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  导入数据
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

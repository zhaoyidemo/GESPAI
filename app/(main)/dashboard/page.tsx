"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Target,
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  AlertTriangle,
  Play,
} from "lucide-react";
import { getDaysUntil, formatDate } from "@/lib/utils";
import { Celebration, TaskCompletionToast } from "@/components/celebration";
import { VibeQuickButton } from "@/components/vibe/vibe-quick-button";
import { FocusReportCard } from "@/components/focus/focus-report-card";

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

  // 庆祝动画状态
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCompletionToast, setShowCompletionToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planResponse, statsResponse] = await Promise.all([
          fetch("/api/plan"),
          fetch("/api/user/stats"),
        ]);

        const planData = await planResponse.json();
        const statsData = await statsResponse.json();

        if (planData.plan) {
          setDailyTask(planData.dailyTask);
          setHasSetup(true);

          // 检查是否需要显示庆祝动画
          if (planData.dailyTask?.isCompleted) {
            const today = new Date().toDateString();
            const celebrationKey = `celebration_shown_${today}`;
            const hasShownToday = localStorage.getItem(celebrationKey);

            if (!hasShownToday) {
              // 显示庆祝动画
              setTimeout(() => {
                setShowCelebration(true);
                setShowCompletionToast(true);
                localStorage.setItem(celebrationKey, "true");
              }, 500);
            }
          }
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
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // 未设置学习目标
  if (!hasSetup) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-3xl flex items-center justify-center animate-float">
            <Target className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">
            欢迎来到 <span className="gradient-text">GESP AI</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            让我们先设置你的学习目标，AI 将为你量身定制学习计划
          </p>
          <Button asChild size="lg" className="btn-glow rounded-xl px-8 h-12 text-base">
            <Link href="/setup">
              开始设置
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const daysUntilExam = userStats?.examDate ? getDaysUntil(userStats.examDate) : null;
  const progressPercent = dailyTask ? (dailyTask.completedXp / dailyTask.totalXp) * 100 : 0;
  const isSprintMode = daysUntilExam !== null && daysUntilExam <= 7 && daysUntilExam > 0;

  return (
    <div className="space-y-8">
      {/* 欢迎横幅 - 渐变玻璃效果 */}
      <div className="relative overflow-hidden rounded-3xl animate-fade-in">
        {/* 背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* 装饰元素 */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-white/80" />
                <span className="text-white/80 text-sm font-medium">
                  {formatDate(new Date())}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                你好，{session?.user?.username}！
              </h1>
              <p className="text-white/80 text-lg">
                {daysUntilExam !== null && daysUntilExam > 0
                  ? `距离 GESP ${userStats?.targetLevel} 级考试还有 ${daysUntilExam} 天，继续加油！`
                  : "今天也要加油学习哦！"}
              </p>
            </div>

            {/* 统计卡片 */}
            <div className="flex gap-4">
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 min-w-[100px] text-center border border-white/20">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Flame className="h-5 w-5 text-orange-300" />
                  <span className="text-3xl font-bold text-white stat-number">
                    {userStats?.streakDays || 0}
                  </span>
                </div>
                <p className="text-sm text-white/70">连胜天数</p>
              </div>
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 min-w-[100px] text-center border border-white/20">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Star className="h-5 w-5 text-amber-300" />
                  <span className="text-3xl font-bold text-white stat-number">
                    {userStats?.totalXp || 0}
                  </span>
                </div>
                <p className="text-sm text-white/70">经验值</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 冲刺模式提示 */}
      {isSprintMode && (
        <Card className="border-orange-300 bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 animate-pulse-subtle overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-full animate-bounce">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-orange-800">
                      🔥 考前冲刺模式已开启
                    </h3>
                    <Badge variant="destructive" className="animate-pulse">
                      倒计时 {daysUntilExam} 天
                    </Badge>
                  </div>
                  <p className="text-orange-700">
                    建议每天完成模拟考试 + 复习错题，保持最佳状态迎接考试！
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-orange-600 hover:bg-orange-700 shadow-lg"
                  asChild
                >
                  <Link href="/mock-exam">
                    <Play className="h-4 w-4 mr-2" />
                    模拟考试
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 今日任务 */}
        <div className="lg:col-span-2 animate-slide-up stagger-1" style={{ opacity: 0 }}>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">今日任务</h2>
                    <p className="text-sm text-muted-foreground">
                      完成任务获取经验值
                    </p>
                  </div>
                </div>
                {dailyTask && (
                  <div className="text-right">
                    <p className="text-2xl font-bold gradient-text">
                      {dailyTask.completedXp}/{dailyTask.totalXp}
                      <span className="text-sm font-normal text-muted-foreground ml-1">XP</span>
                    </p>
                    <div className="w-32 mt-2">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {dailyTask?.tasks && dailyTask.tasks.length > 0 ? (
                <div className="space-y-4">
                  {/* 进度提示 */}
                  {dailyTask.tasks.length > 0 && (
                    <div className={`p-3 rounded-xl ${
                      dailyTask.isCompleted
                        ? "bg-green-50 border border-green-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {dailyTask.isCompleted ? (
                            <>
                              <span className="text-2xl">🎉</span>
                              <span className="font-medium text-green-700">
                                今日任务全部完成！连胜 +1
                              </span>
                              <VibeQuickButton
                                contentType="learn"
                                rawInput={`今日学习任务全部完成！完成 ${dailyTask.tasks.length} 个任务，获得 ${dailyTask.completedXp} XP，连胜 ${userStats?.streakDays || 0} 天！`}
                                label="分享打卡"
                                variant="outline"
                                size="sm"
                              />
                            </>
                          ) : (
                            <>
                              <span className="text-xl">💪</span>
                              <span className="font-medium text-blue-700">
                                已完成 {dailyTask.tasks.filter((t) => t.completed).length}/{dailyTask.tasks.length}，
                                再完成 {dailyTask.tasks.filter((t) => !t.completed).length} 个即可保持连胜！
                              </span>
                            </>
                          )}
                        </div>
                        {!dailyTask.isCompleted && (
                          <span className="text-sm text-amber-600 font-medium">
                            +{dailyTask.totalXp - dailyTask.completedXp} XP 待领取
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                  {dailyTask.tasks.map((task, index) => (
                    <div
                      key={index}
                      className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                        task.completed
                          ? "bg-success/5 border border-success/20"
                          : "glass-card-hover border border-border/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            task.completed
                              ? "bg-success/10"
                              : task.type === "learn"
                              ? "bg-blue-500/10"
                              : "bg-purple-500/10"
                          }`}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : task.type === "learn" ? (
                            <BookOpen className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Code className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              task.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.type === "learn" ? "知识点学习" : "编程练习"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Zap className="h-4 w-4" />
                          <span className="text-sm font-semibold">+{task.xpReward}</span>
                        </div>
                        {!task.completed && (
                          <Button
                            size="sm"
                            className="btn-glow rounded-lg"
                            asChild
                          >
                            <Link
                              href={
                                task.type === "learn"
                                  ? `/learn/${task.targetId}`
                                  : `/problem/${task.targetId}`
                              }
                            >
                              开始
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary/50" />
                  </div>
                  <p className="text-muted-foreground mb-4">今日任务正在生成中...</p>
                  <Button className="btn-glow rounded-xl" asChild>
                    <Link href="/learn/recursion">
                      <Sparkles className="mr-2 h-4 w-4" />
                      开始学习
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 考试倒计时 */}
          {daysUntilExam !== null && daysUntilExam > 0 && (
            <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-2" style={{ opacity: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">考试倒计时</h3>
              </div>
              <div className="text-center py-4">
                <div className="relative inline-block">
                  <span className="text-6xl font-bold gradient-text stat-number">
                    {daysUntilExam}
                  </span>
                  <span className="absolute -right-6 top-2 text-lg text-muted-foreground">天</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  GESP {userStats?.targetLevel} 级考试
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">目标进度</span>
                  <span className="font-medium">
                    {Math.round((1 - daysUntilExam / 45) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((1 - daysUntilExam / 45) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 今日专注 */}
          <FocusReportCard range="today" compact />

          {/* 徽章展示 */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-3" style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="font-semibold">我的徽章</h3>
            </div>
            {userStats?.badges && userStats.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userStats.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-2xl hover-lift cursor-pointer"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="flex justify-center gap-2 mb-3">
                  {["🌟", "🏆", "💎"].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-xl opacity-30"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  完成学习任务获取徽章
                </p>
              </div>
            )}
          </div>

          {/* 快速入口 */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-4" style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">快速入口</h3>
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 rounded-xl hover:bg-primary/5 group"
                asChild
              >
                <Link href="/map">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3 group-hover:bg-blue-500/20 transition-colors">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                  </div>
                  知识点
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 rounded-xl hover:bg-primary/5 group"
                asChild
              >
                <Link href="/problem">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3 group-hover:bg-purple-500/20 transition-colors">
                    <Code className="h-4 w-4 text-purple-500" />
                  </div>
                  题库练习
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 rounded-xl hover:bg-primary/5 group"
                asChild
              >
                <Link href="/mock-exam">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mr-3 group-hover:bg-amber-500/20 transition-colors">
                    <Trophy className="h-4 w-4 text-amber-500" />
                  </div>
                  模拟考试
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 rounded-xl hover:bg-primary/5 group"
                asChild
              >
                <Link href="/import">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3 group-hover:bg-emerald-500/20 transition-colors">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                  </div>
                  导入数据
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 庆祝动画 */}
      <Celebration
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
        duration={3000}
        particleCount={80}
      />

      {/* 任务完成提示 */}
      <TaskCompletionToast
        show={showCompletionToast}
        completedCount={dailyTask?.tasks?.filter((t) => t.completed).length || 0}
        totalCount={dailyTask?.tasks?.length || 0}
        xpEarned={dailyTask?.completedXp || 0}
        streakDays={userStats?.streakDays || 0}
        isAllCompleted={dailyTask?.isCompleted || false}
        onClose={() => setShowCompletionToast(false)}
      />
    </div>
  );
}

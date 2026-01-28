"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Flame,
  Star,
  Trophy,
  Calendar,
  Target,
  Code,
  BookOpen,
  Clock
} from "lucide-react";

// 徽章数据
const badgesList = [
  { code: "first_ac", name: "首次通过", icon: "🎯", description: "第一次 AC 题目", earned: false },
  { code: "streak_7", name: "连胜一周", icon: "🔥", description: "连续学习 7 天", earned: false },
  { code: "streak_30", name: "月度坚持", icon: "💪", description: "连续学习 30 天", earned: false },
  { code: "problem_10", name: "小试牛刀", icon: "⚔️", description: "完成 10 道题目", earned: false },
  { code: "problem_50", name: "渐入佳境", icon: "🚀", description: "完成 50 道题目", earned: false },
  { code: "level_up", name: "突破自我", icon: "⬆️", description: "升级成功", earned: false },
  { code: "perfect", name: "完美表现", icon: "✨", description: "一次性 AC", earned: false },
];

export default function ProfilePage() {
  const { data: session } = useSession();

  // 模拟用户数据
  const userStats = {
    streakDays: 0,
    totalXp: 0,
    targetLevel: 5,
    examDate: "2026-03-14",
    problemsSolved: 0,
    totalSubmissions: 0,
    studyTime: 0,
    joinDate: new Date().toISOString(),
  };

  const earnedBadges = badgesList.filter(b => b.earned);
  const lockedBadges = badgesList.filter(b => !b.earned);

  return (
    <div className="space-y-6">
      {/* 用户信息卡片 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {session?.user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{session?.user?.username}</h1>
                <p className="text-muted-foreground">{session?.user?.email || "未设置邮箱"}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-orange-500">
                    <Flame className="h-4 w-4" />
                    <span className="font-medium">{userStats.streakDays} 天连胜</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="h-4 w-4" />
                    <span className="font-medium">{userStats.totalXp} XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-1">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">GESP {userStats.targetLevel} 级</span>
              </div>
              <p className="text-sm text-muted-foreground">
                考试日期：{userStats.examDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 统计数据 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{userStats.problemsSolved}</p>
            <p className="text-sm text-muted-foreground">已解决题目</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{userStats.totalSubmissions}</p>
            <p className="text-sm text-muted-foreground">提交次数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{userStats.studyTime}</p>
            <p className="text-sm text-muted-foreground">学习时长（分钟）</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{userStats.streakDays}</p>
            <p className="text-sm text-muted-foreground">最长连胜</p>
          </CardContent>
        </Card>
      </div>

      {/* 徽章墙 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>徽章墙</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnedBadges.length > 0 ? (
            <>
              <h4 className="font-medium mb-3">已获得徽章</h4>
              <div className="flex flex-wrap gap-4 mb-6">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.code}
                    className="flex flex-col items-center p-3 rounded-lg bg-yellow-50 border border-yellow-200 badge-earned"
                  >
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <span className="text-sm font-medium">{badge.name}</span>
                    <span className="text-xs text-muted-foreground">{badge.description}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground mb-6">
              <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>还没有获得徽章</p>
              <p className="text-sm">完成学习任务即可获得徽章</p>
            </div>
          )}

          <h4 className="font-medium mb-3 text-muted-foreground">未解锁徽章</h4>
          <div className="flex flex-wrap gap-4">
            {lockedBadges.map((badge) => (
              <div
                key={badge.code}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50 border border-gray-200 opacity-60"
              >
                <span className="text-3xl mb-1 grayscale">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.name}</span>
                <span className="text-xs text-muted-foreground">{badge.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 学习进度 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>学习进度</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">GESP 5 级知识点</span>
                <span className="text-sm text-muted-foreground">0/6</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">GESP 4 级知识点</span>
                <span className="text-sm text-muted-foreground">0/3</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">练习题完成度</span>
                <span className="text-sm text-muted-foreground">0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  Clock,
  Loader2
} from "lucide-react";

const badgesList = [
  { code: "first_ac", name: "首次通过", icon: "🎯", description: "第一次 AC 题目" },
  { code: "streak_7", name: "连胜一周", icon: "🔥", description: "连续学习 7 天" },
  { code: "streak_30", name: "月度坚持", icon: "💪", description: "连续学习 30 天" },
  { code: "problem_10", name: "小试牛刀", icon: "⚔️", description: "完成 10 道题目" },
  { code: "problem_50", name: "渐入佳境", icon: "🚀", description: "完成 50 道题目" },
  { code: "level_up", name: "突破自我", icon: "⬆️", description: "升级成功" },
  { code: "perfect", name: "完美表现", icon: "✨", description: "一次性 AC" },
];

interface UserStats {
  streakDays: number;
  totalXp: number;
  targetLevel: number;
  examDate: string | null;
  badges: string[];
  problemsSolved: number;
  totalSubmissions: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const earnedBadgeCodes = new Set(stats?.badges || []);
  const earnedBadges = badgesList.filter(b => earnedBadgeCodes.has(b.code));
  const lockedBadges = badgesList.filter(b => !earnedBadgeCodes.has(b.code));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                    <span className="font-medium">{stats?.streakDays ?? 0} 天连胜</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="h-4 w-4" />
                    <span className="font-medium">{stats?.totalXp ?? 0} XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-1">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">GESP {stats?.targetLevel ?? "?"} 级</span>
              </div>
              {stats?.examDate && (
                <p className="text-sm text-muted-foreground">
                  考试日期：{new Date(stats.examDate).toLocaleDateString("zh-CN")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 统计数据 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats?.problemsSolved ?? 0}</p>
            <p className="text-sm text-muted-foreground">已解决题目</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{stats?.totalSubmissions ?? 0}</p>
            <p className="text-sm text-muted-foreground">提交次数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{stats?.totalXp ?? 0}</p>
            <p className="text-sm text-muted-foreground">经验值 XP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{stats?.streakDays ?? 0}</p>
            <p className="text-sm text-muted-foreground">连胜天数</p>
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
                    className="flex flex-col items-center p-3 rounded-lg bg-amber-50 border border-amber-200 badge-earned"
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
                className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-border opacity-60"
              >
                <span className="text-3xl mb-1 grayscale">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.name}</span>
                <span className="text-xs text-muted-foreground">{badge.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

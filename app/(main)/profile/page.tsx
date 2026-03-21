"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Target,
  Code,
  BookOpen,
  Loader2
} from "lucide-react";

interface UserStats {
  targetLevel: number;
  examDate: string | null;
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
      <div className="grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}

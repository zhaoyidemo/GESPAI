"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, ArrowRight, User, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "登录失败",
          description: result.error,
        });
      } else {
        toast({
          title: "登录成功",
          description: "欢迎回来！",
        });
        router.push("/");
        router.refresh();
      }
    } catch {
      toast({
        variant: "destructive",
        title: "登录失败",
        description: "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-slate-950 dark:via-indigo-950/50 dark:to-slate-900" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-radial from-violet-400/30 via-violet-400/10 to-transparent dark:from-violet-600/20 dark:via-violet-600/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-radial from-blue-400/30 via-blue-400/10 to-transparent dark:from-blue-600/20 dark:via-blue-600/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-indigo-400/20 via-indigo-400/5 to-transparent dark:from-indigo-500/15 dark:via-indigo-500/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25 animate-float">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl opacity-30 blur-xl -z-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            欢迎回到 <span className="gradient-text">GESP AI</span>
          </h1>
          <p className="text-muted-foreground">
            登录你的账号继续学习
          </p>
        </div>

        {/* 登录表单 */}
        <div className="glass-card rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                用户名
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-medium btn-glow"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  登录中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  登录
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              还没有账号？{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                立即注册
              </Link>
            </p>
          </div>
        </div>

        {/* 底部装饰 */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          GESP AI - 智能编程考试备考助手
        </p>
      </div>
    </div>
  );
}

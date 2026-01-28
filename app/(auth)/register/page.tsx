"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, ArrowRight, User, Mail, Lock, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "注册失败",
        description: "两次输入的密码不一致",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "注册失败");
      }

      toast({
        title: "注册成功",
        description: "请登录你的账号",
      });

      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "注册失败",
        description: error instanceof Error ? error.message : "请稍后重试",
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
            创建 <span className="gradient-text">GESP AI</span> 账号
          </h1>
          <p className="text-muted-foreground">
            开始你的编程学习之旅
          </p>
        </div>

        {/* 注册表单 */}
        <div className="glass-card rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                用户名 <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="3-20个字符，字母、数字、下划线"
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
              <Label htmlFor="email" className="text-sm font-medium">
                邮箱 <span className="text-muted-foreground text-xs">（选填）</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="用于找回密码"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                密码 <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="至少6个字符"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                确认密码 <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Check className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
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
                  注册中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  创建账号
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              已有账号？{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                立即登录
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

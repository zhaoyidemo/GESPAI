"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, RotateCcw, Save, Loader2, Eye } from "lucide-react";
import Link from "next/link";

export default function AIConfigPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [prompt, setPrompt] = useState("");
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // 加载配置
  useEffect(() => {
    if (status === "authenticated") {
      loadConfig();
    }
  }, [status]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/ai-config");
      const data = await res.json();

      if (res.ok) {
        setPrompt(data.debugPrompt);
        setOriginalPrompt(data.debugPrompt);
        setIsCustom(data.isCustom);
      } else {
        toast({
          title: "加载失败",
          description: data.error || "无法加载配置",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "加载失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/user/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debugPrompt: prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setOriginalPrompt(prompt);
        setIsCustom(true);
        toast({
          title: "保存成功",
          description: "AI助手配置已更新",
        });
      } else {
        toast({
          title: "保存失败",
          description: data.error || "保存失败，请重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "保存失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("确定要恢复默认配置吗？当前的自定义配置将丢失。")) {
      return;
    }

    try {
      setResetting(true);
      const res = await fetch("/api/user/ai-config/reset", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setPrompt(data.debugPrompt);
        setOriginalPrompt(data.debugPrompt);
        setIsCustom(false);
        toast({
          title: "已恢复默认",
          description: "AI助手配置已恢复为系统默认",
        });
      } else {
        toast({
          title: "重置失败",
          description: data.error || "重置失败，请重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "重置失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
    }
  };

  const hasChanges = prompt !== originalPrompt;

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground mb-4">请先登录</p>
          <Link href="/login">
            <Button>前往登录</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 返回链接 */}
      <div>
        <Link
          href="/profile"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 返回个人中心
        </Link>
      </div>

      {/* 配置卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <CardTitle>AI 调试助手提示词配置</CardTitle>
          </div>
          <CardDescription>
            自定义AI助手的教学风格和提示方式。这个提示词将决定AI如何帮助你调试代码。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 状态提示 */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
            <span className="text-muted-foreground">
              当前使用：
              <span className="font-medium text-foreground ml-1">
                {isCustom ? "自定义配置" : "系统默认配置"}
              </span>
            </span>
            {hasChanges && (
              <span className="text-orange-500 text-xs">● 有未保存的更改</span>
            )}
          </div>

          {/* 提示词编辑器 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">系统提示词</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="输入AI助手的系统提示词..."
            />
            <p className="text-xs text-muted-foreground">
              字数：{prompt.length} / 10,000
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存配置
                </>
              )}
            </Button>

            <Button
              onClick={handleReset}
              disabled={resetting}
              variant="outline"
            >
              {resetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  重置中...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  恢复默认
                </>
              )}
            </Button>
          </div>

          {/* 提示信息 */}
          <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              提示词说明
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 提示词决定了AI的角色、教学风格和帮助程度</li>
              <li>• 修改后立即生效，下次请求AI帮助时使用新配置</li>
              <li>• 建议包含：角色定位、教学原则、渐进策略、回复要求</li>
              <li>• 可以随时恢复为系统默认配置</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

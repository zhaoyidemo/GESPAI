"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, RotateCcw, Save, Loader2, Eye, GraduationCap, Code, Bug, MessageCircle } from "lucide-react";
import Link from "next/link";
import { PromptType, PROMPT_LABELS, PROMPT_DESCRIPTIONS } from "@/lib/default-prompts";

// Tab 图标
const PROMPT_ICONS: Record<PromptType, React.ReactNode> = {
  tutor: <GraduationCap className="h-4 w-4" />,
  problem: <Code className="h-4 w-4" />,
  debug: <Bug className="h-4 w-4" />,
  feynman: <MessageCircle className="h-4 w-4" />,
};

interface PromptConfig {
  value: string;
  isCustom: boolean;
}

type PromptsState = Record<PromptType, PromptConfig>;

export default function AIConfigPage() {
  const { status } = useSession();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<PromptType>("tutor");
  const [prompts, setPrompts] = useState<PromptsState | null>(null);
  const [editedPrompts, setEditedPrompts] = useState<Record<PromptType, string>>({
    tutor: "",
    problem: "",
    debug: "",
    feynman: "",
  });
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
        setPrompts(data.prompts);
        // 初始化编辑状态
        setEditedPrompts({
          tutor: data.prompts.tutor.value,
          problem: data.prompts.problem.value,
          debug: data.prompts.debug.value,
          feynman: data.prompts.feynman.value,
        });
      } else {
        toast({
          title: "加载失败",
          description: data.error || "无法加载配置",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "加载失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (type: PromptType) => {
    try {
      setSaving(true);
      const res = await fetch("/api/user/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt: editedPrompts[type] }),
      });

      const data = await res.json();

      if (res.ok) {
        // 更新状态
        setPrompts((prev) => prev ? {
          ...prev,
          [type]: { value: editedPrompts[type], isCustom: true },
        } : null);
        toast({
          title: "保存成功",
          description: `${PROMPT_LABELS[type]}配置已更新`,
        });
      } else {
        toast({
          title: "保存失败",
          description: data.error || "保存失败，请重试",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "保存失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (type: PromptType) => {
    if (!confirm(`确定要恢复${PROMPT_LABELS[type]}的默认配置吗？当前的自定义配置将丢失。`)) {
      return;
    }

    try {
      setResetting(true);
      const res = await fetch("/api/user/ai-config/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const data = await res.json();

      if (res.ok) {
        // 更新状态
        setPrompts((prev) => prev ? {
          ...prev,
          [type]: { value: data.prompt, isCustom: false },
        } : null);
        setEditedPrompts((prev) => ({
          ...prev,
          [type]: data.prompt,
        }));
        toast({
          title: "已恢复默认",
          description: `${PROMPT_LABELS[type]}配置已恢复为系统默认`,
        });
      } else {
        toast({
          title: "重置失败",
          description: data.error || "重置失败，请重试",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "重置失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
    }
  };

  const hasChanges = (type: PromptType) => {
    if (!prompts) return false;
    return editedPrompts[type] !== prompts[type].value;
  };

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
            <CardTitle>提示词配置</CardTitle>
          </div>
          <CardDescription>
            自定义不同场景下 AI 的角色设定和行为方式
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PromptType)}>
            <TabsList className="grid grid-cols-4 w-full mb-4">
              {(Object.keys(PROMPT_LABELS) as PromptType[]).map((type) => (
                <TabsTrigger key={type} value={type} className="flex items-center gap-2">
                  {PROMPT_ICONS[type]}
                  <span className="hidden sm:inline">{PROMPT_LABELS[type]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {(Object.keys(PROMPT_LABELS) as PromptType[]).map((type) => (
              <TabsContent key={type} value={type} className="space-y-4">
                {/* 说明 */}
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {PROMPT_DESCRIPTIONS[type]}
                  </p>
                </div>

                {/* 状态提示 */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
                  <span className="text-muted-foreground">
                    当前使用：
                    <span className="font-medium text-foreground ml-1">
                      {prompts?.[type].isCustom ? "自定义配置" : "系统默认配置"}
                    </span>
                  </span>
                  {hasChanges(type) && (
                    <span className="text-orange-500 text-xs">● 有未保存的更改</span>
                  )}
                </div>

                {/* 提示词编辑器 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">系统提示词</label>
                  <Textarea
                    value={editedPrompts[type]}
                    onChange={(e) => setEditedPrompts((prev) => ({
                      ...prev,
                      [type]: e.target.value,
                    }))}
                    className="min-h-[350px] font-mono text-sm"
                    placeholder="输入AI的系统提示词..."
                  />
                  <p className="text-xs text-muted-foreground">
                    字数：{editedPrompts[type].length} / 10,000
                  </p>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSave(type)}
                    disabled={!hasChanges(type) || saving}
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
                    onClick={() => handleReset(type)}
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
              </TabsContent>
            ))}
          </Tabs>

          {/* 提示信息 */}
          <div className="mt-6 space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              提示词说明
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 提示词决定了 AI 的角色、教学风格和交互方式</li>
              <li>• 修改后立即生效，下次使用相应功能时采用新配置</li>
              <li>• 建议包含：角色定位、行为原则、回复要求</li>
              <li>• 可以随时恢复为系统默认配置</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

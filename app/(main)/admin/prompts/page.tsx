"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Save,
  RotateCcw,
  GitCompare,
  Database,
  MessageSquare,
  Bug,
  Wrench,
  Loader2,
} from "lucide-react";

interface PromptItem {
  key: string;
  category: string;
  name: string;
  description: string;
  content: string;
  isActive: boolean;
  isModified: boolean;
  inDatabase: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
}

interface PromptData {
  prompts: PromptItem[];
  grouped: Record<string, PromptItem[]>;
  categoryLabels: Record<string, string>;
  totalCount: number;
  dbCount: number;
}

const CATEGORY_ICONS: Record<string, typeof MessageSquare> = {
  core: MessageSquare,
  "error-diagnosis": Bug,
  tool: Wrench,
};

export default function AdminPromptsPage() {
  const [data, setData] = useState<PromptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [compareKey, setCompareKey] = useState<string | null>(null);
  const [compareDefault, setCompareDefault] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/prompts");
      if (!res.ok) throw new Error("获取失败");
      const json = await res.json();
      setData(json);
    } catch {
      setMessage({ type: "error", text: "获取提示词列表失败" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleExpand = (prompt: PromptItem) => {
    if (expandedKey === prompt.key) {
      setExpandedKey(null);
    } else {
      setExpandedKey(prompt.key);
      setEditContent(prompt.content);
    }
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/prompts/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessage({ type: "success", text: "保存成功" });
      await fetchData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "保存失败" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (key: string) => {
    if (!confirm("确定要恢复默认值吗？当前修改将丢失。")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/prompts/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToDefault: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setEditContent(json.content);
      setMessage({ type: "success", text: "已恢复默认值" });
      await fetchData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "恢复失败" });
    } finally {
      setSaving(false);
    }
  };

  const handleCompare = async (key: string) => {
    try {
      const res = await fetch(`/api/admin/prompts/${key}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCompareDefault(json.defaultContent);
      setCompareKey(key);
    } catch {
      setMessage({ type: "error", text: "获取默认值失败" });
    }
  };

  const handleSeed = async () => {
    if (!confirm("将迁移旧 key 并同步 15 个提示词到数据库。已有提示词内容不会被覆盖。继续？")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/prompts/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessage({ type: "success", text: json.message });
      await fetchData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "初始化失败" });
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container-responsive py-8">
        <p className="text-muted-foreground">加载失败，请刷新页面重试。</p>
      </div>
    );
  }

  const categories = ["core", "error-diagnosis", "tool"];

  return (
    <div className="container-responsive py-8 space-y-6">
      {/* 顶部标题区 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">提示词管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统中 {data.totalCount} 个 AI 提示词，支持在线编辑和恢复默认值。
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            数据库已有 {data.dbCount}/{data.totalCount} 条记录
          </p>
        </div>
        <Button onClick={handleSeed} disabled={seeding} variant="outline">
          {seeding ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Database className="mr-2 h-4 w-4" />
          )}
          同步到数据库
        </Button>
      </div>

      {/* 消息提示 */}
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-500/10 text-green-600 border border-green-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 对比对话框 */}
      <Dialog open={!!compareKey} onOpenChange={() => setCompareKey(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>对比默认值</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-medium text-sm mb-2 text-muted-foreground">当前值</h3>
              <pre className="bg-secondary/50 p-4 rounded-lg text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                {expandedKey && compareKey === expandedKey ? editContent : ""}
              </pre>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-2 text-muted-foreground">硬编码默认值</h3>
              <pre className="bg-secondary/50 p-4 rounded-lg text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                {compareDefault}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabs 分类 */}
      <Tabs defaultValue="core">
        <TabsList className="grid w-full grid-cols-3">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Wrench;
            const count = data.grouped[cat]?.length || 0;
            return (
              <TabsTrigger key={cat} value={cat} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{data.categoryLabels[cat]}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="space-y-4 mt-4">
            {(data.grouped[cat] || []).map((prompt) => (
              <Card key={prompt.key} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-secondary/30 transition-colors"
                  onClick={() => handleExpand(prompt)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">{prompt.name}</CardTitle>
                      <code className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {prompt.key}
                      </code>
                      {prompt.isModified && (
                        <Badge variant="default" className="text-xs">
                          已修改
                        </Badge>
                      )}
                      {!prompt.inDatabase && (
                        <Badge variant="outline" className="text-xs">
                          仅硬编码
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {prompt.content.length} 字
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {prompt.description}
                  </p>
                </CardHeader>

                {expandedKey === prompt.key && (
                  <CardContent className="border-t pt-4 space-y-4">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                      placeholder="输入提示词内容..."
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {editContent.length} 字符
                        {prompt.updatedAt && (
                          <>
                            {" | "}最后更新：{new Date(prompt.updatedAt).toLocaleString("zh-CN")}
                          </>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompare(prompt.key)}
                        >
                          <GitCompare className="mr-1 h-4 w-4" />
                          对比默认
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReset(prompt.key)}
                          disabled={saving}
                        >
                          <RotateCcw className="mr-1 h-4 w-4" />
                          恢复默认
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSave(prompt.key)}
                          disabled={saving}
                        >
                          {saving ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-1 h-4 w-4" />
                          )}
                          保存
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

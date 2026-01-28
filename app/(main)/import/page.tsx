"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Link as LinkIcon, MessageSquare, Loader2, CheckCircle } from "lucide-react";

export default function ImportPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [luoguUrl, setLuoguUrl] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [importResult, setImportResult] = useState<{
    type: string;
    data: Record<string, unknown>;
  } | null>(null);

  const handleLuoguImport = async () => {
    if (!luoguUrl) {
      toast({
        variant: "destructive",
        title: "请输入洛谷主页链接",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/import/luogu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: luoguUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setImportResult({ type: "luogu", data });
        toast({
          title: "导入成功",
          description: `已导入 ${data.problemCount || 0} 道题目记录`,
        });
      } else {
        throw new Error(data.error || "导入失败");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "导入失败",
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeImport = async () => {
    if (!codeInput) {
      toast({
        variant: "destructive",
        title: "请粘贴代码",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/import/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      });

      const data = await response.json();

      if (response.ok) {
        setImportResult({ type: "code", data });
        toast({
          title: "分析成功",
          description: "AI 已分析你的代码",
        });
      } else {
        throw new Error(data.error || "分析失败");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "分析失败",
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Upload className="h-6 w-6" />
          <span>导入数据</span>
        </h1>
        <p className="text-muted-foreground">
          导入你的学习记录，让 AI 更了解你的水平
        </p>
      </div>

      {/* 导入方式 */}
      <Tabs defaultValue="luogu">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="luogu">
            <LinkIcon className="h-4 w-4 mr-2" />
            洛谷数据
          </TabsTrigger>
          <TabsTrigger value="code">
            <Upload className="h-4 w-4 mr-2" />
            粘贴代码
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            对话采集
          </TabsTrigger>
        </TabsList>

        {/* 洛谷导入 */}
        <TabsContent value="luogu">
          <Card>
            <CardHeader>
              <CardTitle>导入洛谷做题记录</CardTitle>
              <CardDescription>
                输入你的洛谷个人主页链接，我们将分析你的做题记录
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>洛谷主页链接</Label>
                <Input
                  placeholder="https://www.luogu.com.cn/user/xxxxx"
                  value={luoguUrl}
                  onChange={(e) => setLuoguUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  请确保你的洛谷资料是公开的
                </p>
              </div>
              <Button onClick={handleLuoguImport} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    导入中...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    开始导入
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 代码粘贴 */}
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>粘贴代码分析</CardTitle>
              <CardDescription>
                粘贴你之前写的代码，AI 将分析你的编程水平
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>代码内容</Label>
                <textarea
                  className="w-full h-48 p-3 rounded-md border border-input bg-background font-mono text-sm"
                  placeholder="// 在这里粘贴你的 C++ 代码"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                />
              </div>
              <Button onClick={handleCodeImport} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    分析代码
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 对话采集 */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>对话式信息采集</CardTitle>
              <CardDescription>
                通过对话告诉 AI 你的学习情况
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  AI 将通过对话了解你的学习背景
                </p>
                <Button>开始对话</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 导入结果 */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>导入结果</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {importResult.type === "luogu" && (
              <div className="space-y-2">
                <p>已成功导入洛谷数据</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm">
                    {JSON.stringify(importResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            {importResult.type === "code" && (
              <div className="space-y-2">
                <p>代码分析结果</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(importResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

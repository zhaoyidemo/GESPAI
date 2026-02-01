"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Copy,
  Upload,
  Loader2,
  Terminal,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportResult {
  problemId: string;
  action: string;
  title?: string;
  error?: string;
}

export default function ImportPage() {
  const [selectedLevel, setSelectedLevel] = useState("5");
  const [jsonData, setJsonData] = useState("");
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    created: number;
    updated: number;
    errors: number;
  } | null>(null);
  const [scriptCopied, setScriptCopied] = useState(false);

  // GESP 题目 ID 列表
  const problemLists: Record<string, string[]> = {
    "4": [
      "B3921", "B3922", "B3861", "B3862", "B3899", "B3900",
      "B3955", "B3956", "P10696", "P10697", "B4029", "B4030",
      "B4056", "B4057", "P11929", "P11930", "P12977", "P12978",
      "P14038", "P14039", "P14881", "P14882"
    ],
    "5": [
      "B3941", "B3951", "B3871", "B3872", "B3929", "B3930",
      "B3968", "B3969", "P10719", "P10720", "B4050", "B4051",
      "B4070", "B4071", "P11960", "P11961", "P13013", "P13014",
      "P14073", "P14074", "P14917", "P14918"
    ],
    "6": [
      "B3924", "B3923", "B3880", "B3879", "B3912", "B3911",
      "B3982", "B3981", "P10724", "P10723", "B4040", "B4039",
      "B4085", "B4084", "P11993", "P11992", "P13048", "P13047",
      "P14108", "P14107", "P14952", "P14951"
    ],
  };

  // 生成浏览器脚本
  const generateScript = () => {
    const problemIds = problemLists[selectedLevel] || [];
    return `// GESP AI 洛谷题目同步脚本 - ${selectedLevel} 级
// 在洛谷任意页面的 Console 中运行此脚本

(async function() {
  const problemIds = ${JSON.stringify(problemIds)};
  const level = ${selectedLevel};
  const results = [];
  const errors = [];

  console.log('开始获取 GESP ' + level + ' 级题目数据...');
  console.log('共 ' + problemIds.length + ' 道题目');

  for (let i = 0; i < problemIds.length; i++) {
    const pid = problemIds[i];
    console.log('正在获取 [' + (i+1) + '/' + problemIds.length + ']: ' + pid);

    try {
      const response = await fetch('/problem/' + pid + '?_contentOnly=1');
      const data = await response.json();

      if (data.code === 200 && data.currentData && data.currentData.problem) {
        results.push(data.currentData.problem);
        console.log('✓ ' + pid + ': ' + data.currentData.problem.title);
      } else {
        errors.push({ pid, error: '获取失败' });
        console.error('✗ ' + pid + ': 获取失败');
      }
    } catch (e) {
      errors.push({ pid, error: e.message });
      console.error('✗ ' + pid + ': ' + e.message);
    }

    // 添加延迟避免请求过快
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\\n========== 完成 ==========');
  console.log('成功: ' + results.length + ' / ' + problemIds.length);
  if (errors.length > 0) {
    console.log('失败: ' + errors.length);
    console.log('失败的题目:', errors);
  }

  // 生成导入数据
  const importData = JSON.stringify({ level, problems: results });

  console.log('\\n复制以下数据到 GESP AI 管理后台:');
  console.log('='.repeat(50));

  // 尝试复制到剪贴板
  try {
    await navigator.clipboard.writeText(importData);
    console.log('\\n✓ 数据已自动复制到剪贴板！');
    console.log('请到 GESP AI 管理后台粘贴导入');
  } catch (e) {
    console.log(importData);
    console.log('='.repeat(50));
    console.log('\\n无法自动复制，请手动选择上方数据复制');
  }

  return { success: results.length, failed: errors.length };
})();`;
  };

  // 复制脚本到剪贴板
  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(generateScript());
      setScriptCopied(true);
      setTimeout(() => setScriptCopied(false), 2000);
    } catch (e) {
      console.error("复制失败:", e);
    }
  };

  // 导入数据
  const handleImport = async () => {
    if (!jsonData.trim()) {
      return;
    }

    setImporting(true);
    setResults([]);
    setSummary(null);

    try {
      const parsed = JSON.parse(jsonData);
      const response = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results || []);
        setSummary(data.summary);
      } else {
        setResults([{ problemId: "-", action: "error", error: data.error }]);
      }
    } catch (e) {
      setResults([{ problemId: "-", action: "error", error: String(e) }]);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">从洛谷导入题目</h1>
        <p className="text-muted-foreground mt-1">
          使用浏览器脚本获取洛谷原始数据，确保题目内容 100% 一致
        </p>
      </div>

      {/* 级别选择 */}
      <div className="flex items-center gap-4">
        <span className="font-medium">选择级别：</span>
        <Tabs value={selectedLevel} onValueChange={setSelectedLevel}>
          <TabsList>
            <TabsTrigger value="4">4 级</TabsTrigger>
            <TabsTrigger value="5">5 级</TabsTrigger>
            <TabsTrigger value="6">6 级</TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="text-sm text-muted-foreground">
          ({problemLists[selectedLevel]?.length || 0} 道题目)
        </span>
      </div>

      {/* 步骤说明 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 步骤 1: 获取脚本 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="w-6 h-6 rounded-full flex items-center justify-center p-0">
                1
              </Badge>
              获取洛谷数据
            </CardTitle>
            <CardDescription>
              在洛谷网站的浏览器控制台中运行脚本
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">
                1. 打开{" "}
                <a
                  href="https://www.luogu.com.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  洛谷 <ExternalLink className="w-3 h-3" />
                </a>
                {" "}并登录账号
              </p>
              <p className="text-sm">
                2. 按 <kbd className="px-1 py-0.5 bg-muted rounded text-xs">F12</kbd> 打开开发者工具
              </p>
              <p className="text-sm">
                3. 切换到 <strong>Console</strong> 标签页
              </p>
              <p className="text-sm">
                4. 点击下方按钮复制脚本，然后粘贴运行
              </p>
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={copyScript}
            >
              {scriptCopied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                  已复制！
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  复制 {selectedLevel} 级同步脚本
                </>
              )}
            </Button>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>提示：</strong>如果提示需要输入 allow pasting，请按提示输入后再粘贴脚本。
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              脚本会自动获取 GESP {selectedLevel} 级的全部 {problemLists[selectedLevel]?.length || 0} 道题目，
              完成后数据会自动复制到剪贴板。
            </p>
          </CardContent>
        </Card>

        {/* 步骤 2: 导入数据 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="w-6 h-6 rounded-full flex items-center justify-center p-0">
                2
              </Badge>
              导入到 GESP AI
            </CardTitle>
            <CardDescription>
              将获取到的 JSON 数据粘贴到下方并导入
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder='粘贴从洛谷获取的 JSON 数据...

格式: {"level": 5, "problems": [...]}'
              className="min-h-[200px] font-mono text-sm"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
            />

            <Button
              className="w-full"
              onClick={handleImport}
              disabled={importing || !jsonData.trim()}
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  导入中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  开始导入
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 导入结果 */}
      {(summary || results.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              导入结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary && (
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-muted text-center">
                  <div className="text-2xl font-bold">{summary.total}</div>
                  <div className="text-sm text-muted-foreground">总计</div>
                </div>
                <div className="p-3 rounded-lg bg-success/10 text-center">
                  <div className="text-2xl font-bold text-success">{summary.created}</div>
                  <div className="text-sm text-muted-foreground">新增</div>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 text-center">
                  <div className="text-2xl font-bold text-primary">{summary.updated}</div>
                  <div className="text-sm text-muted-foreground">更新</div>
                </div>
                <div className="p-3 rounded-lg bg-destructive/10 text-center">
                  <div className="text-2xl font-bold text-destructive">{summary.errors}</div>
                  <div className="text-sm text-muted-foreground">失败</div>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded text-sm",
                    result.action === "created" && "bg-success/10",
                    result.action === "updated" && "bg-primary/10",
                    result.action === "error" && "bg-destructive/10"
                  )}
                >
                  {result.action === "created" && (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  )}
                  {result.action === "updated" && (
                    <RefreshCw className="w-4 h-4 text-primary" />
                  )}
                  {result.action === "error" && (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="font-mono">{result.problemId}</span>
                  {result.title && (
                    <span className="text-muted-foreground truncate">
                      {result.title}
                    </span>
                  )}
                  {result.error && (
                    <span className="text-destructive">{result.error}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

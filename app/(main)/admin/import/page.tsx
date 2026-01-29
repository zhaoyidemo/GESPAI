"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, Loader2, Database } from "lucide-react";

type ImportStatus = "pending" | "loading" | "success" | "error";

interface LevelStatus {
  level: number;
  status: ImportStatus;
  message?: string;
  count?: number;
}

export default function ImportPage() {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [levels, setLevels] = useState<LevelStatus[]>([
    { level: 1, status: "pending" },
    { level: 2, status: "pending" },
    { level: 3, status: "pending" },
    { level: 4, status: "pending" },
    { level: 5, status: "pending" },
    { level: 6, status: "pending" },
    { level: 7, status: "pending" },
    { level: 8, status: "pending" },
  ]);

  const importLevel = async (level: number) => {
    setLevels((prev) =>
      prev.map((l) => (l.level === level ? { ...l, status: "loading" } : l))
    );

    try {
      const response = await fetch(`/api/seed/gesp${level}`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setLevels((prev) =>
          prev.map((l) =>
            l.level === level
              ? {
                  ...l,
                  status: "success",
                  message: data.message,
                  count: data.count,
                }
              : l
          )
        );
      } else {
        throw new Error(data.error || "导入失败");
      }
    } catch (error) {
      setLevels((prev) =>
        prev.map((l) =>
          l.level === level
            ? {
                ...l,
                status: "error",
                message:
                  error instanceof Error ? error.message : "导入失败",
              }
            : l
        )
      );
    }
  };

  const importAll = async () => {
    setImporting(true);

    toast({
      title: "开始导入",
      description: "正在批量导入GESP 1-8级题库...",
    });

    for (let i = 1; i <= 8; i++) {
      await importLevel(i);
    }

    setImporting(false);

    const successCount = levels.filter((l) => l.status === "success").length;
    const errorCount = levels.filter((l) => l.status === "error").length;

    toast({
      title: "导入完成",
      description: `成功：${successCount}个级别，失败：${errorCount}个级别`,
      variant: successCount === 8 ? "default" : "destructive",
    });
  };

  const resetAll = () => {
    setLevels(
      levels.map((l) => ({ level: l.level, status: "pending" }))
    );
  };

  const getStatusIcon = (status: ImportStatus) => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Database className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">
              题库导入工具
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            GESP 1-8级完整题库批量导入
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button
            onClick={importAll}
            disabled={importing}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-6 text-lg"
          >
            {importing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                导入中...
              </>
            ) : (
              "一键导入全部"
            )}
          </Button>

          <Button
            onClick={resetAll}
            disabled={importing}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg"
          >
            重置状态
          </Button>
        </div>

        {/* Import Status List */}
        <div className="glass-card rounded-2xl p-6 space-y-3">
          {levels.map((level) => (
            <div
              key={level.level}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
            >
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {getStatusIcon(level.status)}
              </div>

              {/* Level Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-lg">
                    GESP {level.level}级
                  </span>
                  {level.count && (
                    <span className="text-sm text-slate-400">
                      ({level.count}道题)
                    </span>
                  )}
                </div>
                {level.message && (
                  <p className={`text-sm mt-1 ${
                    level.status === "error" ? "text-red-400" : "text-slate-400"
                  }`}>
                    {level.message}
                  </p>
                )}
              </div>

              {/* Individual Import Button */}
              <Button
                onClick={() => importLevel(level.level)}
                disabled={importing || level.status === "loading"}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                {level.status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : level.status === "success" ? (
                  "重新导入"
                ) : (
                  "导入"
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>提示：已存在的题目会被自动跳过，不会重复导入</p>
        </div>
      </div>
    </div>
  );
}

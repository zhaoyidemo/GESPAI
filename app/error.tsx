"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">页面出错了</h2>
        <p className="text-muted-foreground mb-6">
          很抱歉，页面加载时遇到了问题。请尝试刷新页面，如果问题持续存在，请联系管理员。
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset}>重试</Button>
          <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}

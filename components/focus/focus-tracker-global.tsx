"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useFocusTracker } from "@/hooks/use-focus-tracker";
import { Eye, EyeOff, LogOut } from "lucide-react";

function parsePageInfo(pathname: string): { pageType: string; pageId?: string } {
  const problemMatch = pathname.match(/^\/problem\/([^/]+)$/);
  if (problemMatch) return { pageType: "problem", pageId: problemMatch[1] };

  const tutorMatch = pathname.match(/^\/learn\/([^/]+)\/tutor$/);
  if (tutorMatch) return { pageType: "tutor", pageId: tutorMatch[1] };

  const feynmanMatch = pathname.match(/^\/learn\/([^/]+)\/feynman$/);
  if (feynmanMatch) return { pageType: "feynman", pageId: feynmanMatch[1] };

  const learnMatch = pathname.match(/^\/learn\/([^/]+)$/);
  if (learnMatch) return { pageType: "learn", pageId: learnMatch[1] };

  if (pathname.startsWith("/mock-exam")) return { pageType: "mock-exam" };
  if (pathname.startsWith("/error-book")) return { pageType: "error-book" };
  if (pathname.startsWith("/map")) return { pageType: "map" };
  if (pathname === "/dashboard") return { pageType: "dashboard" };
  if (pathname.startsWith("/vibe")) return { pageType: "vibe" };
  if (pathname.startsWith("/profile")) return { pageType: "profile" };

  return { pageType: "other" };
}

function formatDuration(seconds: number) {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}时${m.toString().padStart(2, "0")}分`;
  }
  if (m > 0) {
    return `${m}分${s.toString().padStart(2, "0")}秒`;
  }
  return `${s}秒`;
}

export function FocusTrackerGlobal() {
  const pathname = usePathname();
  const { pageType, pageId } = useMemo(() => parsePageInfo(pathname), [pathname]);

  const { isActive, focusSeconds, totalSeconds, blurCount } =
    useFocusTracker({ pageType, pageId });

  const distractSeconds = Math.max(0, totalSeconds - focusSeconds);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-border/50 p-4 min-w-[210px]">
        {/* 专注时长 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-green-700">
            {isActive ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
            ) : (
              <span className="inline-flex rounded-full h-2.5 w-2.5 bg-green-300" />
            )}
            <Eye className="h-3.5 w-3.5" />
            <span>专注</span>
          </div>
          <span className="font-mono font-bold text-green-700 tabular-nums text-sm">
            {formatDuration(focusSeconds)}
          </span>
        </div>

        {/* 分心时长 */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-2 text-sm text-red-600">
            {!isActive ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            ) : (
              <span className="inline-flex rounded-full h-2.5 w-2.5 bg-red-300" />
            )}
            <EyeOff className="h-3.5 w-3.5" />
            <span>分心</span>
          </div>
          <span className="font-mono font-bold text-red-600 tabular-nums text-sm">
            {formatDuration(distractSeconds)}
          </span>
        </div>

        {/* 分割线 + 切出次数 */}
        <div className="border-t border-border/40 mt-3 pt-2.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <LogOut className="h-3 w-3" />
              切出
            </span>
            <span className="font-medium">{blurCount} 次</span>
          </div>
        </div>
      </div>
    </div>
  );
}

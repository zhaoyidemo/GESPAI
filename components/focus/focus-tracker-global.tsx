"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useFocusTracker } from "@/hooks/use-focus-tracker";
import { FocusReminder } from "@/components/focus/focus-reminder";
import { Eye, EyeOff } from "lucide-react";
import { useFocusStore } from "@/stores/focus-store";

function parsePageInfo(pathname: string): { pageType: string; pageId?: string } {
  // /problem/[id]
  const problemMatch = pathname.match(/^\/problem\/([^/]+)$/);
  if (problemMatch) return { pageType: "problem", pageId: problemMatch[1] };

  // /learn/[topic]/tutor
  const tutorMatch = pathname.match(/^\/learn\/([^/]+)\/tutor$/);
  if (tutorMatch) return { pageType: "tutor", pageId: tutorMatch[1] };

  // /learn/[topic]/feynman
  const feynmanMatch = pathname.match(/^\/learn\/([^/]+)\/feynman$/);
  if (feynmanMatch) return { pageType: "feynman", pageId: feynmanMatch[1] };

  // /learn/[topic]
  const learnMatch = pathname.match(/^\/learn\/([^/]+)$/);
  if (learnMatch) return { pageType: "learn", pageId: learnMatch[1] };

  // /mock-exam
  if (pathname.startsWith("/mock-exam")) return { pageType: "mock-exam" };

  // /error-book
  if (pathname.startsWith("/error-book")) return { pageType: "error-book" };

  // /map
  if (pathname.startsWith("/map")) return { pageType: "map" };

  // /dashboard
  if (pathname === "/dashboard") return { pageType: "dashboard" };

  // /vibe
  if (pathname.startsWith("/vibe")) return { pageType: "vibe" };

  // /profile
  if (pathname.startsWith("/profile")) return { pageType: "profile" };

  return { pageType: "other" };
}

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function FocusTrackerGlobal() {
  const pathname = usePathname();
  const { pageType, pageId } = useMemo(() => parsePageInfo(pathname), [pathname]);

  const { showReminder, awayDuration, dismissReminder, focusSeconds } =
    useFocusTracker({ pageType, pageId });

  const isPageVisible = useFocusStore((s) => s.isPageVisible);

  return (
    <>
      {/* 浮动专注指示器 */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-border/50 text-sm select-none">
          {isPageVisible ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <Eye className="h-3.5 w-3.5 text-green-600" />
              <span className="font-medium text-green-700 tabular-nums">
                {formatTimer(focusSeconds)}
              </span>
            </>
          ) : (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400" />
              </span>
              <EyeOff className="h-3.5 w-3.5 text-red-500" />
              <span className="font-medium text-red-600">已离开</span>
            </>
          )}
        </div>
      </div>

      {/* 温和提醒弹窗 */}
      <FocusReminder
        open={showReminder}
        awayDuration={awayDuration}
        onDismiss={dismissReminder}
      />
    </>
  );
}

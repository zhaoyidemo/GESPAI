"use client";

import { useEffect, useState } from "react";
import { Clock, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { VibeHistoryItem } from "@/stores/vibe-store";

export function VibeHistory() {
  const [posts, setPosts] = useState<VibeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("/api/vibe/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || posts.length === 0) return null;

  const displayed = expanded ? posts : posts.slice(0, 3);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Clock className="h-3.5 w-3.5" />
        <span>生成历史 ({posts.length})</span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {(expanded || posts.length <= 3) && (
        <div className="space-y-1.5">
          {displayed.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/50 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs px-1.5 py-0.5 rounded bg-secondary font-medium">
                  {post.contentType === "build"
                    ? "Build"
                    : post.contentType === "weekly"
                    ? "周报"
                    : "Learn"}
                </span>
                <span className="truncate text-foreground/80">
                  {post.title}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {post.shared && (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

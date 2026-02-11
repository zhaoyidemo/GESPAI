"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useVibeStore } from "@/stores/vibe-store";
import type { VibeSuggestion } from "@/stores/vibe-store";

export function VibeSuggestions() {
  const {
    suggestions,
    suggestionsLoading,
    setSuggestions,
    setSuggestionsLoading,
    setContentType,
    setRawInput,
    setPrefilled,
  } = useVibeStore();

  useEffect(() => {
    let cancelled = false;
    setSuggestionsLoading(true);

    fetch("/api/vibe/suggestions", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.suggestions) {
          setSuggestions(data.suggestions);
        }
      })
      .catch(() => {
        // 静默失败，不显示错误
      })
      .finally(() => {
        if (!cancelled) setSuggestionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setSuggestions, setSuggestionsLoading]);

  const handleSelect = (suggestion: VibeSuggestion) => {
    setContentType(suggestion.contentType);
    setRawInput(suggestion.rawInput);
    setPrefilled(true);
  };

  if (suggestionsLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>加载智能推荐...</span>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">智能推荐素材</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelect(s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            <span>{s.emoji}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

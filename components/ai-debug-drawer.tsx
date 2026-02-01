"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Sparkles, MessageCircle, BookX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export interface AIConversation {
  promptLevel: number;
  aiResponse: string;
  timestamp: string;
}

export interface AIDebugDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  conversations: AIConversation[];
  isLoading: boolean;
  onRequestHelp: () => void;
  helpCount: number;
}

export function AIDebugDrawer({
  isOpen,
  onClose,
  submissionId,
  conversations,
  isLoading,
  onRequestHelp,
  helpCount,
}: AIDebugDrawerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [addingToErrorBook, setAddingToErrorBook] = useState(false);
  const [addedToErrorBook, setAddedToErrorBook] = useState(false);

  // 添加到错题本
  const handleAddToErrorBook = async () => {
    if (!submissionId) return;

    setAddingToErrorBook(true);
    try {
      const response = await fetch("/api/error-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();

      if (response.ok) {
        setAddedToErrorBook(true);
        toast({
          title: "已加入错题本",
          description: "AI分析已同步，可以开始三问复盘",
        });

        // 延迟跳转，让用户看到提示
        setTimeout(() => {
          router.push(`/error-book/${data.errorCase.id}`);
        }, 1000);
      } else {
        if (data.error?.includes("已存在")) {
          toast({
            title: "该题已在错题本中",
            description: "可以直接去错题本查看",
          });
        } else {
          throw new Error(data.error || "添加失败");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "添加失败",
        description: error instanceof Error ? error.message : "请重试",
      });
    } finally {
      setAddingToErrorBook(false);
    }
  };

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 侧边抽屉 */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-[400px] bg-background border-l shadow-2xl z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h2 className="font-semibold text-lg">AI 学习助手</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 对话历史 */}
          <ScrollArea className="flex-1 p-4">
            {conversations.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">还没有AI分析</p>
                <p className="text-xs mt-1">点击下方按钮开始分析</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="h-3 w-3" />
                      <span>
                        第{conv.promptLevel}次提示
                        {conv.promptLevel === 1 && " · 轻提示"}
                        {conv.promptLevel === 2 && " · 中等提示"}
                        {conv.promptLevel >= 3 && " · 详细提示"}
                      </span>
                      <span className="ml-auto">
                        {new Date(conv.timestamp).toLocaleTimeString("zh-CN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {conv.aiResponse}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                    <span className="text-sm text-muted-foreground">
                      AI正在分析你的代码...
                    </span>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* 底部操作 */}
          <div className="p-4 border-t space-y-3">
            <Button
              onClick={onRequestHelp}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {conversations.length === 0 ? "开始分析" : "继续分析"}
                  {helpCount > 0 && ` (已帮助${helpCount}次)`}
                </>
              )}
            </Button>

            {/* 错题本联动 */}
            {conversations.length > 0 && submissionId && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                  💡 建议将这道题加入错题本，通过三问复盘避免再犯
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/30"
                  onClick={handleAddToErrorBook}
                  disabled={addingToErrorBook || addedToErrorBook}
                >
                  {addingToErrorBook ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      正在添加...
                    </>
                  ) : addedToErrorBook ? (
                    <>
                      <BookX className="mr-2 h-4 w-4" />
                      已加入，正在跳转...
                    </>
                  ) : (
                    <>
                      <BookX className="mr-2 h-4 w-4" />
                      加入错题本，开始三问复盘
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {helpCount >= 3 && (
              <p className="text-xs text-center text-muted-foreground">
                💡 已经是详细提示级别了，继续努力！
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

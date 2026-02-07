"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Loader2, Sparkles, MessageCircle, BookX, Mic, MicOff, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { addPunctuation } from "@/lib/auto-punctuation";

export interface AIConversation {
  role: "ai" | "user";
  content: string;
  promptLevel?: number;  // 仅 AI 递进提示时有值
  timestamp: string;
}

export interface AIDebugDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  conversations: AIConversation[];
  isLoading: boolean;
  onRequestHelp: () => void;
  onSendMessage: (message: string) => Promise<void>;
  helpCount: number;
}

export function AIDebugDrawer({
  isOpen,
  onClose,
  submissionId,
  conversations,
  isLoading,
  onRequestHelp,
  onSendMessage,
  helpCount,
}: AIDebugDrawerProps) {
  const { toast } = useToast();
  const [addingToErrorBook, setAddingToErrorBook] = useState(false);
  const [addedToErrorBook, setAddedToErrorBook] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [voiceErrorDisplay, setVoiceErrorDisplay] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputBeforeVoiceRef = useRef("");

  // 语音识别（不使用 onResult，通过 useEffect 监听 transcript 做整体替换）
  const {
    isListening,
    isSupported: speechSupported,
    transcript,
    error: voiceError,
    volume,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: "zh-CN",
  });

  // 语音识别文本更新时，整体替换输入框（prefix + transcript），避免重复累积
  useEffect(() => {
    if (isListening && transcript) {
      const prefix = inputBeforeVoiceRef.current;
      const text = prefix ? `${prefix} ${transcript}` : transcript;
      setInputText(addPunctuation(text, false));
    }
  }, [transcript, isListening]);

  // 语音错误 3 秒后自动消失
  useEffect(() => {
    if (voiceError) {
      setVoiceErrorDisplay(voiceError);
      const timer = setTimeout(() => setVoiceErrorDisplay(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [voiceError]);

  // 关闭抽屉时停止录音，释放麦克风资源
  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
      resetTranscript();
    }
  }, [isOpen, isListening, stopListening, resetTranscript]);

  // 对话更新时自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, isLoading]);

  // 停止录音并添加结尾标点（延迟等待最后的 transcript 更新）
  const handleStopListening = useCallback(() => {
    stopListening();
    setTimeout(() => {
      setInputText((prev) => {
        if (!prev.trim()) return prev;
        return addPunctuation(prev, true);
      });
    }, 100);
  }, [stopListening]);

  // 麦克风切换
  const handleMicToggle = () => {
    if (isListening) {
      handleStopListening();
    } else {
      inputBeforeVoiceRef.current = inputText.trim();
      resetTranscript();
      startListening();
    }
  };

  // 发送消息
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending || isLoading) return;

    // 如果正在录音先停止
    if (isListening) {
      stopListening();
    }
    resetTranscript();
    inputBeforeVoiceRef.current = "";

    setInputText("");
    setSending(true);
    try {
      await onSendMessage(text);
    } finally {
      setSending(false);
    }
  };

  // 回车发送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

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
          description: "可以稍后去错题本进行三问复盘",
        });
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

  const isBusy = isLoading || sending;

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
              <h2 className="font-semibold text-lg">GESP AI 私教·调试</h2>
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
            {conversations.length === 0 && !isBusy ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">还没有AI分析</p>
                <p className="text-xs mt-1">点击下方按钮开始分析，或直接提问</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv, index) => (
                  conv.role === "user" ? (
                    // 用户消息 - 右侧对齐
                    <div key={index} className="flex justify-end">
                      <div className="max-w-[85%] space-y-1">
                        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                          <span>
                            {new Date(conv.timestamp).toLocaleTimeString("zh-CN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <User className="h-3 w-3" />
                        </div>
                        <div className="bg-primary text-primary-foreground rounded-lg p-3 text-sm whitespace-pre-wrap leading-relaxed">
                          {conv.content}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // AI 消息 - 左侧对齐
                    <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        {conv.promptLevel ? (
                          <span>
                            第{conv.promptLevel}次提示
                            {conv.promptLevel === 1 && " · 轻提示"}
                            {conv.promptLevel === 2 && " · 中等提示"}
                            {conv.promptLevel >= 3 && " · 详细提示"}
                          </span>
                        ) : (
                          <span>AI 回复</span>
                        )}
                        <span className="ml-auto">
                          {new Date(conv.timestamp).toLocaleTimeString("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {conv.content}
                      </div>
                    </div>
                  )
                ))}

                {isBusy && (
                  <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                    <span className="text-sm text-muted-foreground">
                      {sending ? "AI正在回复..." : "AI正在分析你的代码..."}
                    </span>
                  </div>
                )}

                {/* 滚动锚点 */}
                <div ref={scrollRef} />
              </div>
            )}
          </ScrollArea>

          {/* 底部操作 */}
          <div className="p-4 border-t space-y-3">
            {/* 输入区域：输入框 + 麦克风 + 发送 */}
            <div className="flex items-center gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "正在识别语音..." : "输入你的问题..."}
                disabled={isBusy}
                className={cn(
                  "flex-1",
                  isListening && "border-red-400 ring-1 ring-red-400"
                )}
              />
              {speechSupported && (
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleMicToggle}
                  disabled={isBusy}
                  className="h-9 w-9 flex-shrink-0"
                  title={isListening ? "停止录音" : "语音输入"}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!inputText.trim() || isBusy}
                className="h-9 w-9 flex-shrink-0"
                title="发送"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* 录音中指示器（真实音量） */}
            {isListening && (
              <div className="flex items-center gap-2 text-xs text-red-500">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="flex items-center gap-0.5 mx-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block w-1 bg-red-500 rounded-full transition-all duration-75"
                      style={{ height: `${4 + volume * 12 * (0.7 + 0.3 * Math.sin(Date.now() / 150 + i * 2))}px` }}
                    />
                  ))}
                </span>
                <span>录音中，点击麦克风停止...</span>
              </div>
            )}
            {/* 语音错误提示 */}
            {voiceErrorDisplay && (
              <div className="text-xs text-red-500 text-center animate-pulse">
                {voiceErrorDisplay}
              </div>
            )}

            {/* 继续分析按钮 */}
            <Button
              onClick={onRequestHelp}
              disabled={isBusy}
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
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800 mb-2">
                  建议将这道题加入错题本，通过三问复盘避免再犯
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
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
                      已加入错题本
                    </>
                  ) : (
                    <>
                      <BookX className="mr-2 h-4 w-4" />
                      加入错题本
                    </>
                  )}
                </Button>
              </div>
            )}

            {helpCount >= 3 && (
              <p className="text-xs text-center text-muted-foreground">
                已经是详细提示级别了，继续努力！
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

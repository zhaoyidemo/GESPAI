"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, Mic, MicOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { addPunctuation } from "@/lib/auto-punctuation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  context: "learn" | "problem" | "feynman" | "general";
  knowledgePoint?: string;
  problemId?: string;
  initialMessages?: Message[];
  placeholder?: string;
  enableVoiceInput?: boolean;
  onMessageSent?: () => void;
}

// 音量指示器组件 - 3个跳动的点
function VolumeIndicator({ volume }: { volume: number }) {
  const [tick, setTick] = useState(0);

  // 定时更新以产生动画效果
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 75);
    return () => clearInterval(timer);
  }, []);

  // 根据音量计算每个点的高度（模拟跳动效果）
  const getHeight = (index: number) => {
    const base = 4;
    const maxExtra = 12;
    // 每个点有不同的相位，产生波浪效果
    const phase = ((index * 0.3 + tick * 0.1) % 1);
    const wave = Math.sin(phase * Math.PI * 2) * 0.3 + 0.7;
    return base + volume * maxExtra * wave;
  };

  return (
    <div className="flex items-center space-x-1 mx-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1 bg-red-500 rounded-full transition-all duration-75"
          style={{ height: `${getHeight(i)}px` }}
        />
      ))}
    </div>
  );
}

// 语言选项
const LANGUAGES = [
  { code: "zh-CN", label: "中" },
  { code: "en-US", label: "EN" },
] as const;

const VOICE_LANG_KEY = "gespai-voice-lang";

export function ChatInterface({
  context,
  knowledgePoint,
  problemId,
  initialMessages = [],
  placeholder = "输入你的问题...",
  enableVoiceInput = false,
  onMessageSent,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [voiceErrorDisplay, setVoiceErrorDisplay] = useState<string | null>(null);
  const [voiceLang, setVoiceLang] = useState<"zh-CN" | "en-US">("zh-CN");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // 保存开始录音时输入框已有的文字，用于追加模式
  const inputBeforeVoiceRef = useRef("");

  // 挂载时加载历史聊天记录
  useEffect(() => {
    if (initialMessages.length > 0) return; // 如果已有初始消息则跳过

    const targetId = context === "problem" ? problemId
      : (context === "learn" || context === "feynman") ? knowledgePoint
      : null;
    if (!targetId) return;

    setHistoryLoading(true);
    fetch(`/api/chat/history?context=${context}&targetId=${encodeURIComponent(targetId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch(() => {
        // 静默失败，不影响正常使用
      })
      .finally(() => {
        setHistoryLoading(false);
      });
  }, [context, problemId, knowledgePoint, initialMessages.length]);

  // 从 localStorage 读取语言偏好
  useEffect(() => {
    const saved = localStorage.getItem(VOICE_LANG_KEY);
    if (saved === "zh-CN" || saved === "en-US") {
      setVoiceLang(saved);
    }
  }, []);

  // 语音识别
  const {
    isListening,
    isSupported: isVoiceSupported,
    transcript,
    error: voiceError,
    volume,
    startListening,
    stopListening,
    resetTranscript,
    setLang,
  } = useSpeechRecognition({
    lang: voiceLang,
  });

  // 切换语言
  const toggleLanguage = () => {
    const newLang = voiceLang === "zh-CN" ? "en-US" : "zh-CN";
    setVoiceLang(newLang);
    setLang(newLang);
    localStorage.setItem(VOICE_LANG_KEY, newLang);
  };

  // 当语音识别文本更新时，追加到已有文字后面，并实时添加标点
  useEffect(() => {
    if (isListening && transcript) {
      const prefix = inputBeforeVoiceRef.current;
      let text = prefix ? `${prefix} ${transcript}` : transcript;
      // 中文模式下实时添加标点（非结束状态）
      if (voiceLang === "zh-CN") {
        text = addPunctuation(text, false);
      }
      setInput(text);
    }
  }, [transcript, isListening, voiceLang]);

  // 错误提示 3 秒后自动消失
  useEffect(() => {
    if (voiceError) {
      setVoiceErrorDisplay(voiceError);
      const timer = setTimeout(() => {
        setVoiceErrorDisplay(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [voiceError]);

  // 停止录音时处理自动标点（仅中文）
  const handleStopListening = useCallback(() => {
    stopListening();
    // 延迟一点处理，等待最后的 transcript 更新
    setTimeout(() => {
      setInput((prev) => {
        if (!prev.trim()) return prev;
        // 只对中文添加标点
        if (voiceLang === "zh-CN") {
          return addPunctuation(prev, true);
        }
        return prev;
      });
    }, 100);
  }, [stopListening, voiceLang]);

  // 切换语音录制状态
  const toggleVoiceInput = () => {
    if (isListening) {
      handleStopListening();
    } else {
      // 保存当前输入框的文字
      inputBeforeVoiceRef.current = input.trim();
      resetTranscript();
      startListening();
    }
  };

  // 键盘快捷键：空格键录音，回车键发送（仅在输入框未聚焦时生效）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果输入框聚焦，不触发快捷键
      if (document.activeElement === inputRef.current) return;
      // 如果正在加载，不允许操作
      if (loading) return;

      // 回车键发送消息
      if (e.code === "Enter" && !isListening && input.trim()) {
        e.preventDefault();
        formRef.current?.requestSubmit();
        return;
      }

      // 空格键按下开始录音（需要启用语音输入）
      if (enableVoiceInput && isVoiceSupported && e.code === "Space" && !e.repeat && !isListening) {
        e.preventDefault();
        inputBeforeVoiceRef.current = input.trim();
        resetTranscript();
        startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // 空格键松开停止录音
      if (enableVoiceInput && isVoiceSupported && e.code === "Space" && isListening) {
        e.preventDefault();
        handleStopListening();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enableVoiceInput, isVoiceSupported, isListening, loading, input, resetTranscript, startListening, handleStopListening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 费曼学习模式：请求评估
  const requestFeynmanEvaluation = useCallback(async () => {
    if (loading || context !== "feynman") return;

    // 添加用户请求评估的消息
    const evalMessage: Message = {
      role: "user",
      content: "我讲完了，请给我一个评估吧！",
    };
    const newMessages: Message[] = [...messages, evalMessage];
    setMessages(newMessages);
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context,
          knowledgePoint,
          requestEvaluation: true,
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "请求失败");
      }

      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "抱歉，AI 思考时间太长了，请稍后再试一次。如果问题持续，可以尝试简化你的问题。",
          },
        ]);
      } else {
        console.error("Evaluation error:", error);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "抱歉，获取评估时遇到问题。请稍后再试。",
          },
        ]);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [loading, context, messages, knowledgePoint]);

  // 监听费曼评估事件
  useEffect(() => {
    const handleFeynmanEnd = () => {
      requestFeynmanEvaluation();
    };

    window.addEventListener("feynman-end-explanation", handleFeynmanEnd);
    return () => {
      window.removeEventListener("feynman-end-explanation", handleFeynmanEnd);
    };
  }, [requestFeynmanEvaluation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    // 清空语音识别状态，避免旧文本重新填充
    resetTranscript();
    inputBeforeVoiceRef.current = "";

    // 添加用户消息
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context,
          knowledgePoint,
          problemId,
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "请求失败");
      }

      // 添加 AI 回复
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
      onMessageSent?.();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "抱歉，AI 思考时间太长了，请稍后再试一次。如果问题持续，可以尝试简化你的问题。",
          },
        ]);
      } else {
        console.error("Chat error:", error);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "抱歉，我遇到了一些问题。请稍后再试。",
          },
        ]);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {historyLoading && messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Loader2 className="h-8 w-8 mx-auto mb-3 opacity-50 animate-spin" />
            <p className="text-sm">加载聊天记录...</p>
          </div>
        )}

        {!historyLoading && messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>你好！我是 GESP AI，有什么问题都可以问我。</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 message-bubble ${
              message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback
                className={
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-green-500 text-white"
                }
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>

            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      code: ({ className, children, ...props }) => {
                        const isInline = !className;
                        if (isInline) {
                          return (
                            <code className="bg-muted px-1 rounded text-sm" {...props}>
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre className="bg-slate-800 text-slate-100 p-3 rounded-lg overflow-x-auto my-2">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-green-500 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">正在思考...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <form ref={formRef} onSubmit={handleSubmit} className="p-4 border-t bg-background">
        {/* 语音识别状态提示 */}
        {enableVoiceInput && isVoiceSupported && isListening && (
          <div className="flex items-center justify-center mb-2 text-sm text-red-500">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
            <VolumeIndicator volume={volume} />
            <span>正在录音，点击麦克风或松开空格键停止...</span>
          </div>
        )}
        {enableVoiceInput && voiceErrorDisplay && (
          <div className="mb-2 text-sm text-red-500 text-center animate-pulse">
            {voiceErrorDisplay}
          </div>
        )}

        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "正在识别语音..." : placeholder}
            disabled={loading}
            className="flex-1"
          />

          {/* 语言切换按钮 */}
          {enableVoiceInput && isVoiceSupported && (
            <Button
              type="button"
              variant="outline"
              onClick={toggleLanguage}
              disabled={loading || isListening}
              title={`当前语言: ${voiceLang === "zh-CN" ? "中文" : "English"}，点击切换`}
              className="w-12 px-0 text-xs font-medium"
            >
              {LANGUAGES.find(l => l.code === voiceLang)?.label}
            </Button>
          )}

          {/* 语音输入按钮 */}
          {enableVoiceInput && isVoiceSupported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              onClick={toggleVoiceInput}
              disabled={loading}
              title={isListening ? "停止录音" : "语音输入"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}

          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

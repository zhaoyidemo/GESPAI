"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, Mic, MicOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  context: "learn" | "problem" | "general";
  knowledgePoint?: string;
  problemId?: string;
  initialMessages?: Message[];
  placeholder?: string;
  enableVoiceInput?: boolean;
}

export function ChatInterface({
  context,
  knowledgePoint,
  problemId,
  initialMessages = [],
  placeholder = "输入你的问题...",
  enableVoiceInput = false,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceErrorDisplay, setVoiceErrorDisplay] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // 保存开始录音时输入框已有的文字，用于追加模式
  const inputBeforeVoiceRef = useRef("");

  // 语音识别
  const {
    isListening,
    isSupported: isVoiceSupported,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: "zh-CN",
  });

  // 当语音识别文本更新时，追加到已有文字后面
  useEffect(() => {
    if (isListening && transcript) {
      const prefix = inputBeforeVoiceRef.current;
      setInput(prefix ? `${prefix} ${transcript}` : transcript);
    }
  }, [transcript, isListening]);

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

  // 切换语音录制状态
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      // 保存当前输入框的文字
      inputBeforeVoiceRef.current = input.trim();
      resetTranscript();
      startListening();
    }
  };

  // 空格键快捷键：按住录音，松开停止（仅在输入框未聚焦时生效）
  useEffect(() => {
    if (!enableVoiceInput || !isVoiceSupported) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果输入框聚焦或正在输入，不触发快捷键
      if (document.activeElement === inputRef.current) return;
      // 如果正在加载，不允许操作
      if (loading) return;
      // 空格键按下开始录音
      if (e.code === "Space" && !e.repeat && !isListening) {
        e.preventDefault();
        inputBeforeVoiceRef.current = input.trim();
        resetTranscript();
        startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // 空格键松开停止录音
      if (e.code === "Space" && isListening) {
        e.preventDefault();
        stopListening();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enableVoiceInput, isVoiceSupported, isListening, loading, input, resetTranscript, startListening, stopListening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // 添加用户消息
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "请求失败");
      }

      // 添加 AI 回复
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "抱歉，我遇到了一些问题。请稍后再试。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
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
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-900"
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
                            <code className="bg-gray-200 px-1 rounded text-sm" {...props}>
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto my-2">
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
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">正在思考...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        {/* 语音识别状态提示 */}
        {enableVoiceInput && isVoiceSupported && isListening && (
          <div className="flex items-center justify-center mb-2 text-sm text-red-500">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
            正在录音，点击麦克风或松开空格键停止...
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

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
}

export function ChatInterface({
  context,
  knowledgePoint,
  problemId,
  initialMessages = [],
  placeholder = "输入你的问题...",
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

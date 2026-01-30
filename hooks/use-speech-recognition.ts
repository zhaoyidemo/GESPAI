"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { lang = "zh-CN", continuous = true, onResult, onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // 用 ref 存储回调，避免 useEffect 依赖变化
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  // 存储已确认的最终文本（continuous 模式下累加）
  const finalTranscriptRef = useRef("");

  // 保持回调 ref 最新
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

  // 检查浏览器支持并初始化（只在 lang 变化时重新初始化）
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.continuous = continuous;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentFinal = "";
        let currentInterim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            currentFinal += result[0].transcript;
          } else {
            currentInterim += result[0].transcript;
          }
        }

        // 如果有新的最终结果，累加到已有文本
        if (currentFinal) {
          finalTranscriptRef.current += currentFinal;
          onResultRef.current?.(finalTranscriptRef.current);
        }

        // 显示文本 = 已确认的文本 + 当前临时文本
        const displayText = finalTranscriptRef.current + currentInterim;
        setTranscript(displayText);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMessage = "语音识别出错";
        switch (event.error) {
          case "no-speech":
            errorMessage = "没有检测到语音，请再试一次";
            break;
          case "audio-capture":
            errorMessage = "没有找到麦克风设备";
            break;
          case "not-allowed":
            errorMessage = "麦克风权限被拒绝，请在浏览器设置中允许";
            break;
          case "network":
            errorMessage = "网络错误，语音识别需要联网";
            break;
          case "aborted":
            // 用户主动停止，不显示错误
            return;
        }
        setError(errorMessage);
        setIsListening(false);
        onErrorRef.current?.(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, [lang, continuous]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    setError(null);
    setTranscript("");
    finalTranscriptRef.current = "";

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      // 如果已经在监听，忽略错误
      if (err instanceof Error && err.message.includes("already started")) {
        return;
      }
      setError("无法启动语音识别");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch {
      // 忽略停止时的错误
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
    finalTranscriptRef.current = "";
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}

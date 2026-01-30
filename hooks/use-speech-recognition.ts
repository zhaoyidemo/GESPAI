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
  volume: number; // 0-1 音量值
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setLang: (lang: string) => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { lang: initialLang = "zh-CN", continuous = true, onResult, onError } = options;

  const [lang, setLangState] = useState(initialLang);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // 用 ref 存储回调，避免 useEffect 依赖变化
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  // 存储已确认的最终文本（continuous 模式下累加）
  const finalTranscriptRef = useRef("");
  // 音量检测相关
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);

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

  // 启动音量检测
  const startVolumeDetection = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // 定时读取音量
      volumeIntervalRef.current = window.setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        // 计算平均音量
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        // 归一化到 0-1
        setVolume(Math.min(average / 128, 1));
      }, 50);
    } catch {
      // 音量检测失败不影响语音识别
      console.warn("音量检测初始化失败");
    }
  }, []);

  // 停止音量检测
  const stopVolumeDetection = useCallback(() => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setVolume(0);
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    setError(null);
    setTranscript("");
    finalTranscriptRef.current = "";

    try {
      recognitionRef.current.start();
      setIsListening(true);
      startVolumeDetection();
    } catch (err) {
      // 如果已经在监听，忽略错误
      if (err instanceof Error && err.message.includes("already started")) {
        return;
      }
      setError("无法启动语音识别");
    }
  }, [startVolumeDetection]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);
      stopVolumeDetection();
    } catch {
      // 忽略停止时的错误
    }
  }, [stopVolumeDetection]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
    finalTranscriptRef.current = "";
  }, []);

  const setLang = useCallback((newLang: string) => {
    setLangState(newLang);
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopVolumeDetection();
    };
  }, [stopVolumeDetection]);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    volume,
    startListening,
    stopListening,
    resetTranscript,
    setLang,
  };
}

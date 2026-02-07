"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseWebSpeechOptions {
  lang?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseWebSpeechReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  volume: number;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setLang: (lang: string) => void;
}

export function useWebSpeech(
  options: UseWebSpeechOptions = {}
): UseWebSpeechReturn {
  const { lang: initialLang = "zh-CN", continuous = true, onResult, onError } = options;

  const [lang, setLangState] = useState(initialLang);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const finalTranscriptRef = useRef("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);
  const shouldBeListeningRef = useRef(false);

  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

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

        if (currentFinal) {
          finalTranscriptRef.current += currentFinal;
          onResultRef.current?.(finalTranscriptRef.current);
        }

        const displayText = finalTranscriptRef.current + currentInterim;
        setTranscript(displayText);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // 主动取消，忽略
        if (event.error === "aborted") return;
        // 静默超时，非致命错误，onend 会自动重启
        if (event.error === "no-speech") return;

        // 其他为致命错误，停止录音
        let errorMessage = "语音识别出错";
        switch (event.error) {
          case "audio-capture":
            errorMessage = "没有找到麦克风设备";
            break;
          case "not-allowed":
            errorMessage = "麦克风权限被拒绝，请在浏览器设置中允许";
            break;
          case "network":
            errorMessage = "网络错误，语音识别需要联网";
            break;
        }
        shouldBeListeningRef.current = false;
        setError(errorMessage);
        setIsListening(false);
        onErrorRef.current?.(errorMessage);
      };

      recognition.onend = () => {
        if (shouldBeListeningRef.current) {
          // 用户未主动停止，自动重启识别（语音暂停/静默超时导致的结束）
          setTimeout(() => {
            if (!shouldBeListeningRef.current) return;
            try {
              recognitionRef.current?.start();
            } catch {
              shouldBeListeningRef.current = false;
              setIsListening(false);
            }
          }, 100);
        } else {
          setIsListening(false);
        }
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

      volumeIntervalRef.current = window.setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume(Math.min(average / 128, 1));
      }, 50);
    } catch {
      console.warn("音量检测初始化失败");
    }
  }, []);

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

    shouldBeListeningRef.current = true;
    setError(null);
    setTranscript("");
    finalTranscriptRef.current = "";

    try {
      recognitionRef.current.start();
      setIsListening(true);
      startVolumeDetection();
    } catch (err) {
      if (err instanceof Error && err.message.includes("already started")) {
        return;
      }
      setError("无法启动语音识别");
    }
  }, [startVolumeDetection]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    shouldBeListeningRef.current = false;

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

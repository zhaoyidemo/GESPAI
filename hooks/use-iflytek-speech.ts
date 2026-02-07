"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseIflytekSpeechOptions {
  lang?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseIflytekSpeechReturn {
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

// 讯飞 WebSocket 帧状态
const STATUS_FIRST_FRAME = 0;
const STATUS_CONTINUE_FRAME = 1;
const STATUS_LAST_FRAME = 2;

// 讯飞要求的目标采样率
const TARGET_SAMPLE_RATE = 16000;

// 讯飞返回结果接口
interface IflytekResult {
  code: number;
  message: string;
  sid: string;
  data?: {
    status: number;
    result?: {
      sn: number;
      ls: boolean;
      pgs?: "apd" | "rpl";
      rg?: [number, number];
      ws: Array<{
        bg: number;
        cw: Array<{ w: string; sc: number }>;
      }>;
    };
  };
}

// 降采样：从浏览器原生采样率降到 16kHz（讯飞要求）
function downsampleBuffer(
  buffer: Float32Array,
  inputRate: number,
  outputRate: number
): Float32Array {
  if (inputRate === outputRate) return buffer;

  const ratio = inputRate / outputRate;
  const newLength = Math.ceil(buffer.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const pos = i * ratio;
    const index = Math.floor(pos);
    const frac = pos - index;
    // 线性插值，比最近邻取样质量更好
    const a = buffer[index] || 0;
    const b = buffer[Math.min(index + 1, buffer.length - 1)] || 0;
    result[i] = a + frac * (b - a);
  }

  return result;
}

// Float32 转 Int16 PCM
function float32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16Array;
}

// Int16 ArrayBuffer 转 Base64（分块处理，避免 O(n²) 字符串拼接）
function int16ToBase64(int16Array: Int16Array): string {
  const bytes = new Uint8Array(int16Array.buffer);
  const CHUNK_SIZE = 8192;
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
    chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
  }
  return btoa(chunks.join(""));
}

export function useIflytekSpeech(
  options: UseIflytekSpeechOptions = {}
): UseIflytekSpeechReturn {
  const { onResult, onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);

  // 讯飞动态修正结果管理
  const resultMapRef = useRef<Map<number, string>>(new Map());
  const isStoppingRef = useRef(false);
  const sendIntervalRef = useRef<number | null>(null);
  const audioBufferRef = useRef<Int16Array[]>([]);
  const frameStatusRef = useRef(STATUS_FIRST_FRAME);

  // 用户意图控制：用户主动停止前保持录音
  const shouldBeListeningRef = useRef(false);
  // 跨 session 累积文本（自动重启时保留之前识别的内容）
  const accumulatedTextRef = useRef("");
  // doStart 函数引用（用于 ws.onclose 中自动重启）
  const doStartRef = useRef<() => Promise<void>>();

  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

  // 从讯飞结果中提取文本
  const parseResult = useCallback((data: IflytekResult) => {
    if (data.code !== 0) {
      const msg = `讯飞识别错误 (${data.code}): ${data.message}`;
      setError(msg);
      onErrorRef.current?.(msg);
      return;
    }

    const result = data.data?.result;
    if (!result) return;

    const { sn, pgs, rg, ws } = result;

    // 拼接当前段的文字
    const text = ws.map(w => w.cw.map(c => c.w).join("")).join("");

    const map = resultMapRef.current;

    if (pgs === "rpl" && rg) {
      // 替换模式：删除 rg 范围内的旧段，替换为新段
      for (let i = rg[0]; i <= rg[1]; i++) {
        map.delete(i);
      }
    }

    map.set(sn, text);

    // 按 sn 顺序拼接所有段
    const sortedKeys = Array.from(map.keys()).sort((a, b) => a - b);
    const sessionText = sortedKeys.map(k => map.get(k)).join("");

    // 加上之前 session 累积的文本
    const fullText = accumulatedTextRef.current
      ? accumulatedTextRef.current + sessionText
      : sessionText;

    setTranscript(fullText);
    onResultRef.current?.(fullText);
  }, []);

  // 清理音频资源
  const cleanupAudio = useCallback(() => {
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
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
    audioBufferRef.current = [];
    setVolume(0);
  }, []);

  // 发送音频帧到讯飞
  const sendAudioFrame = useCallback((base64Audio: string, status: number) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const appId = process.env.NEXT_PUBLIC_IFLYTEK_APP_ID;

    const frame: Record<string, unknown> = {
      data: {
        status,
        format: "audio/L16;rate=16000",
        encoding: "raw",
        audio: base64Audio,
      },
    };

    // 第一帧携带公共参数和业务参数
    if (status === STATUS_FIRST_FRAME) {
      frame.common = { app_id: appId };
      frame.business = {
        language: "zh_cn",
        domain: "iat",
        accent: "mandarin",
        ptt: 1,
        dwa: "wpgs",
        // 语音活动检测（VAD）静默超时：10 秒
        // 默认仅 ~2 秒，太短会导致用户稍作停顿就断开 session
        vad_eos: 10000,
      };
    }

    ws.send(JSON.stringify(frame));
  }, []);

  // 核心 session 启动逻辑（startListening 和自动重启共用）
  const doStart = useCallback(async () => {
    isStoppingRef.current = false;
    frameStatusRef.current = STATUS_FIRST_FRAME;
    resultMapRef.current.clear();

    try {
      // 1. 获取签名 URL
      const authRes = await fetch("/api/speech/auth");
      if (!authRes.ok) {
        const data = await authRes.json();
        throw new Error(data.error || "获取签名失败");
      }
      const { url } = await authRes.json();

      // 如果在等待期间用户已停止，放弃启动
      if (!shouldBeListeningRef.current) {
        setIsListening(false);
        return;
      }

      // 2. 获取麦克风权限（不强制 sampleRate，使用设备原生采样率）
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      // 如果在等待期间用户已停止，清理并放弃
      if (!shouldBeListeningRef.current) {
        stream.getTracks().forEach(track => track.stop());
        setIsListening(false);
        return;
      }

      // 3. 初始化音频上下文（使用浏览器原生采样率，避免兼容性问题）
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const nativeSampleRate = audioContext.sampleRate;

      const source = audioContext.createMediaStreamSource(stream);

      // 音量检测
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      volumeIntervalRef.current = window.setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume(Math.min(average / 128, 1));
      }, 50);

      // 音频采集（buffer 1024：比旧的 4096 延迟更低，约 21ms@48kHz）
      const processor = audioContext.createScriptProcessor(1024, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isStoppingRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        // 从浏览器原生采样率降采样到讯飞要求的 16kHz
        const downsampled = downsampleBuffer(inputData, nativeSampleRate, TARGET_SAMPLE_RATE);
        const pcmData = float32ToInt16(downsampled);
        audioBufferRef.current.push(pcmData);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      // 4. 建立 WebSocket 连接
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsListening(true);

        // 每 40ms 发送一帧音频（与讯飞推荐的 40ms 帧间隔一致）
        sendIntervalRef.current = window.setInterval(() => {
          const buffer = audioBufferRef.current.shift();
          if (!buffer) return;

          const base64 = int16ToBase64(buffer);
          const status = frameStatusRef.current;

          sendAudioFrame(base64, status);

          if (status === STATUS_FIRST_FRAME) {
            frameStatusRef.current = STATUS_CONTINUE_FRAME;
          }
        }, 40);
      };

      ws.onmessage = (event) => {
        try {
          const data: IflytekResult = JSON.parse(event.data);
          parseResult(data);

          // 识别结束
          if (data.data?.status === 2) {
            ws.close();
          }
        } catch {
          // 解析失败忽略
        }
      };

      ws.onerror = () => {
        const msg = "语音识别连接异常";
        setError(msg);
        onErrorRef.current?.(msg);
        shouldBeListeningRef.current = false;
        cleanupAudio();
        setIsListening(false);
      };

      ws.onclose = () => {
        cleanupAudio();

        if (shouldBeListeningRef.current && !isStoppingRef.current) {
          // 用户未主动停止，服务端结束了当前 session
          // 保存当前 session 累积的文本，然后自动重启新 session
          const map = resultMapRef.current;
          const sortedKeys = Array.from(map.keys()).sort((a, b) => a - b);
          const sessionText = sortedKeys.map(k => map.get(k)).join("");
          if (sessionText) {
            accumulatedTextRef.current = accumulatedTextRef.current
              ? accumulatedTextRef.current + sessionText
              : sessionText;
          }
          // 异步重启新 session
          doStartRef.current?.();
        } else {
          setIsListening(false);
        }
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "启动语音识别失败";
      setError(msg);
      onErrorRef.current?.(msg);
      shouldBeListeningRef.current = false;
      cleanupAudio();
      setIsListening(false);
    }
  }, [cleanupAudio, sendAudioFrame, parseResult]);

  // 保持 doStartRef 与最新 doStart 同步
  useEffect(() => {
    doStartRef.current = doStart;
  }, [doStart]);

  const startListening = useCallback(async () => {
    if (isListening) return;

    shouldBeListeningRef.current = true;
    accumulatedTextRef.current = "";
    setError(null);
    setTranscript("");
    resultMapRef.current.clear();

    await doStart();
  }, [isListening, doStart]);

  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false;
    isStoppingRef.current = true;

    // 停止音频采集
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }

    // 发送结束帧
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      sendAudioFrame("", STATUS_LAST_FRAME);
    }

    // 清理音频资源（WebSocket 等待服务端关闭）
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
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
    audioBufferRef.current = [];
    setVolume(0);
  }, [sendAudioFrame]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
    resultMapRef.current.clear();
    accumulatedTextRef.current = "";
  }, []);

  const setLang = useCallback((_lang: string) => {
    // 讯飞通过 business 参数控制语言，此处保留接口兼容
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      shouldBeListeningRef.current = false;
      isStoppingRef.current = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    isListening,
    isSupported: true,
    transcript,
    error,
    volume,
    startListening,
    stopListening,
    resetTranscript,
    setLang,
  };
}

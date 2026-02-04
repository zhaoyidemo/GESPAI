"use client";

import { useWebSpeech } from "./use-web-speech";
import { useIflytekSpeech } from "./use-iflytek-speech";

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
  volume: number;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setLang: (lang: string) => void;
}

const useIflytek = process.env.NEXT_PUBLIC_IFLYTEK_ENABLED === "true";

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  // React Hooks 必须无条件调用，因此两个都调用，但只返回启用的那个
  const webSpeech = useWebSpeech(useIflytek ? {} : options);
  const iflytekSpeech = useIflytekSpeech(useIflytek ? options : {});

  return useIflytek ? iflytekSpeech : webSpeech;
}

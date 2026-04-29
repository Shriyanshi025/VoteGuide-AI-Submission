import type { AppLanguage } from '../types';

/**
 * Type definitions for Web Speech API
 */
interface SpeechRecognitionEvent extends Event {
  results: {
    length: number;
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

const SpeechRecognitionConstructor = 
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const LANGUAGE_MAP: Record<AppLanguage, string> = {
  'English': 'en-IN',
  'Hindi': 'hi-IN',
  'Bengali': 'bn-IN',
  'Tamil': 'ta-IN',
  'Telugu': 'te-IN'
};

/**
 * Isolated wrapper for Browser Speech-to-Text (STT) and Text-to-Speech (TTS).
 */

export const startListening = (
  lang: AppLanguage, 
  onResult: (text: string) => void, 
  onEnd: () => void,
  onError?: (error: string) => void
): void => {
  if (!SpeechRecognitionConstructor) {
    if (onError) onError('unsupported');
    console.warn("Speech recognition is not supported in this browser.");
    onEnd();
    return;
  }

  const recognition: SpeechRecognition = new SpeechRecognitionConstructor();
  recognition.lang = LANGUAGE_MAP[lang];
  recognition.interimResults = false;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    if (event.results.length > 0) {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    } else {
      if (onError) onError('no-speech');
    }
  };

  (recognition as any).onerror = (event: any) => {
    if (onError) onError(event.error);
  };

  recognition.onend = onEnd;
  recognition.start();
};

export const speak = (text: string, lang: AppLanguage, onEnd?: () => void): void => {
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis is not supported in this browser.");
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGE_MAP[lang];
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = (): void => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

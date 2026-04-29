import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  value: {
    requestPermission: vi.fn().mockResolvedValue('granted'),
    permission: 'granted',
  },
});

// Mock SpeechRecognition
const mockSpeechRecognition = vi.fn().mockImplementation(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

(window as any).SpeechRecognition = mockSpeechRecognition;
(window as any).webkitSpeechRecognition = mockSpeechRecognition;

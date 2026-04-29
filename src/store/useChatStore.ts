import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message } from '../types';

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setTyping: (isTyping: boolean) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isTyping: false,

      addMessage: (msg) => set((state) => ({
        messages: [...state.messages, {
          ...msg,
          id: crypto.randomUUID(),
          timestamp: Date.now()
        }]
      })),

      setTyping: (isTyping) => set({ isTyping }),

      clearHistory: () => set({ messages: [] })
    }),
    {
      name: 'voteguide-chat-storage',
      partialize: (state) => ({ messages: state.messages }), // Only persist messages
    }
  )
);

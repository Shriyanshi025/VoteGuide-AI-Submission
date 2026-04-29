import React, { useState } from 'react';
import { VoiceButton } from './VoiceButton';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-area" onSubmit={handleSubmit}>
      <input
        id="chat-text-input"
        type="text"
        className="text-input"
        placeholder="Ask about elections..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Chat input"
      />
      <VoiceButton onResult={(voiceText) => {
        setText(prev => (prev ? prev + ' ' : '') + voiceText);
        const input = document.getElementById('chat-text-input');
        if (input) input.focus();
      }} />
      <button 
        type="submit" 
        className="flex-center"
        style={{ 
          color: 'var(--primary)', 
          fontSize: '1.2rem', 
          opacity: text.trim() ? 1 : 0.5,
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
};

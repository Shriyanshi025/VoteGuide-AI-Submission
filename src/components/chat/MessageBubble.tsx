import React from 'react';
import type { Message } from '../../types';
import { speak, stopSpeaking } from '../../api/speech';
import { useUIStore } from '../../store/useUIStore';

interface MessageBubbleProps {
  message: Message;
}

const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="msg-strong">{part.slice(2, -2)}</strong>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

const renderMessageContent = (content: string) => {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    const tLine = line.trim();
    if (tLine === '────────') {
      return <div key={i} className="msg-divider" />;
    }
    if (tLine.startsWith('Tip:')) {
      return (
        <div key={i} className="msg-tip">
          <strong>Tip:</strong> {parseInline(tLine.substring(4).trim())}
        </div>
      );
    }
    if (tLine.startsWith('•')) {
      return (
        <div key={i} className="msg-bullet">
          <span className="msg-bullet-icon">•</span>
          <span className="msg-bullet-text">{parseInline(tLine.substring(1).trim())}</span>
        </div>
      );
    }
    const numMatch = tLine.match(/^(\d+\.)\s+(.*)$/);
    if (numMatch) {
      return (
        <div key={i} className="msg-bullet msg-numbered">
          <span className="msg-bullet-icon">{numMatch[1]}</span>
          <span className="msg-bullet-text">{parseInline(numMatch[2])}</span>
        </div>
      );
    }
    if (tLine === '') {
      return <div key={i} className="msg-spacer" />;
    }
    return <div key={i} className="msg-paragraph">{parseInline(line)}</div>;
  });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.role === 'assistant';
  const language = useUIStore(state => state.language);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speak(message.content, language, () => setIsSpeaking(false));
    }
  };

  return (
    <div className={`message-bubble ${isAI ? 'message-ai' : 'message-user'}`}>
      <div className="message-content">
        {isAI ? renderMessageContent(message.content) : message.content}
      </div>
      {isAI && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button 
            onClick={handleSpeak}
            style={{ fontSize: '1rem', opacity: 0.6, cursor: 'pointer' }}
            aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
            title={isSpeaking ? "Stop" : "Listen"}
          >
            {isSpeaking ? '🔇' : '🔊'}
          </button>
        </div>
      )}
    </div>
  );
};

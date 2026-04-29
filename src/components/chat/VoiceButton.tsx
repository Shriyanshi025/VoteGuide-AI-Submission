import React, { useState } from 'react';
import { startListening } from '../../api/speech';
import { useUIStore } from '../../store/useUIStore';

interface VoiceButtonProps {
  onResult: (text: string) => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ onResult }) => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'error' | 'unsupported'>('idle');
  const [feedback, setFeedback] = useState('');
  const language = useUIStore(state => state.language);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (status === 'listening') return; // Do nothing if already listening

    setStatus('listening');
    setFeedback('Listening...');

    startListening(
      language,
      (text) => {
        setStatus('success');
        setFeedback(`Heard: "${text}"`);
        onResult(text);
        setTimeout(() => setStatus('idle'), 3000);
      },
      () => {
        // onEnd
        setStatus(prev => prev === 'listening' ? 'idle' : prev);
      },
      (error) => {
        if (error === 'unsupported') {
          setStatus('unsupported');
          setFeedback('Voice input not supported in this browser.');
          setTimeout(() => setStatus('idle'), 3000);
        } else {
          setStatus('error');
          setFeedback("I couldn't hear clearly. Please try again.");
          setTimeout(() => setStatus('idle'), 3000);
        }
      }
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
      {status !== 'idle' && (
        <span style={{ 
          fontSize: '0.85rem', 
          color: status === 'error' || status === 'unsupported' ? 'var(--error)' : 'var(--text-muted)' 
        }}>
          {status === 'listening' ? '🔴' : status === 'success' ? '✅' : '❌'} {feedback}
        </span>
      )}
      <button
        type="button"
        onClick={handleToggle}
        className={`flex-center ${status === 'listening' ? 'listening' : ''}`}
        title="Tap to speak"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: status === 'listening' ? 'var(--accent)' : 'var(--bg-card)',
          border: '1px solid var(--border)',
          fontSize: '1.2rem',
          boxShadow: status === 'listening' ? '0 0 10px var(--accent)' : 'none',
          cursor: 'pointer'
        }}
        aria-label="Start voice input"
      >
        {status === 'listening' ? '🛑' : '🎤'}
      </button>
    </div>
  );
};

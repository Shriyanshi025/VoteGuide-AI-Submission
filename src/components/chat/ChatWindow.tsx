import React, { useRef, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useUIStore } from '../../store/useUIStore';
import { getAIResponse } from '../../services/aiOrchestrator';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { translations } from '../../i18n/translations';
import { formatResponse } from '../../services/explanationModeService';

export const ChatWindow: React.FC = () => {
  const messages = useChatStore(state => state.messages);
  const isTyping = useChatStore(state => state.isTyping);
  const addMessage = useChatStore(state => state.addMessage);
  const setTyping = useChatStore(state => state.setTyping);
  
  const persona = useUIStore(state => state.persona);
  const mode = useUIStore(state => state.explanationMode);
  const setCurrentView = useUIStore(state => state.setCurrentView);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const userMessage = { role: 'user', content: text } as const;
    addMessage(userMessage);
    setTyping(true);

    try {
      // Pass history including the new user message
      const historyWithNewMessage = [...messages, { ...userMessage, id: 'temp', timestamp: Date.now() }];
      const response = await getAIResponse(text, persona, mode, historyWithNewMessage);
      
      addMessage({ 
        role: 'assistant', 
        content: response.answer, 
        source: response.attribution,
        suggestions: response.suggestions
      });
    } catch (error: any) {
      addMessage({ 
        role: 'assistant', 
        content: error.message || "I'm having trouble connecting to the AI. Please try again later." 
      });
    } finally {
      setTyping(false);
    }
  };

  const handleChipClick = (chip: string) => {
    // 7. Other Question
    if (chip === 'Other Question') {
      const input = document.getElementById('chat-text-input') as HTMLInputElement | null;
      if (input) {
        input.placeholder = "Ask your voter related question...";
        input.focus();
      }
      return;
    }

    // 2. Find Polling Booth
    if (chip === 'Find Booth' || chip === 'Find Polling Booth') {
      addMessage({ role: 'user', content: chip });
      setCurrentView('tools');
      return;
    }

    // Add user message for other actions
    addMessage({ role: 'user', content: chip });

    // Deterministic mappings
    const t = translations[useUIStore.getState().language];
    const persona = useUIStore.getState().persona;
    const mode = useUIStore.getState().explanationMode;

    const applyModifiers = (text: string) => {
      return formatResponse(text, mode, persona);
    };

    switch (chip) {
      case 'Check Eligibility':
        addMessage({
          role: 'assistant',
          content: applyModifiers(t['ans.eligibility']),
          suggestions: ['Register to Vote', 'Required Documents']
        });
        break;
      case 'Register Now':
      case 'Register to Vote':
        addMessage({
          role: 'assistant',
          content: applyModifiers(t['ans.register']),
          suggestions: ['Required Documents', 'Find Polling Booth']
        });
        break;
      case 'Required Documents':
      case 'Documents Needed':
        addMessage({
          role: 'assistant',
          content: applyModifiers(t['ans.documents']),
          suggestions: ['Register to Vote', 'Check Eligibility']
        });
        break;
      case 'Voter ID Help':
        addMessage({
          role: 'assistant',
          content: applyModifiers(t['ans.voter_id']),
          suggestions: ['Register to Vote', 'Other Question']
        });
        break;
      case 'Election Date':
      case 'Election Dates':
        addMessage({
          role: 'assistant',
          content: applyModifiers(t['ans.election_dates']),
          suggestions: ['Find Polling Booth', 'Other Question']
        });
        break;
      default:
        // Generic fallback for any other chip
        handleSend(chip);
    }
  };

  const getSmartChips = () => {
    if (messages.length === 0) return [];
    const lastMessage = messages[messages.length - 1];
    
    // Use explicit suggestions if provided by the AI/Orchestrator
    if (lastMessage.suggestions) return lastMessage.suggestions;

    // Hard fallback to fixed deterministic set
    return [
      "Check Eligibility",
      "Find Polling Booth",
      "Register to Vote",
      "Required Documents",
      "Voter ID Help",
      "Election Dates",
      "Other Question"
    ];
  };

  return (
    <div className="chat-window">
      <div className="messages-list" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex-center" style={{ flex: 1, opacity: 0.5, textAlign: 'center' }}>
            Ask me anything about the Indian election process.
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="message-bubble message-ai" style={{ opacity: 0.7 }}>
            AI is thinking...
          </div>
        )}
        
        {!isTyping && getSmartChips().length > 0 && (
          <div className="action-chips">
            {getSmartChips().map(chip => (
              <button key={chip} className="chip" onClick={() => handleChipClick(chip)}>
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
};

import { getAnswer } from './knowledgeEngine';
import type { Message, PersonaType, ExplanationMode, AppLanguage, Attribution } from '../types';
import { translations } from '../i18n/translations';
import { chat as callBackendChat } from '../api/backendClient.ts';

/**
 * Orchestrates the AI response flow.
 * 1. Checks strict off-topic guardrails.
 * 2. Checks local verified knowledge engine (Deterministic Quick Actions).
 * 3. Attempts backend /api/chat for free-text queries (includes Intent Routing + Gemini).
 * 4. Fallback to friendly local answer if backend is unavailable.
 */
export const getAIResponse = async (
  query: string,
  persona: PersonaType,
  mode: ExplanationMode,
  history: Message[],
  language: AppLanguage = 'English'
): Promise<Attribution> => {
  const cleanQuery = query.toLowerCase().trim();
  const greetings = ['hi', 'hello', 'hey', 'namaste', 'greet', 'morning', 'evening', 'ok', 'hmm', 'thanks'];
  const offTopicKeywords = [
    'weather', 'joke', 'ipl', 'score', 'movie', 'film', 'song', 'news', 
    'price', 'buy', 'shop', 'game', 'play', 'code', 'python', 'javascript', 
    'programming', 'app', 'develop'
  ];

  const t = translations[language];

  // 1. Handle Strict Off-Topic Guardrail (Safety First)
  if (offTopicKeywords.some(kw => cleanQuery.includes(kw))) {
    return {
      answer: "I’m VoteGuide AI and I can help only with Indian voter guidance (eligibility, registration, polling booth, voter ID, election help). What would you like help with?",
      verified: true,
      attribution: "Local Guardrail",
      suggestions: getDefaultSuggestions()
    };
  }

  // 2. Local Knowledge Lookup (Deterministic Quick Actions & Known Patterns)
  const isFirstMessage = history.length === 0;
  const localAnswer = getAnswer(query, persona, mode, isFirstMessage);
  
  if (localAnswer) {
    return localAnswer;
  }

  // 3. Handle Casual Greetings (Local for speed)
  if (greetings.some(g => cleanQuery === g || cleanQuery.startsWith(g + ' '))) {
    return {
      answer: t['ans.greeting'],
      verified: true,
      attribution: "Local Greeting",
      suggestions: getDefaultSuggestions()
    };
  }

  // 4. Optional Backend Enhancement (Free-text Election Intent Routing)
  try {
    const response = await callBackendChat(query, history, persona, mode, language);
    if (response && response.answer) {
      return {
        ...response,
        suggestions: response.suggestions || getDefaultSuggestions()
      };
    }
  } catch (error) {
    console.warn('Backend chat unavailable, falling back to local mode:', error);
  }

  // 5. Stable Local Fallback (Final Safety)
  return {
    answer: t['ans.fallback'],
    verified: true,
    attribution: "Local Knowledge Base",
    suggestions: getDefaultSuggestions()
  };
};

const getDefaultSuggestions = () => [
  "Check Eligibility",
  "Find Polling Booth",
  "Register to Vote",
  "Required Documents",
  "Voter ID Help",
  "Election Dates",
  "Other Question"
];

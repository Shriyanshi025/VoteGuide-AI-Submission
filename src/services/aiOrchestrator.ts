import { getAnswer } from './knowledgeEngine';
import type { Message, PersonaType, ExplanationMode, AppLanguage, Attribution } from '../types';
import { translations } from '../i18n/translations';

/**
 * Orchestrates the AI response flow - STABLE LOCAL VERSION.
 * 1. Checks local verified knowledge engine.
 * 2. Provides friendly local fallback for everything else.
 * 3. NO external API dependencies.
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
  const offTopicKeywords = ['weather', 'joke', 'ipl', 'score', 'movie', 'film', 'song', 'news', 'price', 'buy', 'shop', 'game', 'play'];

  const t = translations[language];

  // 1. Handle Strict Off-Topic Guardrail
  if (offTopicKeywords.some(kw => cleanQuery.includes(kw))) {
    return {
      answer: "I’m VoteGuide AI and I can help only with Indian voter guidance (eligibility, registration, polling booth, voter ID, election help). What would you like help with?",
      verified: true,
      attribution: "Local Guardrail",
      suggestions: [
        "Check Eligibility",
        "Find Polling Booth",
        "Register to Vote",
        "Required Documents",
        "Voter ID Help",
        "Election Dates",
        "Other Question"
      ]
    };
  }

  // 2. Handle Casual Greetings
  if (greetings.some(g => cleanQuery === g || cleanQuery.startsWith(g + ' '))) {
    return {
      answer: t['ans.greeting'],
      verified: true,
      attribution: "Local Greeting",
      suggestions: [
        "Check Eligibility",
        "Find Polling Booth",
        "Register to Vote",
        "Required Documents",
        "Voter ID Help",
        "Election Dates",
        "Other Question"
      ]
    };
  }

  const isFirstMessage = history.length === 0;

  // 3. Local Knowledge Lookup (Verified)
  const localAnswer = getAnswer(query, persona, mode, isFirstMessage);
  
  if (localAnswer) {
    return localAnswer; // We might need to translate localAnswer here if it's dynamic
  }

  // 4. Stable Local Fallback (No External API)
  return {
    answer: t['ans.fallback'],
    verified: true,
    attribution: "Local Knowledge Base",
    suggestions: [
      "Check Eligibility",
      "Find Polling Booth",
      "Register to Vote",
      "Required Documents",
      "Voter ID Help",
      "Election Dates",
      "Other Question"
    ]
  };
};

import { getAttribution } from './trustLayer';
import { formatResponse, simplifyTerminology } from './explanationModeService';
import { getPersonaConfig } from './personaService';
import type { PersonaType, ExplanationMode, Attribution } from '../types';

/**
 * The central pipeline for generating verified answers.
 * Returns null if no local verified answer is found.
 */
export const getAnswer = (
  query: string,
  persona: PersonaType,
  mode: ExplanationMode,
  isFirstMessage: boolean = false
): Attribution | null => {
  // 1. Identify topic and get official attribution/content
  const attribution = getAttribution(query);
  const personaConfig = getPersonaConfig(persona);

  // If no local match, return null to trigger AI fallback
  if (!attribution) {
    return null;
  }

  // 2. Simplify terminology for accessibility/clarity
  let processedAnswer = simplifyTerminology(attribution.answer);

  // 3. Format based on explanation mode
  const finalAnswer = formatResponse(processedAnswer, mode, persona);

  // 4. Apply persona-specific tone adjustment (Greeting only on first message)
  // Never prepend greeting into every answer body if not the first message
  const themedAnswer = isFirstMessage 
    ? `${personaConfig.greeting}\n\n${finalAnswer}`
    : finalAnswer;

  return {
    answer: themedAnswer,
    attribution: attribution.attribution,
    verified: true
  };
};

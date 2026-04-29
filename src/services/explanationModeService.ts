import type { ExplanationMode, PersonaType } from '../types';

export interface ExplanationFormat {
  maxLength: number;
  useBulletPoints: boolean;
  includeOfficialCitations: boolean;
}

const MODE_CONFIGS: Record<ExplanationMode, ExplanationFormat> = {
  'simple': {
    maxLength: 2000, 
    useBulletPoints: true,
    includeOfficialCitations: false
  },
  'concise': {
    maxLength: 1000,
    useBulletPoints: true,
    includeOfficialCitations: true
  },
  'detailed': {
    maxLength: 4000,
    useBulletPoints: false,
    includeOfficialCitations: true
  }
};

/**
 * Formats content based on the selected explanation mode and voter persona.
 */
export const formatResponse = (content: string, mode: ExplanationMode, persona: PersonaType): string => {
  const config = MODE_CONFIGS[mode];
  let formatted = content.trim();

  // 1. Persona-based Logic (Behavioral Guidance)
  if (persona === 'busy') {
    // Strip everything except bullets for busy professionals
    const bulletLines = formatted.split('\n').filter(line => line.trim().startsWith('•') || line.trim().includes('────────'));
    if (bulletLines.length > 0) {
      formatted = bulletLines.join('\n');
    }
  } else if (persona === 'first-time') {
    // Ensure detailed/educational tone
    formatted = "Educational Guide: Let's break this down step-by-step.\n\n" + formatted;
  } else if (persona === 'elderly') {
    // Reassuring tone and simpler wording
    formatted = simplifyTerminology(formatted);
    formatted = "Don't worry, we are here to help you.\n\n" + formatted + "\n\nFeel free to ask your family for help or use our Voice Mode.";
  } else if (persona === 'accessibility') {
    // Highlight support services
    formatted = formatted + "\n\n♿ Accessibility Note: Assisted voting and wheelchair access are available at all polling booths. Call 1950 for specialized support.";
  }

  // 2. Explanation Mode Logic
  if (mode === 'simple') {
    formatted = simplifyTerminology(formatted);
  } else if (mode === 'concise') {
    const firstNewline = formatted.indexOf('\n');
    if (firstNewline > 0) {
      formatted = formatted.substring(0, firstNewline);
    }
  }

  // Final length guard
  if (formatted.length > config.maxLength) {
    formatted = formatted.substring(0, config.maxLength).trim() + "...";
  }

  return formatted;
};

/**
 * Simplifies complex terminology.
 */
export const simplifyTerminology = (text: string): string => {
  const terms: Record<string, string> = {
    'Electoral Registration Officer': 'Registration Officer',
    'Constituency': 'Voting Area',
    'EPIC': 'Voter ID Card',
    'Disqualification': 'Ineligibility',
    'Residential address': 'Home address'
  };

  let simplified = text;
  for (const [complex, simple] of Object.entries(terms)) {
    simplified = simplified.replace(new RegExp(complex, 'gi'), simple);
  }
  
  return simplified;
};

export type PersonaType = 'first-time' | 'busy' | 'elderly' | 'accessibility';
export type ExplanationMode = 'simple' | 'concise' | 'detailed';
export type ThemeMode = 'light' | 'dark';
export type AppLanguage = 'English' | 'Hindi' | 'Bengali' | 'Tamil' | 'Telugu';
export type SimulatorStep = 'verification' | 'ink' | 'evm' | 'confirm' | 'vvpat' | 'complete';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  source?: string;
  suggestions?: string[];
}

export interface UserPreferences {
  persona: PersonaType;
  explanationMode: ExplanationMode;
  theme: ThemeMode;
  fontScale: number;
  simpleMode: boolean;
  voiceEnabled: boolean;
  language: AppLanguage;
  currentView: string;
}

export interface RoadmapStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
}

export interface ReadinessState {
  eligibility: boolean;
  registration: boolean;
  documents: boolean;
  boothFound: boolean;
  reminderSet: boolean;
}

export interface RoadmapData {
  title: string;
  rules: string[];
  documents: string[];
  source: string;
  action?: string;
  portal?: string;
}

export interface RuleKnowledgeBase {
  version: string;
  lastUpdated: string;
  schema: {
    roadmap: Record<string, RoadmapData>;
    documents: {
      id_proofs: string[];
      source: string;
    };
    faqs: Array<{ q: string; a: string; source: string }>;
    common_misconceptions: Array<{ myth: string; fact: string; source: string }>;
    quick_checks: string[];
    supported_languages: string[];
  };
}

export interface Attribution {
  answer: string;
  attribution: string;
  verified: boolean;
  suggestions?: string[];
}

import type { PersonaType } from '../types';

export interface PersonaConfig {
  tone: string;
  focusAreas: string[];
  preferredFeatures: string[];
  verbosity: 'low' | 'medium' | 'high';
  greeting: string;
}

const PERSONA_CONFIGS: Record<PersonaType, PersonaConfig> = {
  'first-time': {
    tone: 'Educational, encouraging, and vibrant',
    focusAreas: ['Registration', 'Eligibility', 'First-time voting experience'],
    preferredFeatures: ['Journey Roadmap', 'Readiness Validator', 'Voting Simulator'],
    verbosity: 'high',
    greeting: 'Welcome to your first election! I am here to guide you through every step of becoming a voter.'
  },
  'busy': {
    tone: 'Concise, professional, and action-oriented',
    focusAreas: ['Deadlines', 'Booth Location', 'Quick ID checks'],
    preferredFeatures: ['Readiness Validator', 'Booth Finder', 'Reminders'],
    verbosity: 'low',
    greeting: 'Hello. I will keep it brief. What do you need to know for the upcoming election?'
  },
  'elderly': {
    tone: 'Patient, respectful, and simple',
    focusAreas: ['Booth Accessibility', 'Home Voting', 'Required Documents'],
    preferredFeatures: ['Booth Finder', 'Voice Mode', 'Journey Roadmap'],
    verbosity: 'medium',
    greeting: 'Greetings. I am here to assist you with the voting process and ensure you have all the support you need.'
  },
  'accessibility': {
    tone: 'Clear, assistive, and simplified',
    focusAreas: ['Voice Navigation', 'Simplified Rules', 'Support Services'],
    preferredFeatures: ['Voice Mode', 'Simple UI', 'Readiness Validator'],
    verbosity: 'high',
    greeting: 'Hello. I am your accessible guide. I can explain things simply and help you navigate the voting process.'
  }
};

export const getPersonaConfig = (persona: PersonaType): PersonaConfig => {
  return PERSONA_CONFIGS[persona];
};

export const APP_NAME = 'VoteGuide AI';

export const PERSONAS = {
  'first-time': { label: 'First-Time Voter', icon: 'voter-first' },
  'busy': { label: 'Busy Professional', icon: 'voter-busy' },
  'elderly': { label: 'Elderly Citizen', icon: 'voter-elderly' },
  'accessibility': { label: 'Accessibility Focused', icon: 'voter-accessibility' },
};

export const ROADMAP_STEPS = [
  { id: 'eligibility', label: 'Eligibility', description: 'Check if you can vote.' },
  { id: 'registration', label: 'Registration', description: 'Guide to Voter ID registration.' },
  { id: 'verification', label: 'Verification', description: 'Verify your name in the list.' },
  { id: 'booth', label: 'Booth Finder', description: 'Find where you need to go.' },
  { id: 'documents', label: 'Documents', description: 'What to carry to the booth.' },
  { id: 'vote', label: 'Voting Process', description: 'Step-by-step voting guide.' },
  { id: 'results', label: 'Results', description: 'How to track results.' },
] as const;

export const QUICK_ACTIONS = [
  "Am I eligible to vote?",
  "How to register for Voter ID?",
  "Check my name in Voter List",
  "Find my Polling Booth",
  "Documents required for voting",
  "How to use EVM/VVPAT?",
  "When are the election results?"
] as const;

export const STORAGE_KEYS = {
  SELECTED_PLACE: 'selectedPollingPlace',
  USER_PREFERENCES: 'voteguide-ui-storage',
  JOURNEY_STATE: 'voteguide-journey-storage',
  REMINDER: 'voteguide-reminder'
} as const;

export const GOOGLE_SERVICES = [
  "Google Cloud Run",
  "Google Maps Deep Links",
  "Optional Gemini Enhancement",
  "Optional Places Enhancement"
] as const;

export const PLACE_SEARCH_TERMS = [
  "election office",
  "government office",
  "municipal office",
  "collector office",
  "public school",
  "community center"
] as const;

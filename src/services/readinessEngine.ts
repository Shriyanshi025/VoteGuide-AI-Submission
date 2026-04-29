import type { ReadinessState } from '../types';

export interface ReadinessSummary {
  percent: number;
  completed: number;
  total: number;
  nextAction: string;
  missing: string[];
}

const ACTION_MAP: Record<string, string> = {
  eligibility: 'Verify your eligibility',
  registration: 'Complete Voter Registration (Form 6)',
  documents: 'Collect required documents',
  boothFound: 'Locate your polling booth'
};

const PRIORITY: (keyof ReadinessState)[] = [
  'eligibility',
  'registration',
  'documents',
  'boothFound'
];

/**
 * Calculates the readiness summary based on the current voter state.
 */
export const calculateReadiness = (state: ReadinessState): ReadinessSummary => {
  const completedKeys = PRIORITY.filter(key => state[key]);
  const missingKeys = PRIORITY.filter(key => !state[key]);
  
  const total = PRIORITY.length;
  const completed = completedKeys.length;
  const percent = Math.round((completed / total) * 100);
  
  const nextActionKey = PRIORITY.find(key => !state[key]);
  const nextAction = nextActionKey ? ACTION_MAP[nextActionKey] : 'You are fully ready to vote!';

  return {
    percent,
    completed,
    total,
    nextAction,
    missing: missingKeys.map(key => ACTION_MAP[key])
  };
};

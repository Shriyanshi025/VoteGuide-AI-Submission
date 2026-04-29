import type { SimulatorStep } from '../types';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  symbol: string;
}

export const MOCK_CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Arjun Sharma', party: 'Independent', symbol: '🚜' },
  { id: 'c2', name: 'Meera Deshmukh', party: 'Social Front', symbol: '🚲' },
  { id: 'c3', name: 'Karan Singh', party: 'Unity Party', symbol: '🐘' },
  { id: 'nota', name: 'None of the Above', party: '-', symbol: '🚫' }
];

export const getStepInstruction = (step: SimulatorStep): string => {
  switch (step) {
    case 'verification': return 'Hand over your ID to the polling officer for verification.';
    case 'ink': return 'The second officer will apply indelible ink on your left forefinger.';
    case 'evm': return 'Select your preferred candidate on the Electronic Voting Machine (EVM).';
    case 'confirm': return 'Please confirm your selection.';
    case 'vvpat': return 'Verify your vote on the VVPAT machine. The slip will be visible for 7 seconds.';
    case 'complete': return 'Thank you for participating in the democratic process.';
    default: return '';
  }
};

export const canProceed = (step: SimulatorStep, state: { selectedCandidate: string | null, hasInkMark: boolean }): boolean => {
  if (step === 'evm') return state.selectedCandidate !== null;
  if (step === 'ink') return state.hasInkMark;
  return true;
};

export const getCompletionMessage = (): string => {
  return "Your vote has been successfully recorded. In a real election, your vote is secret and secure.";
};

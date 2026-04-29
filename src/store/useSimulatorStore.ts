import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SimulatorStep } from '../types';

interface SimulatorState {
  currentStep: SimulatorStep;
  selectedCandidate: string | null;
  hasInkMark: boolean;
  voteConfirmed: boolean;
  vvpatVisible: boolean;
  
  nextStep: () => void;
  prevStep: () => void;
  selectCandidate: (id: string | null) => void;
  confirmVote: () => void;
  setVVPATVisible: (visible: boolean) => void;
  resetSimulation: () => void;
}

const STEPS: SimulatorStep[] = ['verification', 'ink', 'evm', 'confirm', 'vvpat', 'complete'];

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set) => ({
      currentStep: 'verification',
      selectedCandidate: null,
      hasInkMark: false,
      voteConfirmed: false,
      vvpatVisible: false,

      nextStep: () => set((state) => {
        const currentIndex = STEPS.indexOf(state.currentStep);
        const nextIndex = Math.min(currentIndex + 1, STEPS.length - 1);
        return { currentStep: STEPS[nextIndex] };
      }),

      prevStep: () => set((state) => {
        const currentIndex = STEPS.indexOf(state.currentStep);
        const prevIndex = Math.max(currentIndex - 1, 0);
        return { currentStep: STEPS[prevIndex] };
      }),

      selectCandidate: (id) => set({ selectedCandidate: id }),

      confirmVote: () => set({ voteConfirmed: true }),

      setVVPATVisible: (vvpatVisible) => set({ vvpatVisible }),

      resetSimulation: () => set({
        currentStep: 'verification',
        selectedCandidate: null,
        hasInkMark: false,
        voteConfirmed: false,
        vvpatVisible: false,
      }),
    }),
    {
      name: 'voteguide-simulator-storage',
    }
  )
);

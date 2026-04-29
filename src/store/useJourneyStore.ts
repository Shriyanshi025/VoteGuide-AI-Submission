import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RoadmapStep, ReadinessState } from '../types';
import { ROADMAP_STEPS } from '../utils/constants';

interface JourneyState {
  steps: RoadmapStep[];
  readiness: ReadinessState;
  currentStepId: string;
  
  updateStepStatus: (id: string, status: RoadmapStep['status']) => void;
  updateReadiness: (update: Partial<ReadinessState>) => void;
  setCurrentStepId: (id: string) => void;
  resetJourney: () => void;
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      steps: ROADMAP_STEPS.map(step => ({ ...step, status: 'pending' })),
      readiness: {
        eligibility: false,
        registration: false,
        documents: false,
        boothFound: false,
        reminderSet: false,
      },
      currentStepId: 'eligibility',

      updateStepStatus: (id, status) => set((state) => ({
        steps: state.steps.map(step => step.id === id ? { ...step, status } : step)
      })),

      updateReadiness: (update) => set((state) => ({
        readiness: { ...state.readiness, ...update }
      })),

      setCurrentStepId: (currentStepId) => set({ currentStepId }),

      resetJourney: () => set({
        steps: ROADMAP_STEPS.map(step => ({ ...step, status: 'pending' })),
        readiness: {
          eligibility: false,
          registration: false,
          documents: false,
          boothFound: false,
          reminderSet: false,
        },
        currentStepId: 'eligibility',
      }),
    }),
    {
      name: 'voteguide-journey-storage',
    }
  )
);

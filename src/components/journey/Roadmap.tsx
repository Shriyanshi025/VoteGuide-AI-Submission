import React from 'react';
import { useJourneyStore } from '../../store/useJourneyStore';
import { RoadmapStepCard } from './RoadmapStepCard';

export const Roadmap: React.FC = () => {
  const steps = useJourneyStore(state => state.steps);
  const currentStepId = useJourneyStore(state => state.currentStepId);
  const setCurrentStepId = useJourneyStore(state => state.setCurrentStepId);

  return (
    <div className="roadmap-container">
      {steps.map((step) => (
        <RoadmapStepCard 
          key={step.id} 
          step={step} 
          isActive={step.id === currentStepId}
          onClick={() => setCurrentStepId(step.id)}
        />
      ))}
    </div>
  );
};

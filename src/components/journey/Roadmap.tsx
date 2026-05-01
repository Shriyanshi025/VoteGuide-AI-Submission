import React from 'react';
import { useJourneyStore } from '../../store/useJourneyStore';
import { RoadmapStepCard } from './RoadmapStepCard';

export const Roadmap: React.FC = () => {
  const steps = useJourneyStore(state => state.steps);
  const readiness = useJourneyStore(state => state.readiness);
  const currentStepId = useJourneyStore(state => state.currentStepId);
  const setCurrentStepId = useJourneyStore(state => state.setCurrentStepId);

  return (
    <div className="roadmap-container">
      {readiness.boothFound && (
        <div style={{ 
          background: 'var(--primary-light)', 
          padding: 'var(--space-sm)', 
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-md)',
          fontSize: '0.85rem',
          color: 'var(--primary)',
          textAlign: 'center',
          fontWeight: 600
        }}>
          ✅ Polling help location selected successfully.
        </div>
      )}
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

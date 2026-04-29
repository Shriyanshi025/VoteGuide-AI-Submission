import React from 'react';
import type { RoadmapStep } from '../../types';
import { useJourneyStore } from '../../store/useJourneyStore';
import { useUIStore } from '../../store/useUIStore';

interface RoadmapStepCardProps {
  step: RoadmapStep;
  isActive: boolean;
  onClick: () => void;
}

const STEP_CTA: Record<string, string> = {
  eligibility: 'Verify Eligibility',
  registration: 'Start Form 6',
  verification: 'Check Voter List',
  booth: 'Find Polling Booth',
  documents: 'Check Documents',
  vote: 'Watch Guide',
  results: 'Track Results'
};

export const RoadmapStepCard: React.FC<RoadmapStepCardProps> = ({ step, isActive, onClick }) => {
  const isCompleted = step.status === 'completed';
  const updateStepStatus = useJourneyStore(state => state.updateStepStatus);
  const updateReadiness = useJourneyStore(state => state.updateReadiness);
  const setCurrentView = useUIStore(state => state.setCurrentView);

  const handleCTA = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Feature navigation logic
    if (step.id === 'booth') {
      setCurrentView('tools');
      return;
    }

    // Default completion logic for mock phase
    updateStepStatus(step.id, 'completed');
    
    if (step.id === 'eligibility') updateReadiness({ eligibility: true });
    if (step.id === 'registration') updateReadiness({ registration: true });
    if (step.id === 'documents') updateReadiness({ documents: true });
    if (step.id === 'booth') updateReadiness({ boothFound: true });
  };
  
  return (
    <div 
      className={`step-card card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
      onClick={onClick}
    >
      <div className="step-number">
        {isCompleted ? '✓' : ''}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1rem', margin: 0 }}>{step.label}</h3>
        <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.7 }}>{step.description}</p>
        
        {isActive && !isCompleted && (
          <button 
            className="cta-button"
            onClick={handleCTA}
          >
            {STEP_CTA[step.id] || 'Mark as Done'}
          </button>
        )}
      </div>
    </div>
  );
};

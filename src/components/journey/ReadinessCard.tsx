import React from 'react';
import { useJourneyStore } from '../../store/useJourneyStore';
import { calculateReadiness } from '../../services/readinessEngine';

export const ReadinessCard: React.FC = () => {
  const readiness = useJourneyStore(state => state.readiness);
  const summary = calculateReadiness(readiness);

  return (
    <div className="card" style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
      <div 
        className="circular-progress" 
        style={{ '--percent': summary.percent } as React.CSSProperties}
      >
        <div className="progress-value">{summary.percent}%</div>
      </div>
      
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-xs)' }}>Voter Readiness</h2>
        <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--primary)', fontWeight: 600 }}>
          {summary.nextAction}
        </p>
        <div style={{ fontSize: '0.75rem', marginTop: 'var(--space-xs)', opacity: 0.7 }}>
          {summary.completed} of {summary.total} steps completed
        </div>
      </div>
    </div>
  );
};

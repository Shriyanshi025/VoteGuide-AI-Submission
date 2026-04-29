import React, { useEffect } from 'react';
import type { Candidate } from '../../services/simulatorEngine';

interface VVPATSlipProps {
  candidate: Candidate;
  onComplete: () => void;
}

export const VVPATSlip: React.FC<VVPATSlipProps> = ({ candidate, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-center" style={{ flexDirection: 'column', padding: 'var(--space-xl)' }}>
      <div 
        className="card"
        style={{
          width: '200px',
          padding: 'var(--space-md)',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          animation: 'slideDown 0.5s ease-out',
          color: '#333',
          textAlign: 'center'
        }}
      >
        <div style={{ borderBottom: '1px dashed #ccc', paddingBottom: '8px', marginBottom: '8px', fontSize: '0.7rem' }}>
          VVPAT SYSTEM SLIP
        </div>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{candidate.symbol}</div>
        <div style={{ fontWeight: 'bold' }}>{candidate.name}</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{candidate.party}</div>
        <div style={{ marginTop: '12px', color: 'green', fontSize: '1.2rem' }}>✔️</div>
      </div>
      
      <p style={{ marginTop: 'var(--space-lg)', textAlign: 'center', opacity: 0.7 }}>
        The slip will drop into the sealed box automatically...
      </p>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

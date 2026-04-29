import React from 'react';

interface CandidateCardProps {
  name: string;
  party: string;
  symbol: string;
  selected: boolean;
  onSelect: () => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ 
  name, party, symbol, selected, onSelect 
}) => {
  return (
    <button
      onClick={onSelect}
      className={`card ${selected ? 'active' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        width: '100%',
        padding: 'var(--space-md)',
        textAlign: 'left',
        border: selected ? '2px solid var(--primary)' : '1px solid var(--border)',
        backgroundColor: selected ? 'var(--primary-light)' : 'var(--bg-card)',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      aria-pressed={selected}
    >
      <div style={{ fontSize: '2rem', minWidth: '50px', textAlign: 'center' }}>
        {symbol}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{name}</h3>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>{party}</p>
      </div>
      <div 
        style={{ 
          width: '20px', 
          height: '20px', 
          borderRadius: '50%', 
          border: '2px solid var(--primary)',
          backgroundColor: selected ? 'var(--primary)' : 'transparent'
        }} 
      />
    </button>
  );
};

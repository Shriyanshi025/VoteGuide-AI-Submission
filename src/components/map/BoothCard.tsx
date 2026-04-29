import React from 'react';
import { speak } from '../../api/speech';
import { useUIStore } from '../../store/useUIStore';

interface BoothCardProps {
  booth: {
    id: string;
    n: string; // name
    a: string; // address
    d: number; // distanceKm
    ac: { // accessibility
      wheelchair: boolean;
      ramp: boolean;
    };
    u: string; // directionsUrl
  };
}

export const BoothCard: React.FC<BoothCardProps> = ({ booth }) => {
  const language = useUIStore(state => state.language);

  const handleReadDetails = () => {
    const text = `Booth name: ${booth.n}. Address: ${booth.a}. Distance: ${booth.d} kilometers away. Accessibility: ${booth.ac.wheelchair ? 'Wheelchair accessible' : 'Limited accessibility'}.`;
    speak(text, language);
  };

  return (
    <div className="card" style={{ marginBottom: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{booth.n}</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>
          {booth.d} km
        </span>
      </div>
      
      <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: '8px 0' }}>{booth.a}</p>
      
      <div style={{ display: 'flex', gap: 'var(--space-sm)', margin: '12px 0' }}>
        {booth.ac.wheelchair && (
          <span style={{ fontSize: '0.75rem', background: '#e1f5fe', color: '#01579b', padding: '2px 8px', borderRadius: '12px' }}>
            ♿ Wheelchair Accessible
          </span>
        )}
        {booth.ac.ramp && (
          <span style={{ fontSize: '0.75rem', background: '#e8f5e9', color: '#1b5e20', padding: '2px 8px', borderRadius: '12px' }}>
            ↗️ Ramp Available
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button 
          className="cta-button" 
          style={{ flex: 2 }}
          onClick={() => window.open(booth.u, '_blank')}
        >
          📍 Open in Maps
        </button>
        <button 
          className="card" 
          style={{ flex: 1, padding: 'var(--space-xs)', fontSize: '1.2rem' }}
          onClick={handleReadDetails}
          aria-label="Read details aloud"
        >
          🔊
        </button>
      </div>
    </div>
  );
};

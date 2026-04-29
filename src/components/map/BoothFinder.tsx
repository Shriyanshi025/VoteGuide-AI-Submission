import React from 'react';
import { useLocation } from '../../hooks/useLocation';

export const BoothFinder: React.FC = () => {
  const { coords, loading: locLoading, error: locError, getLocation } = useLocation();

  const mapsUrl = coords 
    ? `https://www.google.com/maps/search/polling+booth/@${coords.lat},${coords.lng},15z`
    : '#';

  return (
    <div className="booth-finder">
      {!coords ? (
        <div className="card flex-center" style={{ flexDirection: 'column', padding: 'var(--space-xl)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📍</div>
          <h2>Find Your Booth</h2>
          <p style={{ opacity: 0.7, marginBottom: 'var(--space-lg)' }}>
            We use your location to help you find the nearest polling station.
          </p>
          <button 
            className="cta-button" 
            onClick={getLocation} 
            disabled={locLoading}
            style={{ padding: 'var(--space-md)' }}
          >
            {locLoading ? 'Detecting Location...' : 'Grant Location Access'}
          </button>
          {locError && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: 'var(--space-md)' }}>{locError}</p>}
        </div>
      ) : (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-md)' }}>
            <span style={{ fontSize: '1.5rem' }}>📍</span>
            <div>
              <h3 style={{ margin: 0 }}>Location Detected</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>
                Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--primary-light)', padding: 'var(--space-md)', borderRadius: '8px', marginBottom: 'var(--space-md)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              <strong>Official Guidance:</strong> Your polling booth is typically located in the government school, community center, or municipal office nearest to your registered address.
            </p>
          </div>

          <a 
            href={mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="cta-button"
            style={{ 
              display: 'block', 
              textAlign: 'center', 
              textDecoration: 'none',
              background: '#4285F4' // Google Blue
            }}
          >
            🗺️ View on Google Maps
          </a>
          
          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 'var(--space-md)', textAlign: 'center' }}>
            Clicking above will open official polling station locations near you in Google Maps.
          </p>
        </div>
      )}
    </div>
  );
};

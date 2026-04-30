import React from 'react';
import { useLocation } from '../../hooks/useLocation';
import { getElectionOfficeUrl, getGovernmentOfficeUrl, getPollingStationUrl, getFallbackMapsUrl } from '../../utils/mapUtils';

export const BoothFinder: React.FC = () => {
  const { coords, loading: locLoading, error: locError, getLocation } = useLocation();

  const electionUrl = coords ? getElectionOfficeUrl(coords.lat, coords.lng) : '#';
  const governmentUrl = coords ? getGovernmentOfficeUrl(coords.lat, coords.lng) : '#';
  const stationUrl = coords ? getPollingStationUrl(coords.lat, coords.lng) : '#';
  const fallbackUrl = getFallbackMapsUrl();

  return (
    <div className="booth-finder">
      {!coords ? (
        <div className="card flex-center" style={{ flexDirection: 'column', padding: 'var(--space-xl)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📍</div>
          <h2>Find Your Booth</h2>
          <p style={{ opacity: 0.7, marginBottom: 'var(--space-lg)' }}>
            Detect your location to find nearby election offices and guidance centers.
          </p>
          <button 
            className="cta-button" 
            onClick={getLocation} 
            disabled={locLoading}
            style={{ padding: 'var(--space-md)', width: '100%', marginBottom: 'var(--space-md)' }}
          >
            {locLoading ? 'Detecting Location...' : 'Detect Location'}
          </button>
          
          <div style={{ marginTop: 'var(--space-md)' }}>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Or search manually:</p>
            <a 
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.9rem' }}
            >
              Open Google Maps manually
            </a>
          </div>

          {locError && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: 'var(--space-md)' }}>{locError}</p>}
        </div>
      ) : (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-md)' }}>
            <span style={{ fontSize: '1.5rem' }}>📍</span>
            <div>
              <h3 style={{ margin: 0 }}>Location detected</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>
                Latitude: {coords.lat.toFixed(4)}<br />
                Longitude: {coords.lng.toFixed(4)}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--primary-light)', padding: 'var(--space-md)', borderRadius: '8px', marginBottom: 'var(--space-md)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
              <strong>Important:</strong> Polling booths may not always appear as permanent places on Google Maps. Use these links to find nearby election/government help centers, and verify your final booth from your voter slip or official voter portal.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <a 
              href={electionUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button"
              style={{ textAlign: 'center', textDecoration: 'none', background: '#4285F4', color: 'white' }}
            >
              Find nearby Election Office
            </a>

            <a 
              href={governmentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button"
              style={{ textAlign: 'center', textDecoration: 'none', background: '#34A853', color: 'white' }}
            >
              Find nearby Government Office
            </a>

            <a 
              href={stationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button"
              style={{ textAlign: 'center', textDecoration: 'none', background: '#FBBC05', color: 'black' }}
            >
              Search Polling Station
            </a>
          </div>
          
          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 'var(--space-md)', textAlign: 'center' }}>
            Links open Google Maps search for reliable election infrastructure near your coordinates.
          </p>
        </div>
      )}
    </div>
  );
};

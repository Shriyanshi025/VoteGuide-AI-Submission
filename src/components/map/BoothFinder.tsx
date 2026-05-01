import React, { useState, useEffect } from 'react';
import { useLocation } from '../../hooks/useLocation';
import { getElectionOfficeUrl, getGovernmentOfficeUrl, getPollingStationUrl, getFallbackMapsUrl } from '../../utils/mapUtils';
import { getNearbyPlaces } from '../../api/backendClient';
import { useJourneyStore } from '../../store/useJourneyStore';

export const BoothFinder: React.FC = () => {
  const { coords, loading: locLoading, error: locError, getLocation } = useLocation();
  const [places, setPlaces] = useState<any[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);
  
  const updateStepStatus = useJourneyStore(state => state.updateStepStatus);
  const updateReadiness = useJourneyStore(state => state.updateReadiness);

  useEffect(() => {
    if (coords) {
      fetchNearbyPlaces(coords.lat, coords.lng);
    }
  }, [coords]);

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    setLoadingPlaces(true);
    setPlacesError(null);
    try {
      const data = await getNearbyPlaces(lat, lng);
      setPlaces(data.places || []);
      if (!data.places || data.places.length === 0) {
        setPlacesError("Could not load live suggestions. You can still use Google Maps links below.");
      }
    } catch (err) {
      setPlacesError("Could not load live suggestions. You can still use Google Maps links below.");
    } finally {
      setLoadingPlaces(false);
    }
  };

  const handleSelectPlace = (place: any) => {
    const selectedPlace = {
      ...place,
      selectedAt: new Date().toISOString()
    };
    localStorage.setItem('selectedPollingPlace', JSON.stringify(selectedPlace));
    
    // Mark journey step complete
    updateStepStatus('booth', 'completed');
    updateReadiness({ boothFound: true });
    
    alert(`Selected: ${place.name}. This has been marked as your polling location in your journey!`);
  };

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

          {/* Live Places Suggestions */}
          <div className="live-places" style={{ marginBottom: 'var(--space-lg)' }}>
            <h4 style={{ marginBottom: 'var(--space-sm)' }}>Nearby Polling Help Locations</h4>
            
            {loadingPlaces && (
              <div style={{ padding: 'var(--space-md)', textAlign: 'center', opacity: 0.7 }}>
                <p>Searching nearby election help centers...</p>
              </div>
            )}

            {placesError && !loadingPlaces && (
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 'var(--space-md)' }}>
                {placesError}
              </p>
            )}

            {places.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                {places.map(place => (
                  <div key={place.id} className="card" style={{ border: '1px solid var(--primary-light)', padding: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h5 style={{ margin: 0, color: 'var(--primary)' }}>{place.name}</h5>
                      <span style={{ fontSize: '0.7rem', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                        {place.type}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: '8px 0' }}>{place.address}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="cta-button" 
                        style={{ flex: 1, padding: 'var(--space-xs)', fontSize: '0.8rem' }}
                        onClick={() => window.open(place.mapsUrl, '_blank')}
                      >
                        Open in Maps
                      </button>
                      <button 
                        className="cta-button" 
                        style={{ flex: 1, padding: 'var(--space-xs)', fontSize: '0.8rem', background: 'var(--primary)', color: 'white' }}
                        onClick={() => handleSelectPlace(place)}
                      >
                        Select this place
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loadingPlaces && places.length === 0 && !placesError && (
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: 'var(--space-md)' }}>
                Live suggestions are not available here yet. You can still use the Google Maps links below.
              </p>
            )}

            <p style={{ fontSize: '0.75rem', opacity: 0.8, background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginTop: 'var(--space-sm)' }}>
              <strong>Note:</strong> These are suggested civic/election help locations. Final polling booth should be verified from your voter slip or official voter portal.
            </p>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #eee', marginBottom: 'var(--space-lg)' }} />

          <h4 style={{ marginBottom: 'var(--space-sm)' }}>Standard Search Links (Fallback)</h4>
          <div style={{ background: 'var(--primary-light)', padding: 'var(--space-md)', borderRadius: '8px', marginBottom: 'var(--space-md)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
              <strong>Note:</strong> If live suggestions aren't available, use these links to find reliable election infrastructure.
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


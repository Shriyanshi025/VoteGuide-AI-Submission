import React, { useState, useEffect } from 'react';
import { useLocation } from '../../hooks/useLocation';
import { getElectionOfficeUrl, getGovernmentOfficeUrl, getPollingStationUrl, getFallbackMapsUrl } from '../../utils/mapUtils';
import { getNearbyPlaces } from '../../api/backendClient';
import { useJourneyStore } from '../../store/useJourneyStore';
import { useUIStore } from '../../store/useUIStore';
import { STORAGE_KEYS } from '../../utils/constants';
import type { PlaceResult } from '../../types';

export const BoothFinder: React.FC = () => {
  const { coords, loading: locLoading, error: locError, getLocation } = useLocation();
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  
  const updateStepStatus = useJourneyStore(state => state.updateStepStatus);
  const updateReadiness = useJourneyStore(state => state.updateReadiness);
  const setCurrentView = useUIStore(state => state.setCurrentView);

  useEffect(() => {
    if (coords) {
      fetchNearbyPlaces(coords.lat, coords.lng);
    }
  }, [coords]);

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    setLoadingPlaces(true);
    try {
      const data = await getNearbyPlaces(lat, lng);
      setPlaces(data.places || []);
    } catch (err) {
      // Fallback-safe: If Places API fails, we still show the Google Maps deep-links below
      setPlaces([]);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const handleSelectPlace = (place: PlaceResult) => {
    const selectedPlace: PlaceResult = {
      ...place,
      selectedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.SELECTED_PLACE, JSON.stringify(selectedPlace));
    
    // Mark journey step complete
    updateStepStatus('booth', 'completed');
    updateReadiness({ boothFound: true });
    
    // Navigate to Journey tab
    setCurrentView('journey');
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
            {loadingPlaces ? (
              <div style={{ padding: 'var(--space-md)', textAlign: 'center', opacity: 0.7 }}>
                <p>Searching nearby election help centers...</p>
              </div>
            ) : places.length > 0 ? (
              <>
                <h4 style={{ marginBottom: 'var(--space-sm)' }}>Nearby Polling Help Locations</h4>
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
              </>
            ) : (
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 'var(--space-md)', textAlign: 'center' }}>
                Live suggestions are unavailable for this location. You can still use the map links below.
              </p>
            )}
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #eee', marginBottom: 'var(--space-md)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <a 
              href={electionUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button"
              style={{ textAlign: 'center', textDecoration: 'none', background: '#4285F4', color: 'white', fontSize: '0.9rem' }}
            >
              Find nearby Election Office
            </a>

            <a 
              href={governmentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button"
              style={{ textAlign: 'center', textDecoration: 'none', background: '#34A853', color: 'white', fontSize: '0.9rem' }}
            >
              Find nearby Government Office
            </a>

            <a 
              href={stationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button"
              style={{ textAlign: 'center', textDecoration: 'none', background: '#FBBC05', color: 'black', fontSize: '0.9rem' }}
            >
              Search Polling Station
            </a>
          </div>
          
          <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: 'var(--space-lg)', textAlign: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
            <strong>Important:</strong> Please verify your final polling booth from your voter slip or official voter portal.
          </p>
        </div>
      )}
    </div>
  );
};


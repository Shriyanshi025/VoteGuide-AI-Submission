
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BoothFinder } from '../components/map/BoothFinder';
import * as backendClient from '../api/backendClient';
import { useLocation } from '../hooks/useLocation';

// Mock the useLocation hook
vi.mock('../hooks/useLocation', () => ({
  useLocation: vi.fn()
}));

// Mock the backendClient
vi.mock('../api/backendClient', () => ({
  getNearbyPlaces: vi.fn()
}));

describe('BoothFinder Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLocation as any).mockReturnValue({
      coords: null,
      loading: false,
      error: null,
      getLocation: vi.fn()
    });
  });

  it('renders initial detect location button', () => {
    render(<BoothFinder />);
    expect(screen.getByText(/Find Your Booth/i)).toBeDefined();
    expect(screen.getByText(/Detect Location/i)).toBeDefined();
  });

  it('renders fallback buttons when location is detected', async () => {
    (useLocation as any).mockReturnValue({
      coords: { lat: 12.97, lng: 77.59 },
      loading: false,
      error: null,
      getLocation: vi.fn()
    });
    
    (backendClient.getNearbyPlaces as any).mockResolvedValue({ places: [] });

    render(<BoothFinder />);
    
    expect(screen.getByText(/Location detected/i)).toBeDefined();
    expect(screen.getByText(/Find nearby Election Office/i)).toBeDefined();
    expect(screen.getByText(/Find nearby Government Office/i)).toBeDefined();
    expect(screen.getByText(/Search Polling Station/i)).toBeDefined();
  });

  it('renders live places when API returns results', async () => {
    (useLocation as any).mockReturnValue({
      coords: { lat: 12.97, lng: 77.59 },
      loading: false,
      error: null,
      getLocation: vi.fn()
    });

    const mockPlaces = [
      { id: '1', name: 'Live Election Office', address: '123 Street', type: 'Government Office', mapsUrl: 'http://maps.com' }
    ];
    (backendClient.getNearbyPlaces as any).mockResolvedValue({ places: mockPlaces });

    render(<BoothFinder />);

    await waitFor(() => {
      expect(screen.getByText('Live Election Office')).toBeDefined();
      expect(screen.getByText('Nearby Polling Help Locations')).toBeDefined();
      expect(screen.getByText('Select this place')).toBeDefined();
    });
    
    // Ensure fallback buttons are STILL there (Correction 1)
    expect(screen.getByText(/Find nearby Election Office/i)).toBeDefined();
  });

  it('marks journey step complete and redirects to journey tab when a place is selected', async () => {
    (useLocation as any).mockReturnValue({
      coords: { lat: 12.97, lng: 77.59 },
      loading: false,
      error: null,
      getLocation: vi.fn()
    });

    const mockPlaces = [
      { id: '1', name: 'Live Election Office', address: '123 Street', type: 'Government Office', mapsUrl: 'http://maps.com' }
    ];
    (backendClient.getNearbyPlaces as any).mockResolvedValue({ places: mockPlaces });

    render(<BoothFinder />);

    await waitFor(() => {
      const selectButton = screen.getByText('Select this place');
      fireEvent.click(selectButton);
    });

    // Verify localStorage
    const stored = JSON.parse(localStorage.getItem('selectedPollingPlace') || '{}');
    expect(stored.name).toBe('Live Election Office');
    
    // Verify Journey state via hook (mocked or actual)
    // Since we use the actual store, we can check it
    const journey = (await import('../store/useJourneyStore')).useJourneyStore.getState();
    expect(journey.readiness.boothFound).toBe(true);
    
    // Verify UI Tab redirection
    const ui = (await import('../store/useUIStore')).useUIStore.getState();
    expect(ui.currentView).toBe('journey');
  });
});

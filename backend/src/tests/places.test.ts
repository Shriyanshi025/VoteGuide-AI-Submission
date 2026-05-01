
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findNearbyElectionPlaces } from '../services/placesOptionalService';
import axios from 'axios';

vi.mock('axios');

describe('Places Optional Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_MAPS_API_KEY = 'fake-maps-key';
    process.env.GOOGLE_PLACES_SERVER_KEY = 'fake-server-key';
  });

  it('should return [] if both API keys are missing', async () => {
    delete process.env.GOOGLE_MAPS_API_KEY;
    delete process.env.GOOGLE_PLACES_SERVER_KEY;
    const result = await findNearbyElectionPlaces(12.97, 77.59);
    expect(result).toEqual([]);
  });

  it('should prefer GOOGLE_PLACES_SERVER_KEY over GOOGLE_MAPS_API_KEY', async () => {
    (axios.get as any).mockResolvedValueOnce({
      data: { status: 'OK', results: [] }
    });

    await findNearbyElectionPlaces(12.97, 77.59);
    
    const callArgs = (axios.get as any).mock.calls[0][1];
    expect(callArgs.params.key).toBe('fake-server-key');
  });

  it('should return normalized places on success', async () => {
    (axios.get as any).mockResolvedValueOnce({
      data: {
        status: 'OK',
        results: [
          {
            place_id: 'p1',
            name: 'Legacy Office 1',
            vicinity: '123 Test St',
            geometry: { location: { lat: 12.98, lng: 77.60 } },
            types: ['government_office']
          }
        ]
      }
    });

    const result = await findNearbyElectionPlaces(12.97, 77.59);
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
    expect(result[0].name).toBe('Legacy Office 1');
    expect(result[0].type).toBe('Government Office');
  });

  it('should handle API errors gracefully', async () => {
    (axios.get as any).mockRejectedValue(new Error('Network error'));
    const result = await findNearbyElectionPlaces(12.97, 77.59);
    expect(result).toEqual([]);
  });

  it('should combine unique results from multiple terms', async () => {
    (axios.get as any)
      .mockResolvedValueOnce({
        data: {
          status: 'OK',
          results: [{ place_id: 'p1', name: 'Place 1' }]
        }
      })
      .mockResolvedValueOnce({
        data: {
          status: 'OK',
          results: [{ place_id: 'p2', name: 'Place 2' }]
        }
      });

    const result = await findNearbyElectionPlaces(12.97, 77.59);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findNearbyElectionPlaces } from '../services/placesOptionalService';

describe('Places Optional Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_MAPS_API_KEY = 'fake-key';
  });

  it('should return empty list if API key is missing', async () => {
    delete process.env.GOOGLE_MAPS_API_KEY;
    const result = await findNearbyElectionPlaces(12.97, 77.59);
    expect(result).toEqual([]);
  });

  it('should return normalized places on success and limit to 5', async () => {
    // Mock global fetch with 6 places (2 duplicates by ID)
    const mockResponse = {
      ok: true,
      json: async () => ({
        places: [
          { id: 'p1', displayName: { text: 'Office 1' }, location: { latitude: 12.98, longitude: 77.60 } },
          { id: 'p1', displayName: { text: 'Office 1 Duplicate' }, location: { latitude: 12.98, longitude: 77.60 } },
          { id: 'p2', displayName: { text: 'Office 2' }, location: { latitude: 12.99, longitude: 77.61 } },
          { id: 'p3', displayName: { text: 'Office 3' }, location: { latitude: 12.95, longitude: 77.55 } },
          { id: 'p4', displayName: { text: 'Office 4' }, location: { latitude: 12.94, longitude: 77.54 } },
          { id: 'p5', displayName: { text: 'Office 5' }, location: { latitude: 12.93, longitude: 77.53 } },
          { id: 'p6', displayName: { text: 'Office 6' }, location: { latitude: 12.92, longitude: 77.52 } },
        ]
      })
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await findNearbyElectionPlaces(12.97, 77.59);
    
    expect(result).toHaveLength(5); // Limited to 5
    expect(result[0].id).toBe('p1');
    expect(result[1].id).toBe('p2');
    // Ensure fetch was called with correct coordinates
    const callArgs = (global.fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.locationBias.circle.center.latitude).toBe(12.97);
    expect(body.locationBias.circle.center.longitude).toBe(77.59);
    // Ensure query contains broadened terms
    expect(body.textQuery).toContain('polling station');
    expect(body.textQuery).toContain('public school');
  });

  it('should return empty list on API error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    const result = await findNearbyElectionPlaces(12.97, 77.59);
    expect(result).toEqual([]);
  });

  it('should return empty list on fetch failure/exception', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));
    
    const result = await findNearbyElectionPlaces(12.97, 77.59);
    expect(result).toEqual([]);
  });

  it('should handle timeout gracefully', async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        setTimeout(() => reject(err), 10);
      });
    });

    const result = await findNearbyElectionPlaces(12.97, 77.59);
    expect(result).toEqual([]);
  });
});

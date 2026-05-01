
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

  it('should return normalized places on success', async () => {
    // Mock global fetch
    const mockResponse = {
      ok: true,
      json: async () => ({
        places: [
          {
            id: 'p1',
            displayName: { text: 'Test Office' },
            formattedAddress: '123 Test St',
            location: { latitude: 12.98, longitude: 77.60 },
            types: ['government_office']
          }
        ]
      })
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await findNearbyElectionPlaces(12.97, 77.59);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'p1',
      name: 'Test Office',
      address: '123 Test St',
      lat: 12.98,
      lng: 77.60,
      mapsUrl: expect.stringContaining('p1'),
      type: 'Government Office'
    });
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

import { describe, it, expect } from 'vitest';
import { getBoothMapsUrl, getFallbackMapsUrl } from '../utils/mapUtils';

describe('Booth Finder Map URLs', () => {
  it('should generate correct Google Maps search URL from coordinates', () => {
    const lat = 21.19;
    const lng = 81.35;
    const expected = 'https://www.google.com/maps/search/polling+booth/@21.19,81.35,15z';
    const result = getBoothMapsUrl(lat, lng);
    
    expect(result).toBe(expected);
  });

  it('should provide the correct fallback URL for manual search', () => {
    const expected = 'https://www.google.com/maps/search/polling+booth+near+me';
    const result = getFallbackMapsUrl();
    
    expect(result).toBe(expected);
  });

  it('should be deterministic and not require any API keys', () => {
    // This is more of a logical test - ensuring the utility functions don't use process.env
    // or external services.
    const result = getBoothMapsUrl(0, 0);
    expect(result).not.toContain('key=');
    expect(result).toContain('google.com/maps/search');
  });
});

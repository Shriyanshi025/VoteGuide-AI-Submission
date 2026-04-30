import { describe, it, expect } from 'vitest';
import { getElectionOfficeUrl, getGovernmentOfficeUrl, getPollingStationUrl, getFallbackMapsUrl } from '../utils/mapUtils';

describe('Booth Finder Map URLs', () => {
  const lat = 21.19;
  const lng = 81.35;

  it('should generate correct Election Office URL', () => {
    const expected = 'https://www.google.com/maps/search/election+office+near+me/@21.19,81.35,14z';
    expect(getElectionOfficeUrl(lat, lng)).toBe(expected);
  });

  it('should generate correct Government Office URL', () => {
    const expected = 'https://www.google.com/maps/search/government+office+near+me/@21.19,81.35,14z';
    expect(getGovernmentOfficeUrl(lat, lng)).toBe(expected);
  });

  it('should generate correct Polling Station URL', () => {
    const expected = 'https://www.google.com/maps/search/polling+station+near+me/@21.19,81.35,14z';
    expect(getPollingStationUrl(lat, lng)).toBe(expected);
  });

  it('should provide the correct fallback URL for manual search', () => {
    const expected = 'https://www.google.com/maps/search/election+office+near+me';
    expect(getFallbackMapsUrl()).toBe(expected);
  });

  it('should be deterministic and not require any API keys', () => {
    const result = getElectionOfficeUrl(0, 0);
    expect(result).not.toContain('key=');
    expect(result).toContain('google.com/maps/search');
  });

  it('should NOT contain the old "polling booth" search query in any URL', () => {
    const election = getElectionOfficeUrl(lat, lng);
    const government = getGovernmentOfficeUrl(lat, lng);
    const station = getPollingStationUrl(lat, lng);
    const fallback = getFallbackMapsUrl();

    expect(election).not.toContain('polling+booth');
    expect(government).not.toContain('polling+booth');
    expect(station).not.toContain('polling+booth');
    expect(fallback).not.toContain('polling+booth');
    
    expect(election).not.toContain('polling%20booth');
    expect(government).not.toContain('polling%20booth');
    expect(station).not.toContain('polling%20booth');
    expect(fallback).not.toContain('polling%20booth');
  });
});

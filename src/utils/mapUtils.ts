/**
 * Generates Google Maps search URLs for election-related locations.
 */

export const getElectionOfficeUrl = (lat: number, lng: number): string => {
  return `https://www.google.com/maps/search/election+office+near+me/@${lat},${lng},14z`;
};

export const getGovernmentOfficeUrl = (lat: number, lng: number): string => {
  return `https://www.google.com/maps/search/government+office+near+me/@${lat},${lng},14z`;
};

export const getPollingStationUrl = (lat: number, lng: number): string => {
  return `https://www.google.com/maps/search/polling+station+near+me/@${lat},${lng},14z`;
};

/**
 * Returns the fallback Google Maps search URL.
 */
export const getFallbackMapsUrl = (): string => {
  return "https://www.google.com/maps/search/election+office+near+me";
};

/**
 * Generates a Google Maps search URL for polling booths at specific coordinates.
 */
export const getBoothMapsUrl = (lat: number, lng: number): string => {
  return `https://www.google.com/maps/search/polling+booth/@${lat},${lng},15z`;
};

/**
 * Returns the fallback Google Maps search URL for polling booths near the user.
 */
export const getFallbackMapsUrl = (): string => {
  return "https://www.google.com/maps/search/polling+booth+near+me";
};

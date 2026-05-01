
import axios from 'axios';

/**
 * Optional service to find nearby election-related places using Google Places API.
 * 
 * NOTE: If the GOOGLE_MAPS_API_KEY has "HTTP Referer" restrictions, this backend 
 * service will return empty results because Google denies server-side requests 
 * from restricted keys. For full functionality, ensure the API key is either 
 * unrestricted or restricted by IP address (the Cloud Run egress IP).
 */

export const findNearbyElectionPlaces = async (lat: number, lng: number) => {
  const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return [];
  }

  // Civic/Election help terms
  const terms = [
    "election office",
    "government office",
    "municipal office",
    "collector office",
    "public school",
    "community center"
  ];

  const uniquePlaces = new Map();
  const startTime = Date.now();
  const timeoutBudget = 4000; // 4s budget for sequential calls

  for (const term of terms) {
    if (uniquePlaces.size >= 3 || (Date.now() - startTime) > timeoutBudget) break;

    try {
      // Nearby Search (Legacy) is robust for coordinate-based keyword matching
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${lat},${lng}`,
          radius: 10000,
          keyword: term,
          key: apiKey
        },
        timeout: 2000
      });

      if (response.data.status === 'OK' && response.data.results) {
        for (const p of response.data.results) {
          if (!uniquePlaces.has(p.place_id)) {
            uniquePlaces.set(p.place_id, {
              id: p.place_id,
              name: p.name,
              address: p.vicinity || p.formatted_address || "Address unavailable",
              lat: p.geometry?.location?.lat || lat,
              lng: p.geometry?.location?.lng || lng,
              mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}&query_place_id=${p.place_id}`,
              type: determinePlaceType(p.types || [])
            });
          }
          if (uniquePlaces.size >= 5) break;
        }
      } else if (response.data.status === 'REQUEST_DENIED') {
        // Log restriction details for developer visibility in Cloud Run logs
        console.error("Google Places API Request Denied. Likely due to API key restrictions (e.g. Referer restrictions on a server-side call).");
        break; // Stop trying if denied
      }
    } catch (err: any) {
      console.warn(`Search for "${term}" failed:`, err.message);
    }
  }

  return Array.from(uniquePlaces.values());
};

const determinePlaceType = (types: string[]): string => {
  if (types.includes('government_office')) return 'Government Office';
  if (types.includes('city_hall') || types.includes('local_government_office')) return 'Election/Admin Office';
  if (types.includes('school')) return 'Public School (Common Booth Location)';
  return 'Civic Help Center';
};

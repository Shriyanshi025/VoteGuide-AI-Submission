
/**
 * Optional service to find nearby election-related places using Google Places API.
 * This service is designed to fail gracefully and return an empty list if:
 * - API Key is missing
 * - API returns an error
 * - API request times out (3s)
 */

export const findNearbyElectionPlaces = async (lat: number, lng: number) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn("GOOGLE_MAPS_API_KEY missing, skipping Places suggestions.");
    return [];
  }

  // Broadened query including reliable civic/election-related terms
  const terms = [
    "polling station",
    "election office",
    "government office",
    "municipal office",
    "collector office",
    "tehsil office",
    "community center",
    "public school"
  ];
  const query = terms.join(" OR ");
  const url = "https://places.googleapis.com/v1/places:searchText";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types'
      },
      body: JSON.stringify({
        textQuery: query,
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 5000.0 // 5km radius
          }
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Places API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.places || !Array.isArray(data.places)) {
      return [];
    }

    // De-duplicate by ID and limit to 5
    const uniquePlaces = new Map();
    for (const p of data.places) {
      if (!p.id || uniquePlaces.has(p.id)) continue;
      
      uniquePlaces.set(p.id, {
        id: p.id,
        name: p.displayName?.text || "Unknown Place",
        address: p.formattedAddress || "Address unavailable",
        lat: p.location?.latitude || lat,
        lng: p.location?.longitude || lng,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName?.text || "")}&query_place_id=${p.id}`,
        type: determinePlaceType(p.types || [])
      });

      if (uniquePlaces.size >= 5) break;
    }

    return Array.from(uniquePlaces.values());

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn("Places API request timed out (3s).");
    } else {
      console.warn("Places API fetch failed:", error.message);
    }
    return [];
  }
};

const determinePlaceType = (types: string[]): string => {
  if (types.includes('government_office')) return 'Government Office';
  if (types.includes('city_hall') || types.includes('local_government_office')) return 'Election/Admin Office';
  return 'Polling Station Suggestion';
};

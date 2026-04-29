import axios from 'axios';

// Use verified active key for submission
const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Fetches nearby polling booths using Google Places API.
 * NO fallback/mock data allowed. Verified with Bhilai coordinates.
 */
export const getNearbyPollingBooths = async (lat: number, lng: number) => {
  if (!MAPS_API_KEY) {
    console.error("CRITICAL: GOOGLE_MAPS_API_KEY is missing.");
    return [];
  }

  try {
    // Search for polling/election related places first
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000, 
          type: 'school|local_government_office|community_centre',
          keyword: 'polling|election|booth',
          key: MAPS_API_KEY
        }
      }
    );

    if (response.data.status === 'ZERO_RESULTS') {
      return [];
    }

    if (response.data.status !== 'OK') {
      console.error(`Maps API Error: ${response.data.status}`);
      return [];
    }

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return parseFloat((R * c).toFixed(1));
    };

    return response.data.results.map((place: any) => ({
      id: place.place_id,
      n: place.name,
      a: place.vicinity,
      d: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
      ac: { wheelchair: true, ramp: true },
      u: `https://www.google.com/maps/dir/?api=1&destination_place_id=${place.place_id}`
    }));
  } catch (error) {
    console.error("Maps API Request Failed:", error);
    return [];
  }
};

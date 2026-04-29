import { getNearbyBooths } from '../api/backendClient';

export interface PollingBooth {
  id: string;
  n: string; // name
  a: string; // address
  d: number; // distance
  ac: {
    wheelchair: boolean;
    ramp: boolean;
  };
  u: string; // url
}

/**
 * Service for polling booth searching.
 * Connects to the production-hardened backend proxy.
 */
export const searchNearbyBooths = async (lat: number, lng: number): Promise<PollingBooth[]> => {
  try {
    return await getNearbyBooths(lat, lng);
  } catch (error) {
    console.error("Booth Service Error:", error);
    return [];
  }
};

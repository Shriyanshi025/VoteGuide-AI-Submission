import type { Message, Attribution } from '../types';

const API_BASE = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || 'http://localhost:3000') : '';

export const chat = async (
  message: string, 
  history: Message[], 
  persona: string, 
  mode: string, 
  language: string
): Promise<Attribution> => {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, persona, mode, language })
  });

  if (!response.ok) throw new Error('Backend chat failure');
  return response.json();
};

export const getNearbyBooths = async (lat: number, lng: number) => {
  const response = await fetch(`${API_BASE}/api/booths?lat=${lat}&lng=${lng}`);
  if (!response.ok) throw new Error('Backend maps failure');
  return response.json();
};

export const createReminder = async (type: string, data: any) => {
  const response = await fetch(`${API_BASE}/api/reminder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, data })
  });
  return response.json();
};
export const getNearbyPlaces = async (lat: number, lng: number) => {
  try {
    const response = await fetch(`${API_BASE}/api/places/nearby?lat=${lat}&lng=${lng}`);
    if (!response.ok) return { places: [] };
    return response.json();
  } catch (error) {
    console.error('Failed to fetch nearby places:', error);
    return { places: [] };
  }
};

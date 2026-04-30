import { useState } from 'react';

export interface LocationState {
  coords: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to access browser geolocation.
 */
export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    coords: null,
    loading: false,
    error: null,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Location detection is not supported in this browser.' }));
      return;
    }

    setState(s => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        let errorMsg = error.message;
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission is needed to find nearby polling booth guidance.';
        }
        setState({
          coords: null,
          loading: false,
          error: errorMsg,
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return { ...state, getLocation };
};

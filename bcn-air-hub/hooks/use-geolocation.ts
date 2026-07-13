'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_USER_LOCATION } from '@/lib/constants';
import type { RadarOrigin } from '@/types';

export function useGeolocation(): RadarOrigin {
  const [coords, setCoords] = useState<RadarOrigin>(DEFAULT_USER_LOCATION);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'La teva ubicació actual',
        });
      },
      () => {
        console.log('[bcn-air-hub] Geolocalització no permesa o fallida, s\'utilitza BCN per defecte.');
      },
    );
  }, []);

  return coords;
}

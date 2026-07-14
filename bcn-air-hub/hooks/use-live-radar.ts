'use client';

import { useQuery } from '@tanstack/react-query';
import type { RadarSnapshot } from '@/types';

async function fetchRadar(lat: number, lng: number, label: string): Promise<RadarSnapshot> {
  const query = new URLSearchParams({ lat: String(lat), lng: String(lng), label });
  const res = await fetch(`/api/radar?${query.toString()}`);
  if (!res.ok) {
    throw new Error('No s\'ha pogut carregar el radar');
  }
  return res.json();
}

export function useLiveRadar(lat: number, lng: number, label: string) {
  return useQuery({
    queryKey: ['radar', lat.toFixed(2), lng.toFixed(2)],
    queryFn: () => fetchRadar(lat, lng, label),
    refetchInterval: 20_000,
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import type { WeatherSnapshot } from '@/types';

async function fetchWeather(lat: number, lng: number, label: string): Promise<WeatherSnapshot> {
  const query = new URLSearchParams({ lat: String(lat), lng: String(lng), label });
  const res = await fetch(`/api/weather?${query.toString()}`);
  if (!res.ok) {
    throw new Error('No s\'ha pogut carregar el temps');
  }
  return res.json();
}

export function useWeather(lat: number, lng: number, label: string) {
  return useQuery({
    queryKey: ['weather', lat.toFixed(2), lng.toFixed(2)],
    queryFn: () => fetchWeather(lat, lng, label),
    staleTime: 10 * 60_000,
  });
}

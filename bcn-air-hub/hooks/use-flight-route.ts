'use client';

import { useQuery } from '@tanstack/react-query';
import type { FlightRoute } from '@/services/aerodatabox/route-lookup.service';

async function fetchRoute(callsign: string): Promise<{ route: FlightRoute }> {
  const res = await fetch(`/api/radar/route-lookup?callsign=${encodeURIComponent(callsign)}`);
  if (!res.ok) return { route: null };
  return res.json();
}

export function useFlightRoute(callsign: string) {
  return useQuery({
    queryKey: ['flight-route', callsign],
    queryFn: () => fetchRoute(callsign),
    enabled: Boolean(callsign) && callsign !== 'N/D',
    staleTime: 5 * 60_000,
    retry: false,
  });
}

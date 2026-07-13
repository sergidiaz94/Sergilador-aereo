'use client';

import { useMutation } from '@tanstack/react-query';
import type { FlightStatusInfo } from '@/types';

async function fetchFlightStatus(flightNumber: string): Promise<FlightStatusInfo> {
  const query = new URLSearchParams({ flightNumber });
  const res = await fetch(`/api/flights/status?${query.toString()}`);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "No s'ha pogut consultar el vol");
  }
  return res.json();
}

export function useFlightStatus() {
  return useMutation({ mutationFn: fetchFlightStatus });
}

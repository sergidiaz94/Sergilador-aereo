'use client';

import { useMutation } from '@tanstack/react-query';
import type { FlightStatusInfo } from '@/types';

type FlightStatusResponse = { status: FlightStatusInfo; isDemo: boolean };

async function fetchFlightStatus(flightNumber: string): Promise<FlightStatusResponse> {
  const query = new URLSearchParams({ flightNumber });
  const res = await fetch(`/api/flights/status?${query.toString()}`);

  if (res.status === 404) {
    throw new FlightNotFoundError();
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "No s'ha pogut consultar el vol");
  }
  return res.json();
}

export class FlightNotFoundError extends Error {
  constructor() {
    super('Vol no trobat');
    this.name = 'FlightNotFoundError';
  }
}

export function useFlightStatus() {
  return useMutation({ mutationFn: fetchFlightStatus });
}

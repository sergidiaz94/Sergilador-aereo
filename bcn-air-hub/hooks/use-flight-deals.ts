'use client';

import { useQuery } from '@tanstack/react-query';
import type { FlightDeal, DataSource } from '@/types';

type DealsResponse = { deals: FlightDeal[]; source: DataSource };

async function fetchDeals(): Promise<DealsResponse> {
  const res = await fetch('/api/flights/deals');
  if (!res.ok) {
    throw new Error("No s'han pogut carregar les ofertes");
  }
  return res.json();
}

export function useFlightDeals() {
  return useQuery({
    queryKey: ['flight-deals'],
    queryFn: fetchDeals,
    staleTime: 5 * 60_000,
  });
}

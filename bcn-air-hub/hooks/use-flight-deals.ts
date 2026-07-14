'use client';

import { useQuery } from '@tanstack/react-query';
import type { FlightDeal, DataSource } from '@/types';

type DealsResponse = { deals: FlightDeal[]; source: DataSource };

async function fetchDeals(origin: string): Promise<DealsResponse> {
  const res = await fetch(`/api/flights/deals?origin=${origin}`);
  if (!res.ok) {
    throw new Error("No s'han pogut carregar les ofertes");
  }
  return res.json();
}

export function useFlightDeals(origin: string) {
  return useQuery({
    queryKey: ['flight-deals', origin],
    queryFn: () => fetchDeals(origin),
    staleTime: 5 * 60_000,
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import type { FlightDeal, DataSource } from '@/types';

type DealsResponse = { deals: FlightDeal[]; source: DataSource };
type Weekend = { friday: string; sunday: string };

async function fetchDeals(origin: string, weekend: Weekend): Promise<DealsResponse> {
  const query = new URLSearchParams({ origin, friday: weekend.friday, sunday: weekend.sunday });
  const res = await fetch(`/api/flights/deals?${query.toString()}`);
  if (!res.ok) {
    throw new Error("No s'han pogut carregar les ofertes");
  }
  return res.json();
}

export function useFlightDeals(origin: string, weekend: Weekend) {
  return useQuery({
    queryKey: ['flight-deals', origin, weekend.friday],
    queryFn: () => fetchDeals(origin, weekend),
    staleTime: 5 * 60_000,
  });
}

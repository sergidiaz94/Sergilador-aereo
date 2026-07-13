'use client';

import { useMutation } from '@tanstack/react-query';
import type { FlightOffer, DataSource } from '@/types';

type SearchParams = { destination: string; departDate: string; returnDate?: string };
type SearchResponse = { offers: FlightOffer[]; source: DataSource };

async function fetchSearch(params: SearchParams): Promise<SearchResponse> {
  const query = new URLSearchParams({
    destination: params.destination,
    departDate: params.departDate,
    ...(params.returnDate ? { returnDate: params.returnDate } : {}),
  });

  const res = await fetch(`/api/flights/search?${query.toString()}`);
  if (!res.ok) {
    throw new Error('No s\'ha pogut cercar vols');
  }
  return res.json();
}

export function useFlightSearch() {
  return useMutation({ mutationFn: fetchSearch });
}

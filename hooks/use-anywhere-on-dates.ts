'use client';

import { useMutation } from '@tanstack/react-query';
import type { FlightDeal, DataSource } from '@/types';

type Params = { origin: string; departDate: string; returnDate: string };
type Response = { deals: FlightDeal[]; source: DataSource };

async function fetchAnywhereOnDates(params: Params): Promise<Response> {
  const query = new URLSearchParams({
    origin: params.origin,
    departDate: params.departDate,
    returnDate: params.returnDate,
  });
  const res = await fetch(`/api/flights/anywhere-on-dates?${query.toString()}`);
  if (!res.ok) {
    throw new Error("No s'ha pogut cercar la destinació més barata per aquestes dates");
  }
  return res.json();
}

export function useAnywhereOnDates() {
  return useMutation({ mutationFn: fetchAnywhereOnDates });
}

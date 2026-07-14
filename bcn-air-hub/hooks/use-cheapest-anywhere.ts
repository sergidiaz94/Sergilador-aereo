'use client';

import { useMutation } from '@tanstack/react-query';
import type { FlightDeal, DataSource } from '@/types';

type AnywhereResponse = { deals: FlightDeal[]; source: DataSource };

async function fetchAnywhere(origin: string): Promise<AnywhereResponse> {
  const res = await fetch(`/api/flights/anywhere?origin=${origin}`);
  if (!res.ok) {
    throw new Error("No s'ha pogut cercar la destinació més barata");
  }
  return res.json();
}

export function useCheapestAnywhere() {
  return useMutation({ mutationFn: fetchAnywhere });
}

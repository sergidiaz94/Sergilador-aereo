'use client';

import { useMutation } from '@tanstack/react-query';
import type { FlightOffer } from '@/types';

type OlgaSearchResponse = { ok: boolean; nextDays?: FlightOffer[]; cheapestOverall?: FlightOffer | null };

async function olgaSearch(password: string): Promise<OlgaSearchResponse> {
  const res = await fetch('/api/olga/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (res.status === 401) {
    return { ok: false };
  }
  if (!res.ok) {
    throw new Error('Error cercant el vol');
  }
  return res.json();
}

export function useOlgaSearch() {
  return useMutation({ mutationFn: olgaSearch });
}

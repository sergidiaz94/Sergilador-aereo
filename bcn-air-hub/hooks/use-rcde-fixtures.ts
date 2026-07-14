'use client';

import { useQuery } from '@tanstack/react-query';
import type { RcdeToursResponse } from '@/types';

async function fetchRcdePlan(): Promise<RcdeToursResponse> {
  const res = await fetch('/api/rcde/fixtures');
  if (!res.ok) {
    throw new Error("No s'han pogut carregar els partits");
  }
  return res.json();
}

export function useRcdeFixtures() {
  return useQuery({
    queryKey: ['rcde-fixtures'],
    queryFn: fetchRcdePlan,
    staleTime: 5 * 60_000,
  });
}

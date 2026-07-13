'use client';

import { useQuery } from '@tanstack/react-query';
import type { RcdeTourPlan } from '@/types';

async function fetchRcdePlan(): Promise<RcdeTourPlan> {
  const res = await fetch('/api/rcde/fixtures');
  if (!res.ok) {
    throw new Error('No s\'ha pogut carregar el proper partit');
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

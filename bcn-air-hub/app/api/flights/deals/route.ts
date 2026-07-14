import { NextRequest, NextResponse } from 'next/server';
import { getCheapestWeekendDeals } from '@/services/travelpayouts/deals.service';
import { hasTravelpayouts } from '@/lib/env';
import { DEFAULT_ORIGIN, ORIGIN_AIRPORTS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedOrigin = (searchParams.get('origin') ?? DEFAULT_ORIGIN).toUpperCase();
  const origin = ORIGIN_AIRPORTS.some((airport) => airport.code === requestedOrigin)
    ? requestedOrigin
    : DEFAULT_ORIGIN;

  const friday = searchParams.get('friday');
  const sunday = searchParams.get('sunday');
  const weekend = friday && sunday ? { friday, sunday } : undefined;

  const deals = await getCheapestWeekendDeals(origin, weekend);
  return NextResponse.json({ deals, source: hasTravelpayouts() ? 'live' : 'demo' });
}

import { NextRequest, NextResponse } from 'next/server';
import { getCheapestAnywhere } from '@/services/travelpayouts/anywhere.service';
import { hasTravelpayouts } from '@/lib/env';
import { DEFAULT_ORIGIN, ORIGIN_AIRPORTS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedOrigin = (searchParams.get('origin') ?? DEFAULT_ORIGIN).toUpperCase();
  const origin = ORIGIN_AIRPORTS.some((airport) => airport.code === requestedOrigin)
    ? requestedOrigin
    : DEFAULT_ORIGIN;

  const deals = await getCheapestAnywhere(origin);
  return NextResponse.json({ deals, source: hasTravelpayouts() ? 'live' : 'demo' });
}

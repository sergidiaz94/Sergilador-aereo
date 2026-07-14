import { NextRequest, NextResponse } from 'next/server';
import { getCheapestForExactDates } from '@/services/travelpayouts/deals.service';
import { hasTravelpayouts } from '@/lib/env';
import { DEFAULT_ORIGIN, ORIGIN_AIRPORTS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedOrigin = (searchParams.get('origin') ?? DEFAULT_ORIGIN).toUpperCase();
  const origin = ORIGIN_AIRPORTS.some((airport) => airport.code === requestedOrigin)
    ? requestedOrigin
    : DEFAULT_ORIGIN;

  const departDate = searchParams.get('departDate');
  const returnDate = searchParams.get('returnDate');

  if (!departDate || !returnDate) {
    return NextResponse.json({ error: 'Falten dates' }, { status: 400 });
  }

  const deals = await getCheapestForExactDates(origin, departDate, returnDate);
  return NextResponse.json({ deals, source: hasTravelpayouts() ? 'live' : 'demo' });
}

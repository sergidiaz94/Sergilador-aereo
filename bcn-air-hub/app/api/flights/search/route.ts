import { NextRequest, NextResponse } from 'next/server';
import { searchFlightPrices } from '@/services/travelpayouts/search.service';
import { hasTravelpayouts } from '@/lib/env';
import { DEFAULT_ORIGIN, ORIGIN_AIRPORTS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destination = (searchParams.get('destination') ?? '').toUpperCase().trim();
  const departDate = searchParams.get('departDate');
  const returnDate = searchParams.get('returnDate') ?? undefined;
  const requestedOrigin = (searchParams.get('origin') ?? DEFAULT_ORIGIN).toUpperCase();
  const origin = ORIGIN_AIRPORTS.some((airport) => airport.code === requestedOrigin)
    ? requestedOrigin
    : DEFAULT_ORIGIN;

  if (!destination || !departDate) {
    return NextResponse.json({ error: 'Falten paràmetres: destination i departDate' }, { status: 400 });
  }

  const offers = await searchFlightPrices(origin, destination, departDate, returnDate);
  return NextResponse.json({ offers, source: hasTravelpayouts() ? 'live' : 'demo' });
}

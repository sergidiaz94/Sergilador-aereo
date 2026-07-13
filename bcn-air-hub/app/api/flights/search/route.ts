import { NextRequest, NextResponse } from 'next/server';
import { searchFlightPrices } from '@/services/travelpayouts/search.service';
import { hasTravelpayouts } from '@/lib/env';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destination = (searchParams.get('destination') ?? '').toUpperCase().trim();
  const departDate = searchParams.get('departDate');
  const returnDate = searchParams.get('returnDate') ?? undefined;

  if (!destination || !departDate) {
    return NextResponse.json({ error: 'Falten paràmetres: destination i departDate' }, { status: 400 });
  }

  const offers = await searchFlightPrices(destination, departDate, returnDate);
  return NextResponse.json({ offers, source: hasTravelpayouts() ? 'live' : 'demo' });
}

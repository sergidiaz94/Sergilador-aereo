import { NextRequest, NextResponse } from 'next/server';
import { getFlightStatus } from '@/services/aerodatabox/flight-status.service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = (searchParams.get('flightNumber') ?? '').toUpperCase().trim();
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0];

  // Format esperat: 2 lletres de companyia + 1-4 dígits (ex. VY1234)
  const match = raw.match(/^([A-Z]{2})\s*(\d{1,4})$/);
  if (!match) {
    return NextResponse.json({ error: 'Format de vol no vàlid. Exemple: VY1234' }, { status: 400 });
  }

  const [, carrierCode, flightNumber] = match;
  const result = await getFlightStatus(carrierCode, flightNumber, date);

  if (result.kind === 'not-found') {
    return NextResponse.json({ error: 'No s\'ha trobat cap vol amb aquest número per aquesta data.' }, { status: 404 });
  }

  return NextResponse.json({ status: result.status, isDemo: result.kind === 'demo' });
}

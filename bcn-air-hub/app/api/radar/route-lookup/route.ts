import { NextRequest, NextResponse } from 'next/server';
import { getRouteByCallsign } from '@/services/aerodatabox/route-lookup.service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callsign = searchParams.get('callsign') ?? '';

  const route = await getRouteByCallsign(callsign);
  return NextResponse.json({ route });
}

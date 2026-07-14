import { NextRequest, NextResponse } from 'next/server';
import { getLiveRadar } from '@/services/flight-tracker-live/radar.service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  const label = searchParams.get('label') ?? 'Ubicació';

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: 'Falten coordenades vàlides' }, { status: 400 });
  }

  const snapshot = await getLiveRadar({ lat, lng, label });
  return NextResponse.json(snapshot);
}

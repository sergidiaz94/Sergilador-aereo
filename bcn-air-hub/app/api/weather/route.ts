import { NextRequest, NextResponse } from 'next/server';
import { getWeatherSnapshot } from '@/services/weather/weather.service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  const label = searchParams.get('label') ?? 'Barcelona';

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: 'Falten coordenades vàlides' }, { status: 400 });
  }

  const weather = await getWeatherSnapshot(lat, lng, label);
  return NextResponse.json(weather);
}

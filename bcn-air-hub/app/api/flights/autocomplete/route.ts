import { NextRequest, NextResponse } from 'next/server';

// Proxy a l'API pública d'autocompletar d'Aviasales/Travelpayouts (no
// necessita token). Es fa des del servidor per evitar problemes de CORS
// al navegador.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = (searchParams.get('term') ?? '').trim();

  if (term.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL('https://autocomplete.travelpayouts.com/places2');
  url.searchParams.set('term', term);
  url.searchParams.set('locale', 'es');
  url.searchParams.append('types[]', 'airport');
  url.searchParams.append('types[]', 'city');

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }
    const data = await res.json();
    const results = (data ?? []).slice(0, 8).map((item: any) => ({
      code: item.code,
      name: item.name,
      cityName: item.city_name ?? item.name,
      countryName: item.country_name,
      type: item.type,
    }));
    return NextResponse.json({ results });
  } catch (error) {
    console.error('[travelpayouts] error a l\'autocompletar:', error);
    return NextResponse.json({ results: [] });
  }
}

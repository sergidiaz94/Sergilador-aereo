import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { findCheapestDirectFlights } from '@/services/travelpayouts/quick-search.service';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = body?.password;

  // Comprovació al servidor: la contrasenya mai viatja al bundle del client.
  if (password !== env.olga.password) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const offers = await findCheapestDirectFlights(env.olga.originAirport, 'BCN', 3);

  return NextResponse.json({ ok: true, offers });
}

import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { findCheapestDirectFlight } from '@/services/travelpayouts/quick-search.service';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = body?.password;

  // Comprovació al servidor: la contrasenya mai viatja al bundle del client.
  if (password !== env.olga.password) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const offers = await findCheapestDirectFlight(env.olga.originAirport, 'BCN');
  const cheapest = [...offers].sort((a, b) => a.price - b.price)[0];

  if (!cheapest) {
    return NextResponse.json({ ok: true, offer: undefined });
  }

  return NextResponse.json({
    ok: true,
    offer: {
      origin: cheapest.origin,
      destination: cheapest.destination,
      departureLabel: "Vol d'anada directe en els pròxims dies",
      durationMinutes: cheapest.durationMinutes,
      price: cheapest.price,
      currency: cheapest.currency,
      airline: cheapest.airline,
      deepLink: cheapest.deepLink,
    },
  });
}

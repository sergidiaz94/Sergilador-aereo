import { hasTravelpayouts } from '@/lib/env';
import { travelpayoutsGet } from './client';
import { demoOlgaOffers } from '../demo-data';
import type { FlightOffer } from '@/types';

// Cerca ràpida origen -> destí en els pròxims dies (funció secreta "Ets
// l'Olga?"). Consulta cada dia per separat amb /v1/prices/direct (amb
// data exacta hi ha més probabilitat de trobar preu en cache que amb una
// cerca sense data concreta) i retorna les 3 opcions més barates trobades.
export async function findCheapestDirectFlights(
  origin: string,
  destination: string,
  daysAhead = 3,
): Promise<FlightOffer[]> {
  if (!hasTravelpayouts()) {
    return demoOlgaOffers(origin, destination);
  }

  const dates = Array.from({ length: daysAhead }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  try {
    const results = await Promise.allSettled(
      dates.map((date) =>
        travelpayoutsGet<any>('/v1/prices/direct', {
          origin,
          destination,
          depart_date: date,
          currency: 'eur',
        }).then((data) => ({ date, data })),
      ),
    );

    const offers: FlightOffer[] = [];

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const { date, data } = result.value;
      const options = Object.values(data.data?.[destination] ?? {}) as any[];

      options.forEach((item, index) => {
        offers.push({
          id: `${destination}-${date}-${index}`,
          origin,
          destination,
          departureDate: item.departure_at ?? date,
          returnDate: undefined,
          durationMinutes: 0,
          price: Number(item.price ?? 0),
          currency: 'EUR',
          airline: item.airline ?? 'N/D',
          deepLink: 'https://www.aviasales.com',
          stops: 0,
          source: 'live',
        });
      });
    }

    offers.sort((a, b) => a.price - b.price);
    return offers.length > 0 ? offers.slice(0, 3) : demoOlgaOffers(origin, destination);
  } catch (error) {
    console.error('[travelpayouts] error cercant vol directe:', error);
    return demoOlgaOffers(origin, destination);
  }
}

import { hasTravelpayouts } from '@/lib/env';
import { travelpayoutsGet } from './client';
import { searchRoundtripSkyscanner } from '../flights-sky/search.service';
import { demoOlgaOffers } from '../demo-data';
import type { FlightOffer } from '@/types';

export type OlgaSearchResult = {
  nextDays: FlightOffer[];
  cheapestOverall: FlightOffer | null;
};

// Cerca ràpida origen -> destí (funció secreta "Ets l'Olga?"). Retorna dues
// coses: les millors opcions concretes dels pròxims `daysAhead` dies, i per
// separat el preu més barat trobat en cache per aquesta ruta sense
// restricció de data (pot ser un altre dia més endavant, però més barat).
export async function findCheapestDirectFlights(
  origin: string,
  destination: string,
  daysAhead = 3,
): Promise<OlgaSearchResult> {
  if (!hasTravelpayouts()) {
    const demo = sortByDate(demoOlgaOffers(origin, destination));
    return { nextDays: demo, cheapestOverall: demo[0] ?? null };
  }

  const dates = Array.from({ length: daysAhead }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const [preciseOffers, broadOffers] = await Promise.all([
    searchByExactDates(origin, destination, dates),
    searchByCache(origin, destination),
  ]);

  let nextDays: FlightOffer[] = [];

  if (preciseOffers.length > 0) {
    nextDays = sortByDate(preciseOffers.slice(0, 3));
  } else if (broadOffers.length > 0) {
    nextDays = sortByDate(broadOffers.slice(0, 3));
  } else {
    const skyscannerOffers = await searchRoundtripSkyscanner(origin, destination, dates[0]);
    nextDays = skyscannerOffers.length > 0 ? sortByDate(skyscannerOffers.slice(0, 3)) : [];
  }

  // El preu més barat "sense restricció de dia" surt de la cerca en cache
  // àmplia; si l'opció més barata dels pròxims dies ja és igual o més
  // barata, no cal duplicar-la.
  const cheapestOverall = broadOffers.length > 0 ? [...broadOffers].sort((a, b) => a.price - b.price)[0] : null;
  const cheapestInNextDays = nextDays.length > 0 ? Math.min(...nextDays.map((o) => o.price)) : Infinity;

  if (nextDays.length === 0) {
    const demo = sortByDate(demoOlgaOffers(origin, destination));
    return { nextDays: demo, cheapestOverall: cheapestOverall ?? demo[0] ?? null };
  }

  return {
    nextDays,
    cheapestOverall: cheapestOverall && cheapestOverall.price < cheapestInNextDays ? cheapestOverall : null,
  };
}

function sortByDate(offers: FlightOffer[]): FlightOffer[] {
  return [...offers].sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
}

async function searchByExactDates(origin: string, destination: string, dates: string[]): Promise<FlightOffer[]> {
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
        offers.push(mapOffer(origin, destination, item, `${destination}-${date}-${index}`));
      });
    }

    return offers.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('[travelpayouts] error a la cerca per dates exactes:', error);
    return [];
  }
}

async function searchByCache(origin: string, destination: string): Promise<FlightOffer[]> {
  try {
    const data = await travelpayoutsGet<any>('/v1/prices/cheap', {
      origin,
      destination,
      currency: 'eur',
    });

    const options = Object.values(data.data?.[destination] ?? {}) as any[];
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const offers = options
      .filter((item) => !item.departure_at || new Date(item.departure_at) >= tomorrow)
      .map((item, index) => mapOffer(origin, destination, item, `${destination}-cache-${index}`));

    return offers.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('[travelpayouts] error a la cerca en cache:', error);
    return [];
  }
}

function mapOffer(origin: string, destination: string, item: any, id: string): FlightOffer {
  return {
    id,
    origin,
    destination,
    departureDate: item.departure_at ?? new Date().toISOString(),
    returnDate: undefined,
    durationMinutes: 0,
    price: Number(item.price ?? 0),
    currency: 'EUR',
    airline: item.airline ?? 'N/D',
    deepLink: 'https://www.aviasales.com',
    stops: 0,
    source: 'live',
  };
}

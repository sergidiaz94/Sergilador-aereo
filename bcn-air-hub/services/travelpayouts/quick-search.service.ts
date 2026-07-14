import { hasTravelpayouts } from '@/lib/env';
import { travelpayoutsGet } from './client';
import { searchRoundtripSkyscanner } from '../flights-sky/search.service';
import { demoOlgaOffers } from '../demo-data';
import type { FlightOffer } from '@/types';

// Cerca ràpida origen -> destí en els pròxims dies (funció secreta "Ets
// l'Olga?"). Tres nivells abans de rendir-se a les dades de demo:
// 1) Travelpayouts amb dates exactes (millor per "en els pròxims 3 dies")
// 2) Travelpayouts amb cache ampli (sense fixar dia)
// 3) Skyscanner no oficial (flights-sky), com a última alternativa real
export async function findCheapestDirectFlights(
  origin: string,
  destination: string,
  daysAhead = 3,
): Promise<FlightOffer[]> {
  if (!hasTravelpayouts()) {
    return sortByDate(demoOlgaOffers(origin, destination));
  }

  const dates = Array.from({ length: daysAhead }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const preciseOffers = await searchByExactDates(origin, destination, dates);
  if (preciseOffers.length > 0) {
    return sortByDate(preciseOffers.slice(0, 3));
  }

  const broadOffers = await searchByCache(origin, destination);
  if (broadOffers.length > 0) {
    return sortByDate(broadOffers.slice(0, 3));
  }

  const skyscannerOffers = await searchRoundtripSkyscanner(origin, destination, dates[0]);
  if (skyscannerOffers.length > 0) {
    return sortByDate(skyscannerOffers.slice(0, 3));
  }

  return sortByDate(demoOlgaOffers(origin, destination));
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

import { hasTravelpayouts } from '@/lib/env';
import { travelpayoutsGet } from './client';
import { demoFlightDeals } from '../demo-data';
import { DEFAULT_ORIGIN } from '@/lib/constants';
import { getNextWeekend } from '@/lib/date';
import type { FlightDeal } from '@/types';

// Destinacions candidates per a les cerques "qualsevol destinació". Es
// consulten en paral·lel; les que no tinguin preu en cache per aquestes
// dates concretes simplement no surten a la llista.
const CANDIDATE_DESTINATIONS = [
  'PMI', 'MAD', 'LIS', 'FCO', 'LHR', 'CDG', 'AMS', 'BER',
  'MUC', 'VIE', 'ZRH', 'BRU', 'DUB', 'CPH', 'ATH', 'IST',
];

// Sempre busca vols de divendres (a partir de les 18h) a diumenge, per a un
// escapada de cap de setmana des de l'origen escollit (BCN, VLC o PMI).
// Si no es passa `weekend`, agafa el proper cap de setmana per defecte.
export async function getCheapestWeekendDeals(
  origin: string = DEFAULT_ORIGIN,
  weekend?: { friday: string; sunday: string },
): Promise<FlightDeal[]> {
  const { friday, sunday } = weekend ?? getNextWeekend();

  if (!hasTravelpayouts()) {
    return demoFlightDeals(weekend);
  }

  const deals = await searchCandidatesForDates(origin, friday, sunday);
  return deals.length > 0 ? deals : demoFlightDeals(weekend);
}

// Cerca "qualsevol destinació" per a unes dates concretes escollides per
// l'usuari (a diferència de getCheapestWeekendDeals, aquí les dates no
// estan fixades a divendres-diumenge).
export async function getCheapestForExactDates(
  origin: string,
  departDate: string,
  returnDate: string,
): Promise<FlightDeal[]> {
  if (!hasTravelpayouts()) {
    return demoFlightDeals({ friday: departDate, sunday: returnDate });
  }

  const deals = await searchCandidatesForDates(origin, departDate, returnDate);
  return deals.length > 0 ? deals : demoFlightDeals({ friday: departDate, sunday: returnDate });
}

async function searchCandidatesForDates(origin: string, departDate: string, returnDate: string): Promise<FlightDeal[]> {
  const destinations = CANDIDATE_DESTINATIONS.filter((code) => code !== origin);

  try {
    const results = await Promise.allSettled(
      destinations.map((destination) =>
        travelpayoutsGet<any>('/v1/prices/direct', {
          origin,
          destination,
          depart_date: departDate,
          return_date: returnDate,
          currency: 'eur',
        }).then((data) => ({ destination, data })),
      ),
    );

    const deals: FlightDeal[] = [];

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const { destination, data } = result.value;
      const options = Object.values(data.data?.[destination] ?? {}) as any[];
      if (options.length === 0) continue;

      const cheapest = options.sort((a, b) => a.price - b.price)[0];
      deals.push({
        id: `${destination}-${cheapest.flight_number ?? '0'}`,
        destination,
        departureDate: cheapest.departure_at?.split('T')[0] ?? departDate,
        returnDate: cheapest.return_at?.split('T')[0] ?? returnDate,
        price: Number(cheapest.price ?? 0),
        currency: 'EUR',
        deepLink: buildAviasalesLink(origin, destination, cheapest.departure_at ?? departDate, cheapest.return_at ?? returnDate),
        source: 'live',
      });
    }

    deals.sort((a, b) => a.price - b.price);
    return deals.slice(0, 6);
  } catch (error) {
    console.error('[travelpayouts] error a la cerca de qualsevol destinació:', error);
    return [];
  }
}

function buildAviasalesLink(origin: string, destination: string, departureAt: string, returnAt: string): string {
  const depart = formatDDMM(departureAt);
  const back = formatDDMM(returnAt);
  return `https://www.aviasales.com/search/${origin}${depart}${destination}${back}1`;
}

function formatDDMM(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}${month}`;
}

import { hasTravelpayouts } from '@/lib/env';
import { travelpayoutsGet } from './client';
import { demoFlightDeals } from '../demo-data';
import { BCN_AIRPORT } from '@/lib/constants';
import { getNextWeekend } from '@/lib/date';
import type { FlightDeal } from '@/types';

// Destinacions candidates per a l'oferta de cap de setmana. Es consulten en
// paral·lel; les que no tinguin preu en cache per aquestes dates concretes
// simplement no surten a la llista (no totes les rutes tenen cache per a
// qualsevol data exacta).
const CANDIDATE_DESTINATIONS = [
  'PMI', 'MAD', 'LIS', 'FCO', 'LHR', 'CDG', 'AMS', 'BER',
  'MUC', 'VIE', 'ZRH', 'BRU', 'DUB', 'CPH', 'ATH', 'IST',
];

// Sempre busca vols de divendres (a partir de les 18h) a diumenge, per a un
// escapada de cap de setmana des de BCN.
export async function getCheapestWeekendDealsFromBcn(): Promise<FlightDeal[]> {
  if (!hasTravelpayouts()) {
    return demoFlightDeals();
  }

  const { friday, sunday } = getNextWeekend();

  try {
    const results = await Promise.allSettled(
      CANDIDATE_DESTINATIONS.map((destination) =>
        travelpayoutsGet<any>('/v1/prices/direct', {
          origin: BCN_AIRPORT.code,
          destination,
          depart_date: friday,
          return_date: sunday,
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
        departureDate: cheapest.departure_at?.split('T')[0] ?? friday,
        returnDate: cheapest.return_at?.split('T')[0] ?? sunday,
        price: Number(cheapest.price ?? 0),
        currency: 'EUR',
        deepLink: buildAviasalesLink(BCN_AIRPORT.code, destination, cheapest.departure_at ?? friday, cheapest.return_at ?? sunday),
        source: 'live',
      });
    }

    deals.sort((a, b) => a.price - b.price);
    return deals.length > 0 ? deals.slice(0, 6) : demoFlightDeals();
  } catch (error) {
    console.error('[travelpayouts] fallback a dades de demo (deals):', error);
    return demoFlightDeals();
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

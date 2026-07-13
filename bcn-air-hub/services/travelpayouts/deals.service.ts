import { hasTravelpayouts } from '@/lib/env';
import { travelpayoutsGet } from './client';
import { demoFlightDeals } from '../demo-data';
import { BCN_AIRPORT } from '@/lib/constants';
import type { FlightDeal } from '@/types';

// Travelpayouts "City Directions": donat un origen, retorna el preu més barat
// trobat en cache (basat en cerques reals a Aviasales) cap a moltes
// destinacions. Ideal per mostrar la millor oferta des de BCN sense que
// l'usuari hagi de triar destí.
export async function getCheapestDealsFromBcn(): Promise<FlightDeal[]> {
  if (!hasTravelpayouts()) {
    return demoFlightDeals();
  }

  try {
    const data = await travelpayoutsGet<any>('/v1/city-directions', {
      origin: BCN_AIRPORT.code,
      currency: 'eur',
    });

    const entries = Object.entries(data.data ?? {}) as [string, any][];

    const deals: FlightDeal[] = entries
      .map(([destination, item]) => ({
        id: `${destination}-${item.flight_number ?? '0'}`,
        destination,
        departureDate: item.departure_at?.split('T')[0] ?? '',
        returnDate: item.return_at?.split('T')[0],
        price: Number(item.price ?? 0),
        currency: 'EUR',
        deepLink: buildAviasalesLink(BCN_AIRPORT.code, destination, item.departure_at, item.return_at),
        source: 'live' as const,
      }))
      .filter((deal) => deal.price > 0)
      .sort((a, b) => a.price - b.price)
      .slice(0, 6);

    return deals.length > 0 ? deals : demoFlightDeals();
  } catch (error) {
    console.error('[travelpayouts] fallback a dades de demo (deals):', error);
    return demoFlightDeals();
  }
}

function buildAviasalesLink(origin: string, destination: string, departureAt?: string, returnAt?: string): string {
  if (!departureAt) return 'https://www.aviasales.com';
  const depart = formatDDMM(departureAt);
  const back = returnAt ? formatDDMM(returnAt) : '';
  return `https://www.aviasales.com/search/${origin}${depart}${destination}${back}1`;
}

function formatDDMM(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}${month}`;
}

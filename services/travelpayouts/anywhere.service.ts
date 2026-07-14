import { hasTravelpayouts } from '@/lib/env';
import { travelpayoutsGet } from './client';
import { demoFlightDeals } from '../demo-data';
import type { FlightDeal } from '@/types';

// Travelpayouts "City Directions": donat només un origen (sense data ni
// destí fixats), retorna les destinacions més barates que hi ha en cache,
// cadascuna amb les seves pròpies dates. Útil per a "sorprèn-me, on és
// més barat volar ara mateix des d'aquí?".
export async function getCheapestAnywhere(origin: string): Promise<FlightDeal[]> {
  if (!hasTravelpayouts()) {
    return demoFlightDeals();
  }

  try {
    const data = await travelpayoutsGet<any>('/v1/city-directions', {
      origin,
      currency: 'eur',
    });

    const deals: FlightDeal[] = Object.entries(data.data ?? {})
      .map(([destination, item]: [string, any]) => ({
        id: `${destination}-${item.flight_number ?? '0'}`,
        destination,
        departureDate: item.departure_at?.split('T')[0] ?? '',
        returnDate: item.return_at?.split('T')[0],
        price: Number(item.price ?? 0),
        currency: 'EUR',
        deepLink: `https://www.aviasales.com/search/${origin}${destination}`,
        source: 'live' as const,
      }))
      .filter((deal) => deal.price > 0)
      .sort((a, b) => a.price - b.price);

    return deals.length > 0 ? deals.slice(0, 6) : demoFlightDeals();
  } catch (error) {
    console.error('[travelpayouts] fallback a dades de demo (anywhere):', error);
    return demoFlightDeals();
  }
}

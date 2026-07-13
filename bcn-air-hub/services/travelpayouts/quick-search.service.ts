import { hasTravelpayouts } from '@/lib/env';
import { travelpayoutsGet } from './client';
import { demoFlightOffers } from '../demo-data';
import type { FlightOffer } from '@/types';

// Cerca ràpida origen -> destí (fa servir /v1/prices/cheap, preus en cache
// del mes actual). Es fa servir per a la cerca ràpida "Ets l'Olga?".
export async function findCheapestDirectFlight(origin: string, destination: string): Promise<FlightOffer[]> {
  if (!hasTravelpayouts()) {
    return demoFlightOffers({ origin, destination, departureDate: new Date().toISOString().split('T')[0] });
  }

  try {
    const data = await travelpayoutsGet<any>('/v1/prices/cheap', {
      origin,
      destination,
      currency: 'eur',
    });

    const destinationData = data.data?.[destination] ?? {};
    const offers: FlightOffer[] = Object.values(destinationData).map((item: any, index: number) => ({
      id: `${destination}-${index}`,
      origin,
      destination,
      departureDate: item.departure_at ?? '',
      returnDate: item.return_at,
      durationMinutes: 0,
      price: Number(item.price ?? 0),
      currency: 'EUR',
      airline: item.airline ?? 'N/D',
      deepLink: 'https://www.aviasales.com',
      source: 'live',
    }));

    return offers.length > 0
      ? offers
      : demoFlightOffers({ origin, destination, departureDate: new Date().toISOString().split('T')[0] });
  } catch (error) {
    console.error('[travelpayouts] error cercant vol directe:', error);
    return demoFlightOffers({ origin, destination, departureDate: new Date().toISOString().split('T')[0] });
  }
}

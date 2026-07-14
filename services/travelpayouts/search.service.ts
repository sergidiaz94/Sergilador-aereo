import { hasTravelpayouts } from '@/lib/env';
import { travelpayoutsGet } from './client';
import { demoFlightOffers } from '../demo-data';
import type { FlightOffer } from '@/types';

// Cerca manual (com un cercador a l'estil Skyscanner): origen, destí i
// dates escollits per l'usuari. Fa servir /v1/prices/direct, que retorna
// fins a 3 opcions (directe, 1 escala, 2 escales) per a les dates exactes.
export async function searchFlightPrices(
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string,
): Promise<FlightOffer[]> {
  if (!hasTravelpayouts()) {
    return demoFlightOffers({ origin, destination, departureDate: departDate, returnDate });
  }

  try {
    const data = await travelpayoutsGet<any>('/v1/prices/direct', {
      origin,
      destination,
      depart_date: departDate,
      ...(returnDate ? { return_date: returnDate } : {}),
      currency: 'eur',
    });

    const options = Object.entries(data.data?.[destination] ?? {}) as [string, any][];

    const offers: FlightOffer[] = options
      .map(([stops, item]) => ({
        id: `${destination}-${stops}`,
        origin,
        destination,
        departureDate: item.departure_at ?? departDate,
        returnDate: item.return_at ?? returnDate,
        durationMinutes: 0,
        price: Number(item.price ?? 0),
        currency: 'EUR',
        airline: item.airline ?? 'N/D',
        deepLink: 'https://www.aviasales.com',
        stops: Number(stops),
        provider: 'Aviasales',
        source: 'live' as const,
      }))
      .sort((a, b) => a.price - b.price);

    return offers.length > 0
      ? offers
      : demoFlightOffers({ origin, destination, departureDate: departDate, returnDate });
  } catch (error) {
    console.error('[travelpayouts] error a la cerca manual:', error);
    return demoFlightOffers({ origin, destination, departureDate: departDate, returnDate });
  }
}

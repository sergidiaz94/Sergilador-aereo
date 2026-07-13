import { hasAmadeus } from '@/lib/env';
import { amadeusGet } from './client';
import { demoFlightDeals } from '../demo-data';
import { BCN_AIRPORT } from '@/lib/constants';
import type { FlightDeal } from '@/types';

// Amadeus "Flight Inspiration Search": donat només un origen, retorna les
// destinacions més barates disponibles amb data d'anada/tornada. Ideal per
// mostrar la millor oferta des de BCN sense que l'usuari hagi de triar destí.
export async function getCheapestDealsFromBcn(): Promise<FlightDeal[]> {
  if (!hasAmadeus()) {
    return demoFlightDeals();
  }

  try {
    const data = await amadeusGet<any>('/v1/shopping/flight-destinations', {
      origin: BCN_AIRPORT.code,
    });

    const deals: FlightDeal[] = (data.data ?? [])
      .map((item: any, index: number) => ({
        id: `${item.destination}-${index}`,
        destination: item.destination,
        departureDate: item.departureDate,
        returnDate: item.returnDate,
        price: Number(item.price?.total ?? 0),
        currency: 'EUR',
        deepLink: 'https://www.vueling.com',
        source: 'live' as const,
      }))
      .sort((a: FlightDeal, b: FlightDeal) => a.price - b.price);

    return deals.length > 0 ? deals : demoFlightDeals();
  } catch (error) {
    console.error('[amadeus] fallback a dades de demo (deals):', error);
    return demoFlightDeals();
  }
}

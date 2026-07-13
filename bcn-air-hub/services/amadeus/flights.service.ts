import { hasAmadeus } from '@/lib/env';
import { amadeusGet } from './client';
import { demoFlightOffers } from '../demo-data';
import type { FlightOffer, FlightSearchParams } from '@/types';

export async function searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
  if (!hasAmadeus()) {
    return demoFlightOffers(params);
  }

  try {
    const data = await amadeusGet<any>('/v2/shopping/flight-offers', {
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      ...(params.returnDate ? { returnDate: params.returnDate } : {}),
      adults: String(params.adults ?? 1),
      max: '5',
      currencyCode: 'EUR',
    });

    const offers = (data.data ?? []).map(mapAmadeusOffer);
    return offers.length > 0 ? offers : demoFlightOffers(params);
  } catch (error) {
    console.error('[amadeus] fallback a dades de demo:', error);
    return demoFlightOffers(params);
  }
}

function mapAmadeusOffer(offer: any): FlightOffer {
  const itinerary = offer.itineraries?.[0];
  const segments = itinerary?.segments ?? [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  return {
    id: offer.id,
    origin: firstSegment?.departure?.iataCode ?? '',
    destination: lastSegment?.arrival?.iataCode ?? '',
    departureDate: firstSegment?.departure?.at ?? '',
    returnDate: offer.itineraries?.[1]?.segments?.[0]?.departure?.at,
    durationMinutes: parseISODuration(itinerary?.duration),
    price: Number(offer.price?.total ?? 0),
    currency: offer.price?.currency ?? 'EUR',
    airline: offer.validatingAirlineCodes?.[0] ?? 'N/D',
    deepLink: 'https://www.vueling.com',
    source: 'live',
  };
}

function parseISODuration(duration?: string): number {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = Number(match?.[1] ?? 0);
  const minutes = Number(match?.[2] ?? 0);
  return hours * 60 + minutes;
}

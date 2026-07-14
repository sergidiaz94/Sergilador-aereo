import { hasFlightsSky } from '@/lib/env';
import { flightsSkyGet } from './client';
import type { FlightOffer } from '@/types';

// "Flights Scraper Sky" (Skyscanner no oficial, via RapidAPI). És una API
// asíncrona: la primera resposta pot venir amb estat "incomplete" mentre
// el servidor encara està agregant resultats. Com que no tenim confirmat
// el paràmetre exacte de sessió per fer polling correctament, fem un
// parell de reintents curts de la mateixa consulta abans de conformar-nos
// amb els resultats parcials (o cap) que hi hagi.
export async function searchRoundtripSkyscanner(
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string,
): Promise<FlightOffer[]> {
  if (!hasFlightsSky()) {
    return [];
  }

  const params: Record<string, string> = {
    placeIdFrom: origin,
    placeIdTo: destination,
    departDate,
    currency: 'EUR',
  };
  if (returnDate) params.returnDate = returnDate;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const data = await flightsSkyGet<any>('/web/flights/search-roundtrip', params);
      const status = data?.data?.context?.status;
      const results = data?.data?.itineraries?.results ?? data?.data?.itineraries ?? [];

      if (Array.isArray(results) && results.length > 0) {
        return mapResults(results, origin, destination);
      }

      if (status !== 'incomplete') {
        return [];
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));
    } catch (error) {
      console.error('[flights-sky] error a la cerca (Skyscanner no oficial):', error);
      return [];
    }
  }

  return [];
}

function mapResults(results: any[], origin: string, destination: string): FlightOffer[] {
  return results
    .map((item, index) => {
      const price = Number(
        item.price?.raw ?? item.price?.amount ?? item.price?.formatted?.replace(/[^\d.]/g, '') ?? 0,
      );
      if (!price) return null;

      const airline =
        item.legs?.[0]?.carriers?.marketing?.[0]?.name ?? item.legs?.[0]?.carriers?.[0]?.name ?? 'N/D';

      const offer: FlightOffer = {
        id: `sky-${destination}-${index}`,
        origin,
        destination,
        departureDate: item.legs?.[0]?.departure ?? '',
        returnDate: item.legs?.[1]?.departure,
        durationMinutes: item.legs?.[0]?.durationInMinutes ?? 0,
        price,
        currency: 'EUR',
        airline,
        deepLink: item.deeplink ?? 'https://www.skyscanner.net',
        stops: item.legs?.[0]?.stopCount ?? 0,
        provider: 'Skyscanner',
        source: 'live',
      };
      return offer;
    })
    .filter((offer): offer is FlightOffer => offer !== null)
    .sort((a, b) => a.price - b.price);
}

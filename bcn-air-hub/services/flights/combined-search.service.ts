import { searchFlightPrices } from '../travelpayouts/search.service';
import { searchRoundtripSkyscanner } from '../flights-sky/search.service';
import { demoFlightOffers } from '../demo-data';
import type { FlightOffer } from '@/types';

// Combina resultats de Travelpayouts (Aviasales) i de l'API no oficial
// Skyscanner (flights-sky), i els retorna ordenats per preu. Si una font
// falla o no té clau configurada, simplement no hi aporta res; l'altra
// font continua funcionant amb normalitat.
export async function searchCombinedFlights(
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string,
): Promise<FlightOffer[]> {
  const [travelpayoutsResult, skyscannerResult] = await Promise.allSettled([
    searchFlightPrices(origin, destination, departDate, returnDate),
    searchRoundtripSkyscanner(origin, destination, departDate, returnDate),
  ]);

  const travelpayoutsOffers = travelpayoutsResult.status === 'fulfilled' ? travelpayoutsResult.value : [];
  const skyscannerOffers = skyscannerResult.status === 'fulfilled' ? skyscannerResult.value : [];

  // Si Travelpayouts ha hagut de caure a demo (sense clau o sense resultats
  // en cache) i Skyscanner sí que ha trobat alguna cosa real, prioritzem
  // els resultats reals de Skyscanner en comptes de barrejar-los amb demo.
  const travelpayoutsIsDemo = travelpayoutsOffers.every((offer) => offer.source === 'demo');

  if (travelpayoutsIsDemo && skyscannerOffers.length > 0) {
    return skyscannerOffers;
  }

  const combined = [...travelpayoutsOffers, ...skyscannerOffers].sort((a, b) => a.price - b.price);

  return combined.length > 0
    ? combined
    : demoFlightOffers({ origin, destination, departureDate: departDate, returnDate });
}

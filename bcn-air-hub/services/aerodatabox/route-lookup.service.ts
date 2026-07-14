import { hasAeroDataBox } from '@/lib/env';
import { aeroDataBoxGet } from './client';

export type FlightRoute = { departureAirport: string; arrivalAirport: string } | null;

// Cerca la ruta (origen -> destí) d'un vol en directe a partir del seu
// indicatiu (callsign) tal com el dona l'ADS-B. És una consulta "best
// effort": si l'indicatiu no coincideix amb cap vol conegut (habitual en
// aviació general/privada) o l'API no reconeix el format, simplement no
// hi ha ruta disponible i no es mostra res, sense trencar la resta de la UI.
export async function getRouteByCallsign(callsign: string): Promise<FlightRoute> {
  if (!hasAeroDataBox() || !callsign || callsign === 'N/D') {
    return null;
  }

  try {
    const data = await aeroDataBoxGet<any[]>(`/flights/callsign/${encodeURIComponent(callsign.trim())}`);
    const flight = data?.[0];
    const departureAirport = flight?.departure?.airport?.iata;
    const arrivalAirport = flight?.arrival?.airport?.iata;

    if (!departureAirport || !arrivalAirport) {
      return null;
    }

    return { departureAirport, arrivalAirport };
  } catch {
    return null;
  }
}

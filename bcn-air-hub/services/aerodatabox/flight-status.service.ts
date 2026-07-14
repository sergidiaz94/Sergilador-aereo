import { hasAeroDataBox } from '@/lib/env';
import { aeroDataBoxGet } from './client';
import { demoFlightStatus } from '../demo-data';
import type { FlightStatusInfo } from '@/types';

export type FlightStatusResult =
  | { kind: 'demo'; status: FlightStatusInfo }
  | { kind: 'found'; status: FlightStatusInfo }
  | { kind: 'not-found' };

// AeroDataBox "Flight status by number". Distingim explícitament entre
// "no configurat" (mostrem demo perquè no hi ha clau) i "configurat però
// el vol no existeix" (el número de vol no és vàlid per aquesta data): en
// aquest segon cas NO s'ha de mostrar demo, perquè donaria la falsa
// impressió que el vol és real.
export async function getFlightStatus(
  carrierCode: string,
  flightNumber: string,
  date: string,
): Promise<FlightStatusResult> {
  if (!hasAeroDataBox()) {
    return { kind: 'demo', status: demoFlightStatus(carrierCode, flightNumber) };
  }

  try {
    const data = await aeroDataBoxGet<any[]>(`/flights/number/${carrierCode}${flightNumber}/${date}`);
    const flight = data?.[0];

    if (!flight) {
      return { kind: 'not-found' };
    }

    const departure = flight.departure;
    const arrival = flight.arrival;

    const scheduledDep = departure?.scheduledTime?.utc;
    const estimatedDep = departure?.actualTime?.utc ?? departure?.runwayTime?.utc ?? departure?.predictedTime?.utc;
    const scheduledArr = arrival?.scheduledTime?.utc;
    const estimatedArr = arrival?.actualTime?.utc ?? arrival?.runwayTime?.utc ?? arrival?.predictedTime?.utc;

    const delayMinutes =
      scheduledDep && estimatedDep
        ? Math.max(0, Math.round((new Date(estimatedDep).getTime() - new Date(scheduledDep).getTime()) / 60_000))
        : 0;

    const status: FlightStatusInfo = {
      flightNumber: `${carrierCode}${flightNumber}`,
      airline: flight.airline?.name ?? carrierCode,
      aircraftModel: flight.aircraft?.model,
      departureAirport: departure?.airport?.iata ?? '',
      arrivalAirport: arrival?.airport?.iata ?? '',
      departureLat: departure?.airport?.location?.lat,
      departureLng: departure?.airport?.location?.lon,
      arrivalLat: arrival?.airport?.location?.lat,
      arrivalLng: arrival?.airport?.location?.lon,
      scheduledDeparture: scheduledDep ?? '',
      estimatedDeparture: estimatedDep,
      scheduledArrival: scheduledArr,
      estimatedArrival: estimatedArr,
      delayMinutes,
      gate: departure?.gate,
      terminal: departure?.terminal,
      status: flight.status ?? (delayMinutes > 0 ? 'Retardat' : "A l'hora"),
      source: 'live',
    };

    return { kind: 'found', status };
  } catch (error) {
    console.error('[aerodatabox] error consultant el vol:', error);
    return { kind: 'not-found' };
  }
}

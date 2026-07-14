import { hasAeroDataBox } from '@/lib/env';
import { aeroDataBoxGet } from './client';
import { demoFlightStatus } from '../demo-data';
import type { FlightStatusInfo } from '@/types';

// AeroDataBox "Flight status by number". Nota: alguns camps operacionals
// (porta, terminal) només estan disponibles per a vols propers/en curs;
// per a vols llunyans en el temps poden venir buits.
export async function getFlightStatus(
  carrierCode: string,
  flightNumber: string,
  date: string,
): Promise<FlightStatusInfo> {
  if (!hasAeroDataBox()) {
    return demoFlightStatus(carrierCode, flightNumber);
  }

  try {
    const data = await aeroDataBoxGet<any[]>(`/flights/number/${carrierCode}${flightNumber}/${date}`);
    const flight = data?.[0];

    if (!flight) {
      return demoFlightStatus(carrierCode, flightNumber);
    }

    const departure = flight.departure;
    const scheduled = departure?.scheduledTime?.utc;
    const estimated = departure?.actualTime?.utc ?? departure?.runwayTime?.utc ?? departure?.predictedTime?.utc;
    const delayMinutes =
      scheduled && estimated
        ? Math.max(0, Math.round((new Date(estimated).getTime() - new Date(scheduled).getTime()) / 60_000))
        : 0;

    return {
      flightNumber: `${carrierCode}${flightNumber}`,
      airline: flight.airline?.name ?? carrierCode,
      aircraftModel: flight.aircraft?.model,
      departureAirport: departure?.airport?.iata ?? '',
      arrivalAirport: flight.arrival?.airport?.iata ?? '',
      scheduledDeparture: scheduled ?? '',
      estimatedDeparture: estimated,
      delayMinutes,
      gate: departure?.gate,
      terminal: departure?.terminal,
      status: flight.status ?? (delayMinutes > 0 ? 'Retardat' : "A l'hora"),
      source: 'live',
    };
  } catch (error) {
    console.error('[aerodatabox] fallback a dades de demo (flight status):', error);
    return demoFlightStatus(carrierCode, flightNumber);
  }
}

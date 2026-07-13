import { hasAmadeus } from '@/lib/env';
import { amadeusGet } from './client';
import { demoFlightStatus } from '../demo-data';
import type { FlightStatusInfo } from '@/types';

// Amadeus "On-Demand Flight Status" (v2/schedule/flights). Nota: els noms
// exactes dels camps de la resposta real val la pena verificar-los amb una
// clau activa; el mapeig es basa en l'estructura documentada per Amadeus.
export async function getFlightStatus(
  carrierCode: string,
  flightNumber: string,
  date: string,
): Promise<FlightStatusInfo> {
  if (!hasAmadeus()) {
    return demoFlightStatus(carrierCode, flightNumber);
  }

  try {
    const data = await amadeusGet<any>('/v2/schedule/flights', {
      carrierCode,
      flightNumber,
      scheduledDepartureDate: date,
    });

    const flight = data.data?.[0];
    if (!flight) {
      return demoFlightStatus(carrierCode, flightNumber);
    }

    const departurePoint = flight.flightPoints?.find((point: any) => point.departure);
    const arrivalPoint = flight.flightPoints?.find((point: any) => point.arrival);
    const departure = departurePoint?.departure;

    const scheduled = departure?.timings?.find((t: any) => t.qualifier === 'STD')?.value;
    const estimated = departure?.timings?.find((t: any) => t.qualifier === 'ETD')?.value;
    const delayMinutes =
      scheduled && estimated
        ? Math.max(0, Math.round((new Date(estimated).getTime() - new Date(scheduled).getTime()) / 60_000))
        : 0;

    const aircraftModel = flight.legs?.[0]?.aircraftEquipment?.aircraftType;

    return {
      flightNumber: `${carrierCode}${flightNumber}`,
      airline: carrierCode,
      aircraftModel,
      departureAirport: departurePoint?.iataCode ?? '',
      arrivalAirport: arrivalPoint?.iataCode ?? '',
      scheduledDeparture: scheduled ?? '',
      estimatedDeparture: estimated,
      delayMinutes,
      gate: departure?.gate?.mainGate,
      terminal: departure?.terminal?.code,
      status: delayMinutes > 0 ? 'Retardat' : "A l'hora",
      source: 'live',
    };
  } catch (error) {
    console.error('[amadeus] fallback a dades de demo (flight status):', error);
    return demoFlightStatus(carrierCode, flightNumber);
  }
}

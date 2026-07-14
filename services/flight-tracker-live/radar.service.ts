import { hasFlightTrackerLive } from '@/lib/env';
import { flightTrackerSearch } from './client';
import { demoRadarSnapshot } from '../demo-data';
import { haversineKm } from '@/lib/geo';
import { RADAR_RADIUS_KM } from '@/lib/constants';
import type { RadarSnapshot, LiveFlight, RadarOrigin } from '@/types';

const KM_TO_NM = 0.539957;

export async function getLiveRadar(origin: RadarOrigin): Promise<RadarSnapshot> {
  if (!hasFlightTrackerLive()) {
    return demoRadarSnapshot(origin);
  }

  try {
    const radiusNm = Math.min(250, Math.round(RADAR_RADIUS_KM * KM_TO_NM));
    const data = await flightTrackerSearch({
      latitude: origin.lat,
      longitude: origin.lng,
      radiusNm,
    });

    const aircraft = data?.data?.aircraft ?? [];

    const flights: LiveFlight[] = aircraft
      .filter((a: any) => typeof a.latitude === 'number' && typeof a.longitude === 'number')
      .map((a: any) => ({
        id: a.hex ?? a.callsign ?? `${a.latitude}-${a.longitude}`,
        callsign: (a.callsign ?? '').trim() || 'N/D',
        latitude: a.latitude,
        longitude: a.longitude,
        // altitudeFt (peus) -> metres, per mantenir la mateixa unitat interna que abans.
        altitude: typeof a.altitudeFt === 'number' ? a.altitudeFt * 0.3048 : null,
        // groundSpeedKt (nusos) -> m/s, perquè la resta de la UI ja assumeix m/s.
        velocity: typeof a.groundSpeedKt === 'number' ? a.groundSpeedKt * 0.514444 : null,
        heading: a.heading ?? a.track ?? null,
        onGround: Boolean(a.onGround),
        distanceKm: Math.round(haversineKm(origin.lat, origin.lng, a.latitude, a.longitude)),
        model: a.aircraftType,
        registration: a.registration,
      }))
      .sort((a: LiveFlight, b: LiveFlight) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
      .slice(0, 12);

    if (flights.length === 0) {
      return demoRadarSnapshot(origin);
    }

    return { origin, flights, source: 'live', fetchedAt: new Date().toISOString() };
  } catch (error) {
    console.error('[flight-tracker-live] fallback a dades de demo:', error);
    return demoRadarSnapshot(origin);
  }
}

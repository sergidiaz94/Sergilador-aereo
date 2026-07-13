import { openSkyGetStates } from './client';
import { demoRadarSnapshot } from '../demo-data';
import { haversineKm } from '@/lib/geo';
import { RADAR_RADIUS_KM } from '@/lib/constants';
import type { RadarSnapshot, LiveFlight, RadarOrigin } from '@/types';

export async function getLiveRadar(origin: RadarOrigin): Promise<RadarSnapshot> {
  try {
    // Aproximació: 1 grau de latitud ~ 111 km.
    const delta = RADAR_RADIUS_KM / 111;
    const raw = await openSkyGetStates({
      lamin: origin.lat - delta,
      lomin: origin.lng - delta,
      lamax: origin.lat + delta,
      lomax: origin.lng + delta,
    });

    const flights: LiveFlight[] = (raw.states ?? [])
      .filter((state: any[]) => state[5] !== null && state[6] !== null)
      .map((state: any[]) => {
        const longitude = state[5];
        const latitude = state[6];
        return {
          id: state[0],
          callsign: (state[1] ?? '').trim() || 'N/D',
          originCountry: state[2],
          latitude,
          longitude,
          altitude: state[7],
          velocity: state[9],
          heading: state[10],
          onGround: Boolean(state[8]),
          distanceKm: Math.round(haversineKm(origin.lat, origin.lng, latitude, longitude)),
        };
      })
      .sort((a: LiveFlight, b: LiveFlight) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
      .slice(0, 12);

    if (flights.length === 0) {
      return demoRadarSnapshot(origin);
    }

    return { origin, flights, source: 'live', fetchedAt: new Date().toISOString() };
  } catch (error) {
    console.error('[opensky] fallback a dades de demo:', error);
    return demoRadarSnapshot(origin);
  }
}

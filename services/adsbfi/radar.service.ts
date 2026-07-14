import { adsbFiGet } from './client';
import { demoRadarSnapshot } from '../demo-data';
import { haversineKm } from '@/lib/geo';
import { RADAR_RADIUS_KM } from '@/lib/constants';
import type { RadarSnapshot, LiveFlight, RadarOrigin } from '@/types';

const KM_TO_NM = 0.539957;

export async function getLiveRadar(origin: RadarOrigin): Promise<RadarSnapshot> {
  try {
    const distNm = Math.min(250, Math.round(RADAR_RADIUS_KM * KM_TO_NM));
    const data = await adsbFiGet(origin.lat, origin.lng, distNm);
    const aircraftList = data?.ac ?? [];

    const flights: LiveFlight[] = aircraftList
      .filter((a: any) => typeof a.lat === 'number' && typeof a.lon === 'number')
      .map((a: any) => {
        const altitudeFt = typeof a.alt_baro === 'number' ? a.alt_baro : null;
        const gsKt = typeof a.gs === 'number' ? a.gs : null;

        return {
          id: a.hex ?? `${a.lat}-${a.lon}`,
          callsign: (a.flight ?? '').trim() || 'N/D',
          latitude: a.lat,
          longitude: a.lon,
          // alt_baro (peus) -> metres; pot ser el string "ground" en lloc de número.
          altitude: altitudeFt !== null ? altitudeFt * 0.3048 : null,
          // gs (nusos) -> m/s, per mantenir la mateixa unitat interna d'abans.
          velocity: gsKt !== null ? gsKt * 0.514444 : null,
          heading: typeof a.track === 'number' ? a.track : null,
          onGround: a.alt_baro === 'ground',
          distanceKm: Math.round(haversineKm(origin.lat, origin.lng, a.lat, a.lon)),
          model: a.t,
          registration: a.r,
        } satisfies LiveFlight;
      })
      .sort((a: LiveFlight, b: LiveFlight) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
      .slice(0, 12);

    if (flights.length === 0) {
      return demoRadarSnapshot(origin);
    }

    return { origin, flights, source: 'live', fetchedAt: new Date().toISOString() };
  } catch (error) {
    console.error('[adsb.fi] fallback a dades de demo:', error);
    return demoRadarSnapshot(origin);
  }
}

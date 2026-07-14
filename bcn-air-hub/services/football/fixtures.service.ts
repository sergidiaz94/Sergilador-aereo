import { hasFootballData, env } from '@/lib/env';
import { footballDataGet } from './client';
import { demoRcdeFixture, demoFlightCombinations } from '../demo-data';
import type { RcdeTourPlan, RcdeFixture } from '@/types';

export async function getNextRcdeTourPlan(): Promise<RcdeTourPlan> {
  if (!hasFootballData()) {
    return { fixture: demoRcdeFixture(), combinations: demoFlightCombinations(), source: 'demo' };
  }

  try {
    // No filtrem per status=SCHEDULED: en alguns moments de la temporada
    // (aturades, canvis de calendari) el filtre pot deixar la resposta
    // buida encara que hi hagi partits propers. Demanem els últims/pròxims
    // partits sense filtrar i triem nosaltres el primer que sigui futur.
    const data = await footballDataGet<any>(`/teams/${env.footballData.teamId}/matches?limit=20`);
    const now = Date.now();

    const upcoming = (data.matches ?? [])
      .filter((match: any) => new Date(match.utcDate).getTime() > now)
      .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    const match = upcoming[0];

    if (!match) {
      return { fixture: demoRcdeFixture(), combinations: demoFlightCombinations(), source: 'demo' };
    }

    const fixture: RcdeFixture = {
      id: String(match.id),
      competition: match.competition?.name ?? '',
      homeTeam: match.homeTeam?.name ?? '',
      awayTeam: match.awayTeam?.name ?? '',
      utcDate: match.utcDate,
      venue: match.venue,
      status: match.status,
    };

    // Les combinacions de vols encara es generen amb el generador de demo;
    // es poden connectar a una cerca real a partir de la data/hora real
    // del partit (fixture.utcDate) en una següent iteració.
    return { fixture, combinations: demoFlightCombinations(), source: 'live' };
  } catch (error) {
    console.error('[football-data] fallback a dades de demo:', error);
    return { fixture: demoRcdeFixture(), combinations: demoFlightCombinations(), source: 'demo' };
  }
}

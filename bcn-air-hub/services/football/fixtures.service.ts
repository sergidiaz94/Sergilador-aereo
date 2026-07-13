import { hasFootballData, env } from '@/lib/env';
import { footballDataGet } from './client';
import { demoRcdeFixture, demoFlightCombinations } from '../demo-data';
import type { RcdeTourPlan, RcdeFixture } from '@/types';

export async function getNextRcdeTourPlan(): Promise<RcdeTourPlan> {
  if (!hasFootballData()) {
    return { fixture: demoRcdeFixture(), combinations: demoFlightCombinations(), source: 'demo' };
  }

  try {
    const data = await footballDataGet<any>(
      `/teams/${env.footballData.teamId}/matches?status=SCHEDULED&limit=1`,
    );
    const match = data.matches?.[0];

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
    // es poden connectar a una cerca real d'Amadeus a partir de la data/hora
    // real del partit (fixture.utcDate) en una següent iteració.
    return { fixture, combinations: demoFlightCombinations(), source: 'live' };
  } catch (error) {
    console.error('[football-data] fallback a dades de demo:', error);
    return { fixture: demoRcdeFixture(), combinations: demoFlightCombinations(), source: 'demo' };
  }
}

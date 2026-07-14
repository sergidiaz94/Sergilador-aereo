import { hasFootballData, env } from '@/lib/env';
import { footballDataGet } from './client';
import { demoRcdeFixtures } from '../demo-data';
import { getClubTravelInfo } from '@/lib/club-travel-info';
import type { RcdeUpcomingFixture, RcdeToursResponse } from '@/types';

const RCDE_TEAM_NAME = 'RCD Espanyol de Barcelona';
// Si el partit és a més de 21 dies vista, considerem que l'horari encara
// no és definitiu (LaLiga sol confirmar horaris ~2-3 setmanes abans).
const TIME_CONFIRMATION_WINDOW_DAYS = 21;
const NON_PLAYABLE_STATUSES = new Set(['POSTPONED', 'SUSPENDED', 'CANCELLED']);

export async function getRcdeUpcomingFixtures(): Promise<RcdeToursResponse> {
  if (!hasFootballData()) {
    return { fixtures: demoRcdeFixtures(), source: 'demo' };
  }

  try {
    const data = await footballDataGet<any>(`/teams/${env.footballData.teamId}/matches?limit=50`);
    const now = Date.now();

    const upcoming = (data.matches ?? [])
      .filter((match: any) => new Date(match.utcDate).getTime() > now && match.status !== 'FINISHED')
      .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
      .slice(0, 8);

    if (upcoming.length === 0) {
      return { fixtures: demoRcdeFixtures(), source: 'demo' };
    }

    return { fixtures: upcoming.map(buildFixture), source: 'live' };
  } catch (error) {
    console.error('[football-data] fallback a dades de demo (RCDE):', error);
    return { fixtures: demoRcdeFixtures(), source: 'demo' };
  }
}

function buildFixture(match: any): RcdeUpcomingFixture {
  const isHome = match.homeTeam?.name === RCDE_TEAM_NAME;
  const opponent = isHome ? match.awayTeam?.name : match.homeTeam?.name;
  const kickoff = new Date(match.utcDate);
  const daysAway = (kickoff.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  const timeConfirmed = daysAway <= TIME_CONFIRMATION_WINDOW_DAYS;

  const base: RcdeUpcomingFixture = {
    id: String(match.id),
    competition: match.competition?.name ?? '',
    homeTeam: match.homeTeam?.name ?? '',
    awayTeam: match.awayTeam?.name ?? '',
    utcDate: match.utcDate,
    venue: match.venue,
    status: match.status,
    isHome,
    timeConfirmed,
    ontour: null,
  };

  if (isHome) {
    return base;
  }

  if (NON_PLAYABLE_STATUSES.has(match.status)) {
    return {
      ...base,
      ontour: { possible: false, reason: 'Partit ajornat, suspès o cancel·lat: sense data confirmada.' },
    };
  }

  const travelInfo = getClubTravelInfo(opponent ?? '');

  if (!travelInfo || !travelInfo.airportCode) {
    return {
      ...base,
      ontour: { possible: false, reason: 'No hi ha cap aeroport proper a la destinació.' },
    };
  }

  let windowStart: string;
  let windowEnd: string;

  if (timeConfirmed) {
    // Marge d'1h abans de l'hora d'inici del partit un cop restat el
    // trasllat aeroport -> estadi; tornada calculada a partir del final
    // aproximat del partit (105 min) més el trasllat de tornada.
    const arrivalCutoff = new Date(kickoff.getTime() - (travelInfo.travelMinutes + 60) * 60_000);
    const returnEarliest = new Date(kickoff.getTime() + (105 + travelInfo.travelMinutes) * 60_000);
    windowStart = arrivalCutoff.toISOString();
    windowEnd = returnEarliest.toISOString();
  } else {
    // Horari pendent de confirmar: oferim la finestra genèrica de cap de
    // setmana (divendres tarda - diumenge nit) sobre la data del partit.
    const friday = new Date(kickoff);
    friday.setHours(18, 0, 0, 0);
    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);
    sunday.setHours(22, 0, 0, 0);
    windowStart = friday.toISOString();
    windowEnd = sunday.toISOString();
  }

  return {
    ...base,
    ontour: {
      possible: true,
      destinationAirport: travelInfo.airportCode,
      destinationCity: travelInfo.city,
      travelMinutesFromAirport: travelInfo.travelMinutes,
      windowStart,
      windowEnd,
    },
  };
}

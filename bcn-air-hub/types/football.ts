import type { DataSource } from './common';

export type RcdeOntourInfo = {
  possible: boolean;
  reason?: string;
  destinationAirport?: string;
  destinationCity?: string;
  travelMinutesFromAirport?: number;
  windowStart?: string;
  windowEnd?: string;
};

export type RcdeUpcomingFixture = {
  id: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  utcDate: string;
  venue?: string;
  status: string;
  isHome: boolean;
  timeConfirmed: boolean;
  ontour: RcdeOntourInfo | null;
};

export type RcdeToursResponse = {
  fixtures: RcdeUpcomingFixture[];
  source: DataSource;
};

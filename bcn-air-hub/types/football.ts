import type { DataSource } from './common';

export type RcdeFixture = {
  id: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  utcDate: string;
  venue?: string;
  status: string;
};

export type FlightCombination = {
  id: string;
  label: string;
  outbound: { flightNumber: string; departure: string; arrival: string; route: string };
  inbound: { flightNumber: string; departure: string; arrival: string; route: string };
  idealFor: string;
  price: number;
  currency: string;
  bookingLink: string;
};

export type RcdeTourPlan = {
  fixture: RcdeFixture | null;
  combinations: FlightCombination[];
  source: DataSource;
};

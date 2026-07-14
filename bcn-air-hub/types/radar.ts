import type { DataSource } from './common';

export type LiveFlight = {
  id: string;
  callsign: string;
  originCountry?: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
  velocity: number | null;
  heading: number | null;
  onGround: boolean;
  distanceKm?: number;
  model?: string;
  registration?: string;
};

export type RadarOrigin = { lat: number; lng: number; label: string };

export type RadarSnapshot = {
  origin: RadarOrigin;
  flights: LiveFlight[];
  source: DataSource;
  fetchedAt: string;
};

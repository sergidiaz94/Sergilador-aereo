import type { DataSource } from './common';

export type FlightSearchParams = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
};

export type FlightOffer = {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  durationMinutes: number;
  price: number;
  currency: string;
  airline: string;
  deepLink: string;
  source: DataSource;
};

// Oferta d'anada/tornada des d'un origen fix (BCN), sense destinació escollida
// per l'usuari: prové de l'Amadeus Flight Inspiration Search.
export type FlightDeal = {
  id: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  currency: string;
  deepLink: string;
  source: DataSource;
};

export type FlightStatusInfo = {
  flightNumber: string;
  airline: string;
  aircraftModel?: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  estimatedDeparture?: string;
  delayMinutes: number;
  gate?: string;
  terminal?: string;
  status: string;
  source: DataSource;
};

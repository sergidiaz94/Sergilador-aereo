// Proveïdor de dades de demo. S'utilitza automàticament quan una integració
// real no té les claus d'API configurades, per garantir que la UI sempre
// tingui contingut coherent per mostrar.
import { getNextWeekend } from '@/lib/date';
import type {
  FlightOffer,
  FlightSearchParams,
  FlightDeal,
  FlightStatusInfo,
  RadarOrigin,
  RadarSnapshot,
  LiveFlight,
  RcdeFixture,
  FlightCombination,
} from '@/types';

export function demoFlightOffers(params: FlightSearchParams): FlightOffer[] {
  const base: Omit<FlightOffer, 'id'>[] = [
    {
      origin: params.origin,
      destination: params.destination || 'PMI',
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      durationMinutes: 50,
      price: 28,
      currency: 'EUR',
      airline: 'Ryanair',
      deepLink: 'https://www.ryanair.com',
      source: 'demo',
    },
    {
      origin: params.origin,
      destination: params.destination || 'FCO',
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      durationMinutes: 130,
      price: 45,
      currency: 'EUR',
      airline: 'Vueling',
      deepLink: 'https://www.vueling.com',
      source: 'demo',
    },
  ];
  return base.map((offer, index) => ({ ...offer, id: `demo-${index}` }));
}

export function demoRadarSnapshot(origin: RadarOrigin): RadarSnapshot {
  const flights: LiveFlight[] = [
    {
      id: 'demo-1',
      callsign: 'VLG1883',
      originCountry: 'Alemanya',
      latitude: origin.lat + 0.08,
      longitude: origin.lng + 0.05,
      altitude: 3200,
      velocity: 145,
      heading: 210,
      onGround: false,
      distanceKm: 12,
      model: 'Airbus A321-271NX',
      registration: 'EC-NMT',
    },
    {
      id: 'demo-2',
      callsign: 'RYR42LL',
      originCountry: 'Regne Unit',
      latitude: origin.lat - 0.15,
      longitude: origin.lng + 0.2,
      altitude: 1800,
      velocity: 130,
      heading: 95,
      onGround: false,
      distanceKm: 28,
      model: 'Boeing 737 MAX 8',
      registration: 'EI-HGP',
    },
  ];
  return { origin, flights, source: 'demo', fetchedAt: new Date().toISOString() };
}

export function demoRcdeFixture(): RcdeFixture {
  return {
    id: 'demo-fixture',
    competition: 'LaLiga',
    homeTeam: 'Real Sociedad',
    awayTeam: 'RCD Espanyol',
    utcDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Reale Arena',
    status: 'SCHEDULED',
  };
}

export function demoFlightDeals(): FlightDeal[] {
  const { friday, sunday } = getNextWeekend();

  const deals: Omit<FlightDeal, 'id'>[] = [
    {
      destination: 'PMI',
      departureDate: friday,
      returnDate: sunday,
      price: 28,
      currency: 'EUR',
      deepLink: 'https://www.ryanair.com',
      source: 'demo',
    },
    {
      destination: 'LIS',
      departureDate: friday,
      returnDate: sunday,
      price: 39,
      currency: 'EUR',
      deepLink: 'https://www.vueling.com',
      source: 'demo',
    },
    {
      destination: 'FCO',
      departureDate: friday,
      returnDate: sunday,
      price: 45,
      currency: 'EUR',
      deepLink: 'https://www.vueling.com',
      source: 'demo',
    },
    {
      destination: 'AMS',
      departureDate: friday,
      returnDate: sunday,
      price: 62,
      currency: 'EUR',
      deepLink: 'https://www.vueling.com',
      source: 'demo',
    },
  ];

  return deals
    .map((deal, index) => ({ ...deal, id: `demo-deal-${index}` }))
    .sort((a, b) => a.price - b.price);
}

export function demoFlightStatus(carrierCode: string, flightNumber: string): FlightStatusInfo {
  return {
    flightNumber: `${carrierCode}${flightNumber}`,
    airline: carrierCode,
    aircraftModel: 'Airbus A320neo',
    departureAirport: 'BCN',
    arrivalAirport: 'MAD',
    scheduledDeparture: new Date().toISOString(),
    estimatedDeparture: new Date(Date.now() + 20 * 60_000).toISOString(),
    delayMinutes: 20,
    gate: 'B14',
    terminal: '1',
    status: 'Retardat',
    source: 'demo',
  };
}

export function demoOlgaOffers(origin: string, destination: string): FlightOffer[] {
  const base = new Date();
  base.setDate(base.getDate() + 1);

  const prices = [42, 58, 71];
  return prices.map((price, index) => {
    const departure = new Date(base);
    departure.setDate(base.getDate() + index);
    return {
      id: `demo-olga-${index}`,
      origin,
      destination,
      departureDate: departure.toISOString(),
      durationMinutes: 165,
      price,
      currency: 'EUR',
      airline: 'Vueling',
      deepLink: 'https://www.vueling.com',
      stops: 0,
      source: 'demo' as const,
    };
  });
}

export function demoFlightCombinations(): FlightCombination[] {
  return [
    {
      id: 'combo-1',
      label: 'Opció Anada i Tornada el Mateix Dia (Express)',
      outbound: { flightNumber: 'VY2410', departure: '08:30', arrival: '09:45', route: 'BCN -> EAS' },
      inbound: { flightNumber: 'VY2413', departure: '22:15', arrival: '23:30', route: 'EAS -> BCN' },
      idealFor: 'Partits de tarda (16:15h - 18:30h)',
      price: 89,
      currency: 'EUR',
      bookingLink: 'https://www.vueling.com',
    },
    {
      id: 'combo-2',
      label: 'Opció Matinera + Nit a la Ciutat',
      outbound: { flightNumber: 'VY2410', departure: '08:30', arrival: '09:45', route: 'BCN -> EAS' },
      inbound: { flightNumber: 'VY2415', departure: '10:20 (diumenge)', arrival: '11:35', route: 'EAS -> BCN' },
      idealFor: 'Partits de nit (21:00h)',
      price: 112,
      currency: 'EUR',
      bookingLink: 'https://www.vueling.com',
    },
    {
      id: 'combo-3',
      label: 'Opció Anada Ràpida Migdia',
      outbound: { flightNumber: 'VY2412', departure: '13:15', arrival: '14:30', route: 'BCN -> EAS' },
      inbound: { flightNumber: 'VY2413', departure: '22:15', arrival: '23:30', route: 'EAS -> BCN' },
      idealFor: 'Partits de vespre (19:00h)',
      price: 74,
      currency: 'EUR',
      bookingLink: 'https://www.vueling.com',
    },
  ];
}

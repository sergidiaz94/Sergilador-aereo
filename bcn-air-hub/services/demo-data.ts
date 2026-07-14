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
  RcdeUpcomingFixture,
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

export function demoRcdeFixtures(): RcdeUpcomingFixture[] {
  const inDays = (days: number, hour = 21, minute = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  };

  return [
    {
      id: 'demo-1',
      competition: 'LaLiga',
      homeTeam: 'RCD Espanyol de Barcelona',
      awayTeam: 'Real Betis Balompié',
      utcDate: inDays(6, 21),
      venue: 'RCDE Stadium',
      status: 'SCHEDULED',
      isHome: true,
      timeConfirmed: true,
      ontour: null,
    },
    {
      id: 'demo-2',
      competition: 'LaLiga',
      homeTeam: 'Real Sociedad de Fútbol',
      awayTeam: 'RCD Espanyol de Barcelona',
      utcDate: inDays(13, 18),
      venue: 'Reale Arena',
      status: 'SCHEDULED',
      isHome: false,
      timeConfirmed: true,
      ontour: {
        possible: true,
        destinationAirport: 'EAS',
        destinationCity: 'Sant Sebastià',
        travelMinutesFromAirport: 25,
        windowStart: inDays(13, 16, 30),
        windowEnd: inDays(13, 23),
      },
    },
    {
      id: 'demo-3',
      competition: 'LaLiga',
      homeTeam: 'Athletic Club',
      awayTeam: 'RCD Espanyol de Barcelona',
      utcDate: inDays(34, 16),
      venue: 'San Mamés',
      status: 'SCHEDULED',
      isHome: false,
      timeConfirmed: false,
      ontour: {
        possible: true,
        destinationAirport: 'BIO',
        destinationCity: 'Bilbao',
        travelMinutesFromAirport: 30,
      },
    },
    {
      id: 'demo-4',
      competition: 'Copa del Rey',
      homeTeam: 'Burgos CF',
      awayTeam: 'RCD Espanyol de Barcelona',
      utcDate: inDays(20, 19),
      venue: 'El Plantío',
      status: 'SCHEDULED',
      isHome: false,
      timeConfirmed: false,
      ontour: {
        possible: false,
        reason: 'No hi ha cap aeroport proper a la destinació.',
      },
    },
  ];
}

export function demoFlightDeals(weekend?: { friday: string; sunday: string }): FlightDeal[] {
  const { friday, sunday } = weekend ?? getNextWeekend();

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
  const scheduledDeparture = new Date();
  const scheduledArrival = new Date(scheduledDeparture.getTime() + 95 * 60_000);
  return {
    flightNumber: `${carrierCode}${flightNumber}`,
    airline: carrierCode,
    aircraftModel: 'Airbus A320neo',
    departureAirport: 'BCN',
    arrivalAirport: 'MAD',
    departureLat: 41.2974,
    departureLng: 2.0833,
    arrivalLat: 40.4936,
    arrivalLng: -3.5668,
    scheduledDeparture: scheduledDeparture.toISOString(),
    estimatedDeparture: new Date(scheduledDeparture.getTime() + 20 * 60_000).toISOString(),
    scheduledArrival: scheduledArrival.toISOString(),
    estimatedArrival: new Date(scheduledArrival.getTime() + 20 * 60_000).toISOString(),
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



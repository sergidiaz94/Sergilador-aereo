// Taula orientativa (mantinguda manualment) de ciutat/aeroport i temps
// estimat de trasllat aeroport -> estadi per a clubs de LaLiga i Segona
// Divisió. Els minuts són una aproximació; si un equip no hi és, es tracta
// com "sense aeroport determinat" (OnTour no disponible per defecte).
type ClubTravelInfo = {
  city: string;
  airportCode: string | null;
  travelMinutes: number;
};

export const CLUB_TRAVEL_INFO: Record<string, ClubTravelInfo> = {
  'Real Madrid CF': { city: 'Madrid', airportCode: 'MAD', travelMinutes: 40 },
  'FC Barcelona': { city: 'Barcelona', airportCode: 'BCN', travelMinutes: 35 },
  'Club Atlético de Madrid': { city: 'Madrid', airportCode: 'MAD', travelMinutes: 45 },
  'Athletic Club': { city: 'Bilbao', airportCode: 'BIO', travelMinutes: 30 },
  'Real Sociedad de Fútbol': { city: 'Sant Sebastià', airportCode: 'EAS', travelMinutes: 25 },
  'Sevilla FC': { city: 'Sevilla', airportCode: 'SVQ', travelMinutes: 25 },
  'Real Betis Balompié': { city: 'Sevilla', airportCode: 'SVQ', travelMinutes: 30 },
  'Valencia CF': { city: 'València', airportCode: 'VLC', travelMinutes: 25 },
  'Villarreal CF': { city: 'Villarreal', airportCode: 'VLC', travelMinutes: 75 },
  'RC Celta de Vigo': { city: 'Vigo', airportCode: 'VGO', travelMinutes: 30 },
  'RCD Mallorca': { city: 'Palma', airportCode: 'PMI', travelMinutes: 20 },
  'CA Osasuna': { city: 'Pamplona', airportCode: 'PNA', travelMinutes: 15 },
  'Deportivo Alavés': { city: 'Vitòria-Gasteiz', airportCode: 'VIT', travelMinutes: 15 },
  'Getafe CF': { city: 'Getafe', airportCode: 'MAD', travelMinutes: 35 },
  'Rayo Vallecano de Madrid': { city: 'Madrid', airportCode: 'MAD', travelMinutes: 45 },
  'Girona FC': { city: 'Girona', airportCode: 'GRO', travelMinutes: 20 },
  'UD Las Palmas': { city: 'Las Palmas', airportCode: 'LPA', travelMinutes: 25 },
  'CD Leganés': { city: 'Madrid', airportCode: 'MAD', travelMinutes: 40 },
  'Real Valladolid CF': { city: 'Valladolid', airportCode: 'VLL', travelMinutes: 25 },
  'RCD Espanyol de Barcelona': { city: 'Barcelona', airportCode: 'BCN', travelMinutes: 35 },
  'Levante UD': { city: 'València', airportCode: 'VLC', travelMinutes: 25 },
  'Real Racing Club': { city: 'Santander', airportCode: 'SDR', travelMinutes: 20 },
  'SD Eibar': { city: 'Eibar', airportCode: 'BIO', travelMinutes: 45 },
  'Real Zaragoza': { city: 'Saragossa', airportCode: 'ZAZ', travelMinutes: 20 },
  'Albacete Balompié': { city: 'Albacete', airportCode: null, travelMinutes: 0 },
  'Córdoba CF': { city: 'Còrdova', airportCode: null, travelMinutes: 0 },
  'SD Huesca': { city: 'Osca', airportCode: null, travelMinutes: 0 },
  'CD Mirandés': { city: 'Miranda de Ebro', airportCode: null, travelMinutes: 0 },
  'FC Cartagena': { city: 'Cartagena', airportCode: 'MJV', travelMinutes: 25 },
  'CD Castellón': { city: 'Castelló', airportCode: 'CDT', travelMinutes: 20 },
  'Sporting de Gijón': { city: 'Gijón', airportCode: 'OVD', travelMinutes: 40 },
  'Burgos CF': { city: 'Burgos', airportCode: null, travelMinutes: 0 },
  'AD Ceuta FC': { city: 'Ceuta', airportCode: null, travelMinutes: 0 },
  'Granada CF': { city: 'Granada', airportCode: 'GRX', travelMinutes: 25 },
  'Elche CF': { city: 'Elx', airportCode: 'ALC', travelMinutes: 25 },
  'UD Almería': { city: 'Almeria', airportCode: 'LEI', travelMinutes: 15 },
};

export function getClubTravelInfo(teamName: string): ClubTravelInfo | null {
  return CLUB_TRAVEL_INFO[teamName] ?? null;
}

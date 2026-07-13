// Configuració centralitzada de variables d'entorn i detecció de quines
// integracions reals estan disponibles. Si una clau no hi és, els serveis
// cauen automàticament al proveïdor de demo corresponent.

export const env = {
  amadeus: {
    apiKey: process.env.AMADEUS_API_KEY,
    apiSecret: process.env.AMADEUS_API_SECRET,
    baseUrl: process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com',
  },
  opensky: {
    clientId: process.env.OPENSKY_CLIENT_ID,
    clientSecret: process.env.OPENSKY_CLIENT_SECRET,
  },
  footballData: {
    apiKey: process.env.FOOTBALL_DATA_API_KEY,
    // ID de l'equip a football-data.org. Verifica'l al teu compte;
    // 264 sol correspondre al RCD Espanyol però pot variar segons la temporada/API.
    teamId: process.env.FOOTBALL_DATA_TEAM_ID || '264',
  },
  openWeather: {
    apiKey: process.env.OPENWEATHER_API_KEY,
  },
  olga: {
    // Contrasenya de la funció secreta "Ets l'Olga?". Es pot sobreescriure
    // per variable d'entorn sense tocar codi.
    password: process.env.OLGA_SECRET_PASSWORD || 'ILoveBCN',
    originAirport: process.env.OLGA_ORIGIN_AIRPORT || 'BER',
  },
} as const;

export const hasAmadeus = () => Boolean(env.amadeus.apiKey && env.amadeus.apiSecret);
export const hasOpenSkyAuth = () => Boolean(env.opensky.clientId && env.opensky.clientSecret);
export const hasFootballData = () => Boolean(env.footballData.apiKey);
export const hasOpenWeather = () => Boolean(env.openWeather.apiKey);

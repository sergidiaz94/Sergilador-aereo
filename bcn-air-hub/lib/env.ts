// Configuració centralitzada de variables d'entorn i detecció de quines
// integracions reals estan disponibles. Si una clau no hi és, els serveis
// cauen automàticament al proveïdor de demo corresponent.
//
// Nota: Amadeus Self-Service es va descartar (Amadeus tanca el portal de
// self-service el 17/07/2026 i desactiva totes les claus existents), per
// això les integracions de vols fan servir Travelpayouts i AeroDataBox.

export const env = {
  travelpayouts: {
    // Token gratuït registrant-te com a afiliat a travelpayouts.com
    apiToken: process.env.TRAVELPAYOUTS_API_TOKEN,
  },
  aerodatabox: {
    // Clau de RapidAPI (subscripció gratuïta al producte AeroDataBox)
    rapidApiKey: process.env.AERODATABOX_RAPIDAPI_KEY,
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

export const hasTravelpayouts = () => Boolean(env.travelpayouts.apiToken);
export const hasAeroDataBox = () => Boolean(env.aerodatabox.rapidApiKey);
export const hasOpenSkyAuth = () => Boolean(env.opensky.clientId && env.opensky.clientSecret);
export const hasFootballData = () => Boolean(env.footballData.apiKey);
export const hasOpenWeather = () => Boolean(env.openWeather.apiKey);

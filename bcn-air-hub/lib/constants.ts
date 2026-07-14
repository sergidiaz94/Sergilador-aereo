export const BCN_AIRPORT = { code: 'BCN', name: 'Barcelona - El Prat', lat: 41.2974, lng: 2.0833 };

// Aeroports d'origen seleccionables a la pestanya de vols.
export const ORIGIN_AIRPORTS = [
  { code: 'BCN', label: 'Barcelona (BCN)' },
  { code: 'VLC', label: 'València (VLC)' },
  { code: 'PMI', label: 'Palma de Mallorca (PMI)' },
] as const;

export const DEFAULT_ORIGIN = ORIGIN_AIRPORTS[0].code;

export const DEFAULT_USER_LOCATION = {
  lat: 41.3851,
  lng: 2.1734,
  label: 'Barcelona / Esplugues',
};

// Radi (km) del radar de trànsit aeri al voltant de la posició de l'usuari.
export const RADAR_RADIUS_KM = 60;

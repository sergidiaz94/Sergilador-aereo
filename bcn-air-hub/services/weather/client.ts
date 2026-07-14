import { env } from '@/lib/env';

export async function openWeatherGet(lat: number, lng: number) {
  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('appid', env.openWeather.apiKey!);
  url.searchParams.set('units', 'metric');
  url.searchParams.set('lang', 'ca');

  const res = await fetch(url.toString(), { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error(`OpenWeather request failed: ${res.status}`);
  }

  return res.json();
}

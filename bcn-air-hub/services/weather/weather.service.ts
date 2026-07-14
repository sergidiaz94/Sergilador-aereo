import { hasOpenWeather } from '@/lib/env';
import { openWeatherGet } from './client';
import type { WeatherSnapshot } from '@/types';

export async function getWeatherSnapshot(lat: number, lng: number, label: string): Promise<WeatherSnapshot> {
  if (!hasOpenWeather()) {
    return demoWeather(label);
  }

  try {
    const data = await openWeatherGet(lat, lng);
    return {
      location: label,
      temperatureC: Math.round(data.main?.temp ?? 0),
      feelsLikeC: Math.round(data.main?.feels_like ?? 0),
      condition: data.weather?.[0]?.description ?? 'N/D',
      icon: data.weather?.[0]?.icon ?? '01d',
      windKph: Math.round((data.wind?.speed ?? 0) * 3.6),
      humidity: data.main?.humidity ?? 0,
      source: 'live',
    };
  } catch (error) {
    console.error('[openweather] fallback a dades de demo:', error);
    return demoWeather(label);
  }
}

function demoWeather(label: string): WeatherSnapshot {
  return {
    location: label,
    temperatureC: 22,
    feelsLikeC: 23,
    condition: 'cel serè',
    icon: '01d',
    windKph: 12,
    humidity: 55,
    source: 'demo',
  };
}

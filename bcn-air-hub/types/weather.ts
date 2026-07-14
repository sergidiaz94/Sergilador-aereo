import type { DataSource } from './common';

export type WeatherSnapshot = {
  location: string;
  temperatureC: number;
  feelsLikeC: number;
  condition: string;
  icon: string;
  windKph: number;
  humidity: number;
  source: DataSource;
};

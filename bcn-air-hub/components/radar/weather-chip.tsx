'use client';

import { useWeather } from '@/hooks/use-weather';
import { weatherEmoji } from '@/lib/weather-icons';

type Props = { lat: number; lng: number; label: string };

export function WeatherChip({ lat, lng, label }: Props) {
  const { data, isLoading } = useWeather(lat, lng, label);

  if (isLoading || !data) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-xl text-xs backdrop-blur z-[1000] flex items-center gap-2">
      <span className="text-base leading-none">{weatherEmoji(data.icon)}</span>
      <span className="font-mono text-slate-200">{data.temperatureC}°C</span>
    </div>
  );
}

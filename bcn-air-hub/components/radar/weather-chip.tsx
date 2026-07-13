'use client';

import { useWeather } from '@/hooks/use-weather';

type Props = { lat: number; lng: number; label: string };

export function WeatherChip({ lat, lng, label }: Props) {
  const { data, isLoading } = useWeather(lat, lng, label);

  if (isLoading || !data) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-xl text-xs backdrop-blur z-20 flex items-center gap-2">
      <span className="font-mono text-slate-200">{data.temperatureC}°C</span>
      <span className="text-slate-400 capitalize">{data.condition}</span>
    </div>
  );
}

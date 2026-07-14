'use client';

import { useWeather } from '@/hooks/use-weather';
import { weatherEmoji } from '@/lib/weather-icons';

type Props = { lat?: number; lng?: number; label: string };

export function AirportWeather({ lat, lng, label }: Props) {
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';
  const { data, isLoading } = useWeather(hasCoords ? lat! : 0, hasCoords ? lng! : 0, label);

  if (!hasCoords) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
      <span className="text-slate-400 font-semibold">{label}</span>
      {isLoading || !data ? (
        <span className="text-slate-600">...</span>
      ) : (
        <span className="flex items-center gap-1.5">
          <span>{weatherEmoji(data.icon)}</span>
          <span className="font-mono text-slate-200">{data.temperatureC}°C</span>
        </span>
      )}
    </div>
  );
}

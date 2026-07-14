'use client';

import dynamic from 'next/dynamic';
import { Info, Clock, MapPin, PlaneLanding, PlaneTakeoff as PlaneTakeoffIcon } from 'lucide-react';
import { AirportWeather } from './airport-weather';
import { formatDisplayDateTime } from '@/lib/date';
import type { FlightStatusInfo } from '@/types';

const FlightRouteMap = dynamic(() => import('./flight-route-map').then((mod) => mod.FlightRouteMap), {
  ssr: false,
  loading: () => <p className="text-xs text-slate-500 font-mono p-4">Carregant mapa...</p>,
});

export function FlightStatusResult({ status }: { status: FlightStatusInfo }) {
  const isDelayed = status.delayMinutes > 0;
  const hasRoute =
    typeof status.departureLat === 'number' &&
    typeof status.departureLng === 'number' &&
    typeof status.arrivalLat === 'number' &&
    typeof status.arrivalLng === 'number';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <h3 className="font-bold text-lg text-blue-400 font-mono">{status.flightNumber}</h3>
        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
            isDelayed
              ? 'bg-red-900/30 text-red-300 border-red-700/30'
              : 'bg-emerald-900/30 text-emerald-300 border-emerald-700/30'
          }`}
        >
          {status.status}
        </span>
      </div>

      {hasRoute && (
        <div className="h-56 rounded-xl overflow-hidden border border-slate-800">
          <FlightRouteMap
            departureLat={status.departureLat!}
            departureLng={status.departureLng!}
            departureLabel={status.departureAirport}
            arrivalLat={status.arrivalLat!}
            arrivalLng={status.arrivalLng!}
            arrivalLabel={status.arrivalAirport}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <AirportWeather lat={status.departureLat} lng={status.departureLng} label={status.departureAirport} />
        <AirportWeather lat={status.arrivalLat} lng={status.arrivalLng} label={status.arrivalAirport} />
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Ruta:</span>
          <span className="font-semibold text-slate-200">
            {status.departureAirport} -&gt; {status.arrivalAirport}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Model d'avió:</span>
          <span className="font-medium text-slate-200">{status.aircraftModel ?? 'N/D'}</span>
        </div>

        <div className="mt-3 p-3.5 bg-slate-900/80 rounded-xl border border-blue-500/20 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <PlaneTakeoffIcon className="w-3.5 h-3.5" /> Sortida prevista:
            </span>
            <span className="font-mono text-slate-200">
              {status.scheduledDeparture ? formatDisplayDateTime(status.scheduledDeparture) : 'N/D'}
            </span>
          </div>
          {status.estimatedDeparture && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Sortida estimada/real:</span>
              <span className={`font-mono ${isDelayed ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatDisplayDateTime(status.estimatedDeparture)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <PlaneLanding className="w-3.5 h-3.5" /> Arribada prevista:
            </span>
            <span className="font-mono text-slate-200">
              {status.scheduledArrival ? formatDisplayDateTime(status.scheduledArrival) : 'N/D'}
            </span>
          </div>
          {status.estimatedArrival && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Arribada estimada/real:</span>
              <span className="font-mono text-emerald-400">{formatDisplayDateTime(status.estimatedArrival)}</span>
            </div>
          )}
          {isDelayed && (
            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Retard:
              </span>
              <span className="font-bold text-red-400">{status.delayMinutes} min</span>
            </div>
          )}
        </div>

        <div className="p-3.5 bg-slate-900/80 rounded-xl border border-blue-500/20 space-y-2">
          <div className="text-[11px] text-blue-400 font-bold tracking-wider flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> INFORMACIÓ DE PORTA
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Porta:
            </span>
            <span className="font-bold text-emerald-400">{status.gate ?? "Pendent d'assignar"}</span>
          </div>
          {status.terminal && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Terminal:</span>
              <span className="font-bold text-emerald-400">{status.terminal}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

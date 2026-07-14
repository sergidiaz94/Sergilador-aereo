'use client';

import { Info } from 'lucide-react';
import { useFlightRoute } from '@/hooks/use-flight-route';
import { formatAirportLabel } from '@/lib/airports';
import type { LiveFlight } from '@/types';

export function FlightDetailCard({ flight }: { flight: LiveFlight | null }) {
  const { data: routeData, isLoading: routeLoading } = useFlightRoute(flight?.callsign ?? '');

  if (!flight) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-center text-xs text-slate-500 text-center">
        Selecciona un avió al radar per veure'n els detalls.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <h3 className="font-bold text-lg text-blue-400 font-mono">{flight.callsign}</h3>
          <span className="bg-blue-900/40 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-700/30 font-semibold">
            {flight.onGround ? 'En terra' : 'En ruta'}
          </span>
        </div>

        {routeLoading ? (
          <p className="text-[11px] text-slate-500 mb-3 animate-pulse">Cercant ruta...</p>
        ) : routeData?.route ? (
          <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-center gap-3 text-sm font-mono">
            <span className="font-bold text-slate-200">{formatAirportLabel(routeData.route.departureAirport)}</span>
            <span className="text-blue-400">→</span>
            <span className="font-bold text-slate-200">{formatAirportLabel(routeData.route.arrivalAirport)}</span>
          </div>
        ) : null}

        <div className="space-y-3 text-sm">
          {flight.model && (
            <div className="flex justify-between">
              <span className="text-slate-400">Model d'avió:</span>
              <span className="font-medium text-slate-200">{flight.model}</span>
            </div>
          )}
          {flight.registration && (
            <div className="flex justify-between">
              <span className="text-slate-400">Matrícula:</span>
              <span className="font-mono text-slate-200 text-xs">{flight.registration}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Altitud:</span>
            <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-yellow-400 text-xs font-bold">
              {flight.altitude !== null ? `${Math.round(flight.altitude)} m` : 'N/D'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Velocitat:</span>
            <span className="text-slate-200 text-xs">
              {flight.velocity !== null ? `${Math.round(flight.velocity * 3.6)} km/h` : 'N/D'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Ubicació relativa:</span>
            <span className="text-pink-400 font-bold text-xs">
              {flight.distanceKm !== undefined ? `A ${flight.distanceKm} km de la teva posició` : 'N/D'}
            </span>
          </div>

          <div className="mt-4 p-3.5 bg-slate-950/80 rounded-xl border border-blue-500/20 space-y-2">
            <div className="text-[11px] text-blue-400 font-bold tracking-wider flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> TELEMETRIA EN VIU
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Coordenades:</span>
              <span className="font-bold text-emerald-400">
                {flight.latitude.toFixed(2)}, {flight.longitude.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

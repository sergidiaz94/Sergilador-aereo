'use client';

import { Plane } from 'lucide-react';
import type { LiveFlight } from '@/types';

type Props = { flights: LiveFlight[]; onSelect: (flight: LiveFlight) => void };

// Mapa estilitzat: distribueix els avions en cercle segons l'índex.
// Projectar lat/lng reals sobre un radar 2D decoratiu no aporta precisió
// addicional, així que es manté la distància real (distanceKm) com a dada.
export function RadarMap({ flights, onSelect }: Props) {
  if (flights.length === 0) {
    return (
      <p className="text-xs text-slate-500 font-mono bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur">
        No hi ha vols detectats en aquest radi ara mateix.
      </p>
    );
  }

  const visibleFlights = flights.slice(0, 6);

  return (
    <>
      {visibleFlights.map((flight, index) => {
        const angle = (index / visibleFlights.length) * 2 * Math.PI;
        const radius = 35;
        const top = 50 + radius * Math.sin(angle);
        const left = 50 + radius * Math.cos(angle);

        return (
          <button
            key={flight.id}
            type="button"
            style={{ top: `${top}%`, left: `${left}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 bg-blue-500/20 border border-blue-500 p-2 rounded-full cursor-pointer hover:scale-110 transition-all z-10"
            onClick={() => onSelect(flight)}
          >
            <Plane className="w-5 h-5 text-blue-400" style={{ transform: `rotate(${flight.heading ?? 45}deg)` }} />
            <span className="absolute text-[10px] text-slate-300 font-mono top-7 left-1/2 -translate-x-1/2 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
              {flight.callsign}
            </span>
          </button>
        );
      })}
      <div className="text-slate-500 text-xs font-mono bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur absolute bottom-4 left-1/2 -translate-x-1/2">
        Clica un avió per analitzar el vol
      </div>
    </>
  );
}

import { Info, Clock, MapPin } from 'lucide-react';
import type { FlightStatusInfo } from '@/types';

export function FlightStatusResult({ status }: { status: FlightStatusInfo }) {
  const isDelayed = status.delayMinutes > 0;

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
        <div className="flex justify-between items-center">
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Sortida prevista:
          </span>
          <span className="font-mono text-xs text-slate-200">
            {status.scheduledDeparture ? new Date(status.scheduledDeparture).toLocaleString('ca-ES') : 'N/D'}
          </span>
        </div>
        {isDelayed && (
          <div className="flex justify-between">
            <span className="text-slate-400">Retard:</span>
            <span className="font-bold text-red-400 text-xs">{status.delayMinutes} min</span>
          </div>
        )}

        <div className="mt-4 p-3.5 bg-slate-900/80 rounded-xl border border-blue-500/20 space-y-2">
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

import { ExternalLink } from 'lucide-react';
import type { FlightCombination } from '@/types';

export function RcdeCombinationCard({ combination }: { combination: FlightCombination }) {
  return (
    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-500/40 transition-all">
      <div className="space-y-1">
        <span className="text-xs font-bold text-blue-400 block">{combination.label}</span>
        <p className="text-xs text-slate-300 font-mono">
          {combination.outbound.flightNumber} - {combination.outbound.departure} ({combination.outbound.route})
        </p>
        <p className="text-xs text-slate-300 font-mono">
          {combination.inbound.flightNumber} - {combination.inbound.departure} ({combination.inbound.route})
        </p>
        <span className="text-[10px] text-slate-500 italic block">Recomanat per a: {combination.idealFor}</span>
      </div>
      <div className="flex items-center gap-4 self-end md:self-center">
        <span className="text-2xl font-black text-emerald-400">
          {combination.price}
          {combination.currency === 'EUR' ? '€' : ` ${combination.currency}`}
        </span>
        <a
          href={combination.bookingLink}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
        >
          <span>Reservar a Vueling</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

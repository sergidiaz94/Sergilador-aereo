import { ExternalLink, Tag } from 'lucide-react';
import { formatDisplayDateTime } from '@/lib/date';
import { formatAirportLabel } from '@/lib/airports';
import type { FlightOffer } from '@/types';

export function OlgaOfferCard({ offer, isCheapest }: { offer: FlightOffer; isCheapest: boolean }) {
  return (
    <div
      className={`p-4 rounded-xl border flex justify-between items-center flex-wrap gap-3 ${
        isCheapest ? 'bg-pink-950/20 border-pink-500/40' : 'bg-slate-950 border-slate-800'
      }`}
    >
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-white">{offer.airline}</span>
          <span className="text-[10px] text-slate-400 font-mono">→ {formatAirportLabel(offer.destination)}</span>
          {isCheapest && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-300 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded-full">
              <Tag className="w-2.5 h-2.5" /> MÉS BARAT
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400 font-mono">{formatDisplayDateTime(offer.departureDate)}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg font-black text-pink-400">
          {offer.price}
          {offer.currency === 'EUR' ? '€' : ` ${offer.currency}`}
        </span>
        <a
          href={offer.deepLink}
          target="_blank"
          rel="noreferrer"
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-pink-500/20"
        >
          <span>Comprar</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

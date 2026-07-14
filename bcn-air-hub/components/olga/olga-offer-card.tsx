import { ExternalLink } from 'lucide-react';
import type { FlightOffer } from '@/types';

const MEDALS = ['🥇', '🥈', '🥉'];

export function OlgaOfferCard({ offer, rank }: { offer: FlightOffer; rank: number }) {
  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">{MEDALS[rank] ?? '✈️'}</span>
        <div>
          <span className="text-xs font-bold text-white block">{offer.airline}</span>
          <span className="text-[11px] text-slate-400">{new Date(offer.departureDate).toLocaleDateString('ca-ES')}</span>
        </div>
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

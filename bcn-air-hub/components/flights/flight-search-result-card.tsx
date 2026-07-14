import { ExternalLink } from 'lucide-react';
import type { FlightOffer } from '@/types';

const STOPS_LABEL: Record<number, string> = {
  0: 'Directe',
  1: '1 escala',
  2: '2 escales',
};

export function FlightSearchResultCard({ offer }: { offer: FlightOffer }) {
  const priceLabel = `${offer.price}${offer.currency === 'EUR' ? '€' : ` ${offer.currency}`}`;
  const stopsLabel = offer.stops !== undefined ? STOPS_LABEL[offer.stops] ?? `${offer.stops} escales` : null;

  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center flex-wrap gap-4 hover:border-blue-500/40 transition-all">
      <div>
        <span className="text-xs text-blue-400 font-bold block">
          {offer.airline}
          {stopsLabel ? <span className="text-slate-500 font-normal"> · {stopsLabel}</span> : null}
          {offer.provider ? <span className="text-slate-600 font-normal"> · {offer.provider}</span> : null}
        </span>
        <span className="text-xs text-slate-400">
          Anada: {offer.departureDate.split('T')[0]}
          {offer.returnDate ? ` | Tornada: ${offer.returnDate.split('T')[0]}` : ''}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xl font-black text-emerald-400">{priceLabel}</span>
        <a
          href={offer.deepLink}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1 transition-all"
        >
          <span>Reservar</span> <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

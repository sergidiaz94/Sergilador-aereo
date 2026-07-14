import { ExternalLink } from 'lucide-react';
import { formatDisplayDate } from '@/lib/date';
import type { FlightOffer } from '@/types';

const STOPS_LABEL: Record<number, string> = {
  0: 'Directe',
  1: '1 escala',
  2: '2 escales',
};

export function FlightSearchResultCard({ offer }: { offer: FlightOffer }) {
  const priceLabel = `${offer.price}${offer.currency === 'EUR' ? '€' : ` ${offer.currency}`}`;
  const stopsLabel = offer.stops !== undefined ? STOPS_LABEL[offer.stops] ?? `${offer.stops} escales` : null;
  const departureTime = new Date(offer.departureDate);
  const hasTime = !Number.isNaN(departureTime.getTime());

  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center flex-wrap gap-4 hover:border-blue-500/40 transition-all">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-blue-300">{offer.airline}</span>
          {hasTime && (
            <span className="text-lg font-black text-white font-mono">
              {departureTime.getHours().toString().padStart(2, '0')}:
              {departureTime.getMinutes().toString().padStart(2, '0')}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">
          {stopsLabel ? `${stopsLabel} · ` : ''}
          Anada: {formatDisplayDate(offer.departureDate)}
          {offer.returnDate ? ` | Tornada: ${formatDisplayDate(offer.returnDate)}` : ''}
        </span>
        {offer.provider && <span className="text-[10px] text-slate-600 block">{offer.provider}</span>}
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

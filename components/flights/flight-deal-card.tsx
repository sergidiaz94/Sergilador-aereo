import { ExternalLink } from 'lucide-react';
import { formatAirportLabel } from '@/lib/airports';
import { formatDisplayDate } from '@/lib/date';
import { DEFAULT_ORIGIN } from '@/lib/constants';
import type { FlightDeal } from '@/types';

type Props = { deal: FlightDeal; origin?: string; featured?: boolean };

export function FlightDealCard({ deal, origin = DEFAULT_ORIGIN, featured }: Props) {
  const priceLabel = `${deal.price}${deal.currency === 'EUR' ? '€' : ` ${deal.currency}`}`;
  const destinationLabel = formatAirportLabel(deal.destination);
  const originLabel = formatAirportLabel(origin);

  if (featured) {
    return (
      <div className="bg-gradient-to-br from-blue-600/20 to-slate-900 border border-blue-500/40 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[11px] text-blue-300 font-bold tracking-wider block mb-1">
              MILLOR OFERTA DE CAP DE SETMANA DES DE BCN
            </span>
            <span className="text-2xl font-black text-white block">{originLabel} -&gt; {destinationLabel}</span>
            <span className="text-xs text-slate-400">
              Anada: {formatDisplayDate(deal.departureDate)}
              {deal.returnDate ? ` | Tornada: ${formatDisplayDate(deal.returnDate)}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-emerald-400">{priceLabel}</span>
            <a
              href={deal.deepLink}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
            >
              <span>Reservar</span> <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center flex-wrap gap-4 hover:border-blue-500/40 transition-all">
      <div>
        <span className="text-xs text-blue-400 font-bold block">{destinationLabel}</span>
        <span className="text-xs text-slate-400">
          Anada: {formatDisplayDate(deal.departureDate)}
          {deal.returnDate ? ` | Tornada: ${formatDisplayDate(deal.returnDate)}` : ''}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xl font-black text-emerald-400">{priceLabel}</span>
        <a
          href={deal.deepLink}
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

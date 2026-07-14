import { Navigation, Trophy } from 'lucide-react';
import { OlgaOfferCard } from './olga-offer-card';
import type { FlightOffer } from '@/types';

type Props = { loading: boolean; nextDays?: FlightOffer[]; cheapestOverall?: FlightOffer | null };

export function OlgaResult({ loading, nextDays, cheapestOverall }: Props) {
  const cheapestPrice = nextDays && nextDays.length > 0 ? Math.min(...nextDays.map((o) => o.price)) : null;

  return (
    <div>
      <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
        <Navigation className="w-5 h-5" /> {"Vols d'Anada cap a Barcelona (BCN)"}
      </h3>

      {loading ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-300">{"Buscant vols d'anada..."}</p>
        </div>
      ) : nextDays && nextDays.length > 0 ? (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-500 tracking-wider">PRÒXIMS 3 DIES</h4>
            {nextDays.map((offer) => (
              <OlgaOfferCard key={offer.id} offer={offer} isCheapest={offer.price === cheapestPrice} />
            ))}
          </div>

          {cheapestOverall && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-[11px] font-bold text-amber-400 tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3" /> EL MÉS BARAT TROBAT (QUALSEVOL DIA)
              </h4>
              <OlgaOfferCard offer={cheapestOverall} isCheapest />
            </div>
          )}

          <p className="text-[11px] text-slate-500 pt-1">Els 3 primers, ordenats per data de sortida.</p>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-8">No s'ha trobat cap vol disponible ara mateix.</p>
      )}
    </div>
  );
}

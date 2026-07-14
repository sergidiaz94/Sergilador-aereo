import { Navigation } from 'lucide-react';
import { OlgaOfferCard } from './olga-offer-card';
import type { FlightOffer } from '@/types';

export function OlgaResult({ loading, offers }: { loading: boolean; offers?: FlightOffer[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
        <Navigation className="w-5 h-5" /> {"Top 3 Vols d'Anada cap a Barcelona (BCN)"}
      </h3>

      {loading ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-300">{"Buscant vols d'anada en els pròxims dies..."}</p>
        </div>
      ) : offers && offers.length > 0 ? (
        <div className="space-y-3">
          {offers.map((offer, index) => (
            <OlgaOfferCard key={offer.id} offer={offer} rank={index} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-8">No s'ha trobat cap vol disponible ara mateix.</p>
      )}
    </div>
  );
}

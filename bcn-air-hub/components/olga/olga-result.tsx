import { Navigation, ExternalLink } from 'lucide-react';
import type { OlgaOffer } from '@/hooks/use-olga-search';

export function OlgaResult({ loading, offer }: { loading: boolean; offer?: OlgaOffer }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
        <Navigation className="w-5 h-5" /> {"Vol d'Anada Ràpid cap a Barcelona (BCN)"}
      </h3>

      {loading ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-300">{"Buscant vols d'anada en els pròxims dies..."}</p>
        </div>
      ) : offer ? (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Origen -&gt; Destí:</span>
              <span className="font-bold text-white">
                {offer.origin} -&gt; {offer.destination}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Tipus de vol:</span>
              <span className="text-emerald-400 font-bold">{offer.departureLabel}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Companyia:</span>
              <span className="text-slate-200">{offer.airline}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-[10px] text-slate-400 block">Preu Vol d'Anada</span>
              <span className="text-2xl font-black text-pink-400">
                {offer.price}
                {offer.currency === 'EUR' ? '€' : ` ${offer.currency}`}
              </span>
            </div>
            <a
              href={offer.deepLink}
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-pink-500/20"
            >
              <span>Comprar a Vueling</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-8">No s'ha trobat cap vol disponible ara mateix.</p>
      )}
    </div>
  );
}

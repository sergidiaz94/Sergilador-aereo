'use client';

import { Sparkles } from 'lucide-react';
import { FlightDealCard } from './flight-deal-card';
import { FlightSearchWidget } from './flight-search-widget';
import { DataSourceBadge } from '../dashboard/data-source-badge';
import { useFlightDeals } from '@/hooks/use-flight-deals';

export function FlightDealsPanel() {
  const { data, isLoading } = useFlightDeals();
  const deals = data?.deals ?? [];
  const [best, ...rest] = deals;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2 text-blue-400">
          <Sparkles className="w-5 h-5" /> Millor Oferta de Cap de Setmana des de BCN
        </h2>
        {data?.source && <DataSourceBadge source={data.source} />}
      </div>
      <p className="text-xs text-slate-500 -mt-3">Sempre de divendres a la tarda a diumenge.</p>

      {isLoading ? (
        <p className="text-xs text-slate-400 animate-pulse">Buscant la millor oferta...</p>
      ) : best ? (
        <div className="space-y-3">
          <FlightDealCard deal={best} featured />
          {rest.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider">ALTRES GANGUES</h3>
              {rest.map((deal) => (
                <FlightDealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No s'han trobat ofertes ara mateix.</p>
      )}

      <FlightSearchWidget />
    </div>
  );
}

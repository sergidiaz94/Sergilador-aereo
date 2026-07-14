'use client';

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FlightDealCard } from './flight-deal-card';
import { FlightSearchWidget } from './flight-search-widget';
import { OriginSelector } from './origin-selector';
import { WeekendSelector } from './weekend-selector';
import { DataSourceBadge } from '../dashboard/data-source-badge';
import { useFlightDeals } from '@/hooks/use-flight-deals';
import { DEFAULT_ORIGIN } from '@/lib/constants';
import { formatAirportLabel } from '@/lib/airports';
import { getUpcomingWeekends } from '@/lib/date';

export function FlightDealsPanel() {
  const weekendOptions = useMemo(() => getUpcomingWeekends(6), []);
  const [origin, setOrigin] = useState<string>(DEFAULT_ORIGIN);
  const [selectedFriday, setSelectedFriday] = useState(weekendOptions[0].friday);

  const selectedWeekend = weekendOptions.find((w) => w.friday === selectedFriday) ?? weekendOptions[0];
  const { data, isLoading } = useFlightDeals(origin, selectedWeekend);
  const deals = data?.deals ?? [];
  const [best, ...rest] = deals;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold flex items-center gap-2 text-blue-400">
          <Sparkles className="w-5 h-5" /> Millor Oferta de Cap de Setmana
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <OriginSelector value={origin} onChange={setOrigin} />
          <WeekendSelector options={weekendOptions} value={selectedFriday} onChange={setSelectedFriday} />
          {data?.source && <DataSourceBadge source={data.source} />}
        </div>
      </div>
      <p className="text-xs text-slate-500 -mt-3">
        Divendres a la tarda a diumenge, des de {formatAirportLabel(origin)}.
      </p>

      {isLoading ? (
        <p className="text-xs text-slate-400 animate-pulse">Buscant la millor oferta...</p>
      ) : best ? (
        <div className="space-y-3">
          <FlightDealCard deal={best} origin={origin} featured />
          {rest.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider">ALTRES GANGUES</h3>
              {rest.map((deal) => (
                <FlightDealCard key={deal.id} deal={deal} origin={origin} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No s'han trobat ofertes per aquest cap de setmana.</p>
      )}

      <FlightSearchWidget origin={origin} />
    </div>
  );
}

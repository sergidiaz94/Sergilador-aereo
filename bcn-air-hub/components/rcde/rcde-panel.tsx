'use client';

import { useRcdeFixtures } from '@/hooks/use-rcde-fixtures';
import { RcdeCombinationCard } from './rcde-combination-card';
import { DataSourceBadge } from '../dashboard/data-source-badge';

export function RcdePanel() {
  const { data, isLoading } = useRcdeFixtures();

  return (
    <div className="bg-gradient-to-br from-blue-950/20 to-slate-900 border border-blue-800/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-blue-400">OnTour RCDE</h2>
          <p className="text-xs text-slate-400 mt-1">
            Combinacions de vols per al proper desplaçament del RCD Espanyol des de Barcelona:
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data?.source && <DataSourceBadge source={data.source} />}
          {data?.fixture && (
            <span className="bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-lg text-xs font-bold text-blue-300">
              {data.fixture.homeTeam} vs {data.fixture.awayTeam}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-400 animate-pulse">Carregant proper partit...</p>
      ) : (
        <div className="space-y-4">
          {data?.combinations.map((comb) => (
            <RcdeCombinationCard key={comb.id} combination={comb} />
          ))}
        </div>
      )}
    </div>
  );
}

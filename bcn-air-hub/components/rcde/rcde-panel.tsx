'use client';

import { useRcdeFixtures } from '@/hooks/use-rcde-fixtures';
import { RcdeFixtureCard } from './rcde-fixture-card';
import { DataSourceBadge } from '../dashboard/data-source-badge';

export function RcdePanel() {
  const { data, isLoading } = useRcdeFixtures();

  return (
    <div className="bg-gradient-to-br from-blue-950/20 to-slate-900 border border-blue-800/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-blue-400">OnTour RCDE</h2>
          <p className="text-xs text-slate-400 mt-1">Propers partits del RCD Espanyol i com organitzar-hi el desplaçament:</p>
        </div>
        {data?.source && <DataSourceBadge source={data.source} />}
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-400 animate-pulse">Carregant propers partits...</p>
      ) : data?.fixtures && data.fixtures.length > 0 ? (
        <div className="space-y-4">
          {data.fixtures.map((fixture) => (
            <RcdeFixtureCard key={fixture.id} fixture={fixture} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No s'han trobat propers partits.</p>
      )}
    </div>
  );
}

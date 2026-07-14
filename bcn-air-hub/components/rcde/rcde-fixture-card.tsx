import { Home, PlaneTakeoff, XCircle, Clock } from 'lucide-react';
import { formatDisplayDateTime } from '@/lib/date';
import { formatAirportLabel } from '@/lib/airports';
import type { RcdeUpcomingFixture } from '@/types';

function buildAviasalesLink(destination: string, departISO?: string, returnISO?: string): string {
  if (!departISO) return 'https://www.aviasales.com';
  const fmt = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}`;
  };
  const back = returnISO ? fmt(returnISO) : '';
  return `https://www.aviasales.com/search/BCN${fmt(departISO)}${destination}${back}1`;
}

export function RcdeFixtureCard({ fixture }: { fixture: RcdeUpcomingFixture }) {
  const kickoff = new Date(fixture.utcDate);
  const previa = new Date(kickoff.getTime() - 2 * 60 * 60_000);
  const opponent = fixture.isHome ? fixture.awayTeam : fixture.homeTeam;

  return (
    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <span className="text-[10px] text-slate-500 font-bold tracking-wider block">{fixture.competition}</span>
          <span className="text-base font-bold text-white">
            {fixture.homeTeam} <span className="text-slate-500 font-normal">vs</span> {fixture.awayTeam}
          </span>
        </div>
        <span className="text-xs font-mono text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg whitespace-nowrap">
          {fixture.timeConfirmed ? formatDisplayDateTime(fixture.utcDate) : `${formatDisplayDateTime(fixture.utcDate).split(' ')[0]} · hora pendent`}
        </span>
      </div>

      {fixture.isHome ? (
        <div className="bg-slate-900 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3">
          <Home className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="text-emerald-400 font-bold block">Partit a casa — no cal volar</span>
            <span className="text-slate-400">
              Inici del partit: {formatDisplayDateTime(fixture.utcDate).split(' ')[1]}h · Obertura / previa:{' '}
              {formatDisplayDateTime(previa.toISOString()).split(' ')[1]}h
            </span>
          </div>
        </div>
      ) : fixture.ontour && !fixture.ontour.possible ? (
        <div className="bg-slate-900 border border-red-500/20 rounded-lg p-3 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="text-xs">
            <span className="text-red-400 font-bold block">OnTour no disponible</span>
            <span className="text-slate-400">{fixture.ontour.reason}</span>
          </div>
        </div>
      ) : fixture.ontour ? (
        <div className="bg-slate-900 border border-blue-500/20 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-3">
            <PlaneTakeoff className="w-5 h-5 text-blue-400 shrink-0" />
            <div className="text-xs">
              <span className="text-blue-300 font-bold block">
                Destí: {formatAirportLabel(fixture.ontour.destinationAirport ?? '')}
              </span>
              <span className="text-slate-500">
                ~{fixture.ontour.travelMinutesFromAirport} min de l'aeroport a l'estadi
              </span>
            </div>
          </div>

          {!fixture.timeConfirmed && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
              <Clock className="w-3 h-3" /> Horari del partit encara no confirmat: oferim divendres tarda a diumenge nit
            </div>
          )}

          {fixture.ontour.windowStart && fixture.ontour.windowEnd && (
            <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Arribar abans de:</span>
                <span className="font-mono">{formatDisplayDateTime(fixture.ontour.windowStart)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tornada a partir de:</span>
                <span className="font-mono">{formatDisplayDateTime(fixture.ontour.windowEnd)}</span>
              </div>
              {fixture.ontour.price !== undefined && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500">Preu orientatiu:</span>
                  <span className="font-black text-emerald-400 text-sm">
                    {fixture.ontour.price}
                    {fixture.ontour.currency === 'EUR' ? '€' : ` ${fixture.ontour.currency}`}
                  </span>
                </div>
              )}
            </div>
          )}

          <a
            href={fixture.ontour.priceLink ?? buildAviasalesLink(fixture.ontour.destinationAirport ?? '', fixture.ontour.windowStart, fixture.ontour.windowEnd)}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-1 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all"
          >
            Cercar vols per aquest partit
          </a>
        </div>
      ) : null}
    </div>
  );
}

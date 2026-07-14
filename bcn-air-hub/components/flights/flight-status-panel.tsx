'use client';

import { PlaneTakeoff } from 'lucide-react';
import { FlightStatusForm } from './flight-status-form';
import { FlightStatusResult } from './flight-status-result';
import { DataSourceBadge } from '../dashboard/data-source-badge';
import { useFlightStatus } from '@/hooks/use-flight-status';

export function FlightStatusPanel() {
  const { mutate, data, isPending, isIdle, error } = useFlightStatus();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2 text-blue-400">
          <PlaneTakeoff className="w-5 h-5" /> Estat de Vol
        </h2>
        {data?.source && <DataSourceBadge source={data.source} />}
      </div>

      <FlightStatusForm onSubmit={(flightNumber) => mutate(flightNumber)} loading={isPending} />

      {error && <p className="text-xs text-red-400 font-semibold">{(error as Error).message}</p>}

      {isIdle && !error && (
        <p className="text-xs text-slate-500">
          Introdueix un número de vol (ex. VY1234) per veure retard, porta i model d'avió.
        </p>
      )}

      {data && <FlightStatusResult status={data} />}
    </div>
  );
}

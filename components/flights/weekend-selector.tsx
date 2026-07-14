'use client';

import type { WeekendOption } from '@/lib/date';

type Props = { options: WeekendOption[]; value: string; onChange: (friday: string) => void };

export function WeekendSelector({ options, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] text-slate-400 font-bold">CAP DE SETMANA</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-semibold text-emerald-400 focus:outline-none focus:border-blue-500"
      >
        {options.map((weekend) => (
          <option key={weekend.friday} value={weekend.friday}>
            {weekend.label}
          </option>
        ))}
      </select>
    </div>
  );
}

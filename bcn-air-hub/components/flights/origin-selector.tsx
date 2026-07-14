'use client';

import { ORIGIN_AIRPORTS } from '@/lib/constants';

type Props = { value: string; onChange: (code: string) => void };

export function OriginSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] text-slate-400 font-bold">ORIGEN</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-300 focus:outline-none focus:border-blue-500"
      >
        {ORIGIN_AIRPORTS.map((airport) => (
          <option key={airport.code} value={airport.code}>
            {airport.label}
          </option>
        ))}
      </select>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useDestinationAutocomplete } from '@/hooks/use-destination-autocomplete';

type Props = {
  onSelect: (code: string, label: string) => void;
};

export function DestinationAutocomplete({ onSelect }: Props) {
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const { suggestions, loading } = useDestinationAutocomplete(term);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="On vols anar? (ex. Roma, Londres...)"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-blue-300 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
      />

      {open && (loading || suggestions.length > 0) && (
        <div className="absolute z-30 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          {loading && <div className="px-4 py-2 text-xs text-slate-500">Cercant...</div>}
          {!loading &&
            suggestions.map((suggestion) => (
              <button
                key={`${suggestion.type}-${suggestion.code}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  const label = `${suggestion.cityName} (${suggestion.code})`;
                  setTerm(label);
                  setOpen(false);
                  onSelect(suggestion.code, label);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 transition-colors flex justify-between items-center"
              >
                <span>
                  {suggestion.cityName}
                  {suggestion.countryName ? <span className="text-slate-500"> · {suggestion.countryName}</span> : null}
                </span>
                <span className="text-[10px] font-mono text-blue-400">{suggestion.code}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

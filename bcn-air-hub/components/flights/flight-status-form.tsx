'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

type Props = { onSubmit: (flightNumber: string) => void; loading: boolean };

export function FlightStatusForm({ onSubmit, loading }: Props) {
  const [value, setValue] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
      className="flex gap-3"
    >
      <input
        type="text"
        placeholder="Número de vol, ex. VY1234"
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-sm text-blue-300 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all whitespace-nowrap"
      >
        <Search className="w-4 h-4" /> {loading ? 'Consultant...' : 'Consultar'}
      </button>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { DestinationAutocomplete } from './destination-autocomplete';
import { DateField } from './date-field';
import { FlightSearchResultCard } from './flight-search-result-card';
import { useFlightSearch } from '@/hooks/use-flight-search';
import { getNextWeekend } from '@/lib/date';

type Props = { origin: string };

export function FlightSearchWidget({ origin }: Props) {
  const { friday, sunday } = getNextWeekend();
  const [destinationCode, setDestinationCode] = useState('');
  const [departDate, setDepartDate] = useState(friday);
  const [returnDate, setReturnDate] = useState(sunday);

  const { mutate, data, isPending, isIdle } = useFlightSearch();

  const handleSubmit = () => {
    if (!destinationCode) return;
    mutate({ origin, destination: destinationCode, departDate, returnDate: returnDate || undefined });
  };

  return (
    <div className="border-t border-slate-800 pt-5 space-y-4">
      <h3 className="text-xs font-bold text-slate-400 tracking-wider">CERCA EL TEU PROPI VOL</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
        <div className="md:col-span-2">
          <DestinationAutocomplete onSelect={(code) => setDestinationCode(code)} />
        </div>
        <DateField label="ANADA" value={departDate} onChange={setDepartDate} />
        <DateField label="TORNADA" value={returnDate} onChange={setReturnDate} accentClassName="text-emerald-400" />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending || !destinationCode}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all"
      >
        <Search className="w-4 h-4" /> {isPending ? 'Cercant...' : 'Cercar'}
      </button>

      {!isIdle && (
        <div className="space-y-3 pt-2">
          {isPending ? (
            <p className="text-xs text-slate-400 animate-pulse">Cercant preus...</p>
          ) : data?.offers && data.offers.length > 0 ? (
            data.offers.map((offer) => <FlightSearchResultCard key={offer.id} offer={offer} />)
          ) : (
            <p className="text-xs text-slate-400">No s'han trobat preus per aquesta ruta i dates.</p>
          )}
        </div>
      )}
    </div>
  );
}

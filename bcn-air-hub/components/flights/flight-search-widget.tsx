'use client';

import { useState } from 'react';
import { Search, Shuffle } from 'lucide-react';
import { DestinationAutocomplete } from './destination-autocomplete';
import { CalendarPicker } from './calendar-picker';
import { FlightSearchResultCard } from './flight-search-result-card';
import { FlightDealCard } from './flight-deal-card';
import { useFlightSearch } from '@/hooks/use-flight-search';
import { useCheapestAnywhere } from '@/hooks/use-cheapest-anywhere';
import { useAnywhereOnDates } from '@/hooks/use-anywhere-on-dates';
import { getNextWeekend, toLocalISODate } from '@/lib/date';

type Props = { origin: string };

export function FlightSearchWidget({ origin }: Props) {
  const { friday, sunday } = getNextWeekend();
  const today = toLocalISODate(new Date());
  const [destinationCode, setDestinationCode] = useState('');
  const [destinationLabel, setDestinationLabel] = useState('');
  const [departDate, setDepartDate] = useState(friday);
  const [returnDate, setReturnDate] = useState(sunday);

  const { mutate, data, isPending, isIdle } = useFlightSearch();
  const anywhereOnDates = useAnywhereOnDates();
  const anywhereAnytime = useCheapestAnywhere();

  const handleSubmit = () => {
    if (destinationCode) {
      mutate({ origin, destination: destinationCode, departDate, returnDate: returnDate || undefined });
    } else {
      // Sense destinació: busca quina és la més barata per a les dates triades.
      anywhereOnDates.mutate({ origin, departDate, returnDate });
    }
  };

  const isSearchingAnywhere = !destinationCode;
  const isPendingAny = isPending || anywhereOnDates.isPending;

  return (
    <div className="border-t border-slate-800 pt-5 space-y-4">
      <h3 className="text-xs font-bold text-slate-400 tracking-wider">CERCA EL TEU PROPI VOL</h3>
      <p className="text-[11px] text-slate-500 -mt-3">
        Deixa la destinació en blanc per trobar automàticament la més barata en aquestes dates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
        <div className="md:col-span-2">
          <DestinationAutocomplete
            onSelect={(code, label) => {
              setDestinationCode(code);
              setDestinationLabel(label);
            }}
          />
        </div>
        <CalendarPicker label="ANADA" value={departDate} onChange={setDepartDate} minDate={today} />
        <CalendarPicker label="TORNADA" value={returnDate} onChange={setReturnDate} minDate={departDate} />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSubmit}
          disabled={isPendingAny}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all"
        >
          <Search className="w-4 h-4" />
          {isPendingAny ? 'Cercant...' : isSearchingAnywhere ? 'Cercar destinació més barata' : 'Cercar'}
        </button>

        <button
          onClick={() => anywhereAnytime.mutate(origin)}
          disabled={anywhereAnytime.isPending}
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all border border-slate-700"
        >
          <Shuffle className="w-4 h-4" /> {anywhereAnytime.isPending ? 'Cercant...' : 'Més barat (qualsevol data)'}
        </button>
      </div>

      {!isIdle && (
        <div className="space-y-3 pt-2">
          {isPending ? (
            <p className="text-xs text-slate-400 animate-pulse">Cercant preus{destinationLabel ? ` a ${destinationLabel}` : ''}...</p>
          ) : data?.offers && data.offers.length > 0 ? (
            data.offers.map((offer) => <FlightSearchResultCard key={offer.id} offer={offer} />)
          ) : (
            <p className="text-xs text-slate-400">No s'han trobat preus per aquesta ruta i dates.</p>
          )}
        </div>
      )}

      {(anywhereOnDates.isPending || anywhereOnDates.data) && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-400 tracking-wider">
            MÉS BARAT PER {departDate.split('-').reverse().slice(0, 2).join('-')} A {returnDate.split('-').reverse().slice(0, 2).join('-')}
          </h4>
          {anywhereOnDates.isPending ? (
            <p className="text-xs text-slate-400 animate-pulse">Cercant totes les destinacions...</p>
          ) : anywhereOnDates.data && anywhereOnDates.data.deals.length > 0 ? (
            anywhereOnDates.data.deals
              .slice(0, 3)
              .map((deal, index) => <FlightDealCard key={deal.id} deal={deal} origin={origin} featured={index === 0} />)
          ) : (
            <p className="text-xs text-slate-400">No s'han trobat destinacions per aquestes dates.</p>
          )}
        </div>
      )}

      {anywhereAnytime.data && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-400 tracking-wider">ON ÉS MÉS BARAT VOLAR ARA MATEIX</h4>
          {anywhereAnytime.data.deals.length > 0 ? (
            anywhereAnytime.data.deals
              .slice(0, 3)
              .map((deal, index) => <FlightDealCard key={deal.id} deal={deal} origin={origin} featured={index === 0} />)
          ) : (
            <p className="text-xs text-slate-400">No s'han trobat destinacions ara mateix.</p>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { formatDisplayDate } from '@/lib/date';

type Props = { value: string; onChange: (iso: string) => void; label: string; minDate?: string };

const WEEKDAY_LABELS = ['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'];
const MONTH_LABELS = [
  'gener', 'febrer', 'març', 'abril', 'maig', 'juny',
  'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre',
];

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Genera la graella del mes amb setmanes de dilluns a diumenge.
function buildMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // getDay(): 0=diumenge...6=dissabte -> el convertim a índex dl=0...dg=6
  const firstWeekday = (firstDay.getDay() + 6) % 7;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= lastDay.getDate(); day += 1) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function CalendarPicker({ value, onChange, label, minDate }: Props) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const weeks = buildMonthGrid(viewYear, viewMonth);
  const min = minDate ? new Date(minDate) : null;

  const goToPrevMonth = () => {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  };
  const goToNextMonth = () => {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-left focus:outline-none focus:border-blue-500"
      >
        <span className="text-[10px] text-slate-400 font-bold block mb-0.5">{label}</span>
        <span className="text-sm text-slate-200 font-mono flex items-center gap-2">
          <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
          {value ? formatDisplayDate(value) : 'Selecciona'}
        </span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 w-72">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={goToPrevMonth} className="p-1 hover:bg-slate-800 rounded">
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <span className="text-xs font-bold text-slate-200 capitalize">
              {MONTH_LABELS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={goToNextMonth} className="p-1 hover:bg-slate-800 rounded">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((d) => (
              <span key={d} className="text-[10px] text-slate-500 text-center font-bold">
                {d}
              </span>
            ))}
          </div>

          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
              {week.map((date, dayIndex) => {
                if (!date) return <span key={dayIndex} />;
                const iso = toISO(date);
                const isSelected = iso === value;
                const isDisabled = min ? date < min : false;
                return (
                  <button
                    key={dayIndex}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      onChange(iso);
                      setOpen(false);
                    }}
                    className={`text-xs rounded-lg py-1.5 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : isDisabled
                          ? 'text-slate-700 cursor-not-allowed'
                          : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

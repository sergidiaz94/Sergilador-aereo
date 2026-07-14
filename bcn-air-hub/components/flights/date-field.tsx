'use client';

import { useEffect, useState } from 'react';

type Props = { value: string; onChange: (iso: string) => void; label: string; accentClassName?: string };

function isoToDisplay(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return '';
  return `${d}-${m}-${y}`;
}

function displayToIso(display: string): string | null {
  const match = display.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, d, m, y] = match;
  return `${y}-${m}-${d}`;
}

// Camp de data completament controlat (dd-mm-aaaa), en lloc de l'input
// nadiu <input type="date">, per garantir que sempre és editable amb
// teclat i que el format mostrat és sempre el català, independentment
// del navegador o configuració regional.
export function DateField({ value, onChange, label, accentClassName = 'text-slate-200' }: Props) {
  const [text, setText] = useState(isoToDisplay(value));

  useEffect(() => {
    setText(isoToDisplay(value));
  }, [value]);

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }
    setText(formatted);

    const iso = displayToIso(formatted);
    if (iso) onChange(iso);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-blue-500">
      <label className="text-[10px] text-slate-400 font-bold block mb-0.5">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        placeholder="DD-MM-AAAA"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        className={`bg-transparent text-sm focus:outline-none w-full font-mono ${accentClassName}`}
      />
    </div>
  );
}

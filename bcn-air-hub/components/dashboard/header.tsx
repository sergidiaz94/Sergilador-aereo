'use client';

import { Plane, User } from 'lucide-react';

type Props = { onOlgaClick: () => void };

export function DashboardHeader({ onOlgaClick }: Props) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shadow-2xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
          <Plane className="w-6 h-6 rotate-45" />
        </div>
        <div>
          <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-slate-100 bg-clip-text text-transparent tracking-tight">
            BCN AirHub
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Vols, Radar en Viu &amp; OnTour RCDE</p>
        </div>
      </div>

      <button
        onClick={onOlgaClick}
        className="relative overflow-hidden group bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-xl shadow-pink-500/20 active:scale-95 flex items-center gap-2 border border-pink-400/30 text-sm"
      >
        <User className="w-4 h-4 text-pink-200" />
        <span>{"Ets l'Olga?"}</span>
      </button>
    </header>
  );
}

'use client';

import { Plane } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 flex items-center shadow-2xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-blue-500/20">
          <Plane className="w-6 h-6 rotate-45" />
        </div>
        <div>
          <h1 className="text-xl font-black font-mono tracking-tight text-blue-400 border-b-2 border-blue-500/30 pb-0.5">
            SERGILADOR AEREO
          </h1>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Vols · Radar en Viu · OnTour RCDE</p>
        </div>
      </div>
    </header>
  );
}

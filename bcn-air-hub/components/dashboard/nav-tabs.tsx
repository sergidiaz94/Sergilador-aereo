'use client';

import { Sparkles, Map, PlaneTakeoff, Trophy, Heart, type LucideIcon } from 'lucide-react';
import type { DashboardTab } from '@/types';

const TABS: { id: DashboardTab; label: string; icon: LucideIcon }[] = [
  { id: 'deals', label: 'Millor Oferta des de BCN', icon: Sparkles },
  { id: 'radar', label: 'Radar+ (Ubicació Real)', icon: Map },
  { id: 'status', label: 'Estat de Vol', icon: PlaneTakeoff },
  { id: 'rcde', label: 'OnTour RCDE', icon: Trophy },
  { id: 'olga', label: "Ets l'Olga?", icon: Heart },
];

type Props = { active: DashboardTab; onChange: (tab: DashboardTab) => void };

export function NavTabs({ active, onChange }: Props) {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 flex gap-2 overflow-x-auto">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            active === id
              ? 'border-blue-500 text-blue-400 bg-blue-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Icon className="w-4 h-4" /> {label}
        </button>
      ))}
    </nav>
  );
}

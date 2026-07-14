'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardHeader } from './header';
import { NavTabs } from './nav-tabs';
import { FlightDealsPanel } from '../flights/flight-deals-panel';
import { FlightStatusPanel } from '../flights/flight-status-panel';
import { RadarPanel } from '../radar/radar-panel';
import { RcdePanel } from '../rcde/rcde-panel';
import { OlgaPanel } from '../olga/olga-panel';
import { useGeolocation } from '@/hooks/use-geolocation';
import type { DashboardTab } from '@/types';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('deals');
  const userCoords = useGeolocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      <DashboardHeader />
      <NavTabs active={activeTab} onChange={setActiveTab} />

      <main className="flex-1 p-4 max-w-7xl w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'deals' && <FlightDealsPanel />}
            {activeTab === 'radar' && <RadarPanel userCoords={userCoords} />}
            {activeTab === 'status' && <FlightStatusPanel />}
            {activeTab === 'rcde' && <RcdePanel />}
            {activeTab === 'olga' && <OlgaPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

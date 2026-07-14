'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { FlightDetailCard } from './flight-detail-card';
import { WeatherChip } from './weather-chip';
import { DataSourceBadge } from '../dashboard/data-source-badge';
import { useLiveRadar } from '@/hooks/use-live-radar';
import type { LiveFlight, RadarOrigin } from '@/types';

// Leaflet toca `window`/`document`, així que el mapa es carrega només al
// navegador (ssr: false) per evitar errors de renderitzat al servidor.
const RadarLeafletMap = dynamic(() => import('./radar-leaflet-map').then((mod) => mod.RadarLeafletMap), {
  ssr: false,
  loading: () => <p className="text-xs text-slate-500 font-mono">Carregant mapa...</p>,
});

type Props = { userCoords: RadarOrigin };

export function RadarPanel({ userCoords }: Props) {
  const { data, isLoading } = useLiveRadar(userCoords.lat, userCoords.lng, userCoords.label);
  const [selectedFlight, setSelectedFlight] = useState<LiveFlight | null>(null);

  const flights = data?.flights ?? [];
  const activeFlight = selectedFlight ?? flights[0] ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden h-[450px]">
        <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl text-xs flex items-center gap-2 backdrop-blur z-[1000]">
          <MapPin className="w-4 h-4 text-pink-400 animate-bounce" />
          <div>
            <span className="text-slate-400 font-bold block text-[10px]">POSICIÓ DEL TEU DISPOSITIU</span>
            <span className="text-white font-mono">
              {userCoords.label} ({userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)})
            </span>
          </div>
        </div>

        {data?.source && (
          <div className="absolute top-4 right-4 z-[1000]">
            <DataSourceBadge source={data.source} />
          </div>
        )}

        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-xs text-slate-500 font-mono">Carregant trànsit aeri...</p>
          </div>
        ) : (
          <RadarLeafletMap origin={userCoords} flights={flights} onSelect={setSelectedFlight} />
        )}

        <WeatherChip lat={userCoords.lat} lng={userCoords.lng} label={userCoords.label} />
      </div>

      <FlightDetailCard flight={activeFlight} />
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  departureLat: number;
  departureLng: number;
  departureLabel: string;
  arrivalLat: number;
  arrivalLng: number;
  arrivalLabel: string;
};

function airportIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 6px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function FlightRouteMap({ departureLat, departureLng, departureLabel, arrivalLat, arrivalLng, arrivalLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const depMarker = L.marker([departureLat, departureLng], { icon: airportIcon('#60a5fa') })
      .bindTooltip(departureLabel, { permanent: false })
      .addTo(map);
    const arrMarker = L.marker([arrivalLat, arrivalLng], { icon: airportIcon('#ec4899') })
      .bindTooltip(arrivalLabel, { permanent: false })
      .addTo(map);

    const line = L.polyline(
      [
        [departureLat, departureLng],
        [arrivalLat, arrivalLng],
      ],
      { color: '#60a5fa', weight: 2, dashArray: '6 6' },
    ).addTo(map);

    map.fitBounds(line.getBounds(), { padding: [40, 40] });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      void depMarker;
      void arrMarker;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden" />;
}

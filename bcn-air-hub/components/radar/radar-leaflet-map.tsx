'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LiveFlight, RadarOrigin } from '@/types';

type Props = {
  origin: RadarOrigin;
  flights: LiveFlight[];
  onSelect: (flight: LiveFlight) => void;
};

// Icona d'avió com a SVG inline, rotada segons el rumb (heading) real.
function planeIcon(heading: number | null): L.DivIcon {
  const rotation = heading ?? 0;
  return L.divIcon({
    className: '',
    html: `<div style="transform: rotate(${rotation}deg); display:flex; align-items:center; justify-content:center;">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#60a5fa" stroke="#1e3a8a" stroke-width="0.5">
        <path d="M12 2 L15 10 L22 14 L15 15 L14 21 L12 18 L10 21 L9 15 L2 14 L9 10 Z" />
      </svg>
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function originIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#ec4899;border:2px solid white;box-shadow:0 0 8px #ec4899;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export function RadarLeafletMap({ origin, flights, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Inicialitza el mapa un únic cop.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [origin.lat, origin.lng],
      zoom: 8,
      zoomControl: true,
      attributionControl: true,
    });

    // Tessel·les fosques de CARTO (basades en dades d'OpenStreetMap), gratuïtes
    // i sense clau d'API, més coherents amb el disseny fosc de l'app.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-centra el mapa si canvia l'origen (per exemple, geolocalització tardana).
  useEffect(() => {
    mapRef.current?.setView([origin.lat, origin.lng], mapRef.current.getZoom());
  }, [origin.lat, origin.lng]);

  // Actualitza els marcadors (origen + avions) quan canvien les dades.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const originMarker = L.marker([origin.lat, origin.lng], { icon: originIcon() })
      .bindTooltip(origin.label, { direction: 'top' })
      .addTo(map);
    markersRef.current.push(originMarker);

    flights.forEach((flight) => {
      const marker = L.marker([flight.latitude, flight.longitude], { icon: planeIcon(flight.heading) })
        .bindTooltip(flight.callsign, { direction: 'top', permanent: false })
        .on('click', () => onSelect(flight))
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [origin, flights, onSelect]);

  return <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden" />;
}

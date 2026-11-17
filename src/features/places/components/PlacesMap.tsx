import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Lugar } from '../../../shared/contracts/api.js';

export function PlacesMap({ lugares, selectedId, onSelect }: {
  lugares: Lugar[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const selected = lugares.find((lugar) => lugar.id === selectedId);
  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
      <MapContainer center={[4.641833, -74.171758]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapFocus lugar={selected} />
        {lugares.map((lugar) => (
          <CircleMarker
            key={lugar.id}
            center={[lugar.lat, lugar.lon]}
            radius={selectedId === lugar.id ? 9 : 6}
            pathOptions={{ color: selectedId === lugar.id ? '#1d4ed8' : '#0f766e', fillColor: selectedId === lugar.id ? '#2563eb' : '#14b8a6', fillOpacity: 0.85 }}
            eventHandlers={{ click: () => onSelect(lugar.id) }}
          >
            <Popup>{lugar.nombre}<br />{lugar.categoriaCodigo} · {lugar.tipo ?? 'sin tipo'} · ID {lugar.id}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

function MapFocus({ lugar }: { lugar?: Lugar }) {
  const map = useMap();
  useEffect(() => {
    if (lugar) map.flyTo([lugar.lat, lugar.lon], 16);
  }, [lugar, map]);
  return null;
}
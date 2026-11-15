import { GeoJSON, MapContainer, Popup, TileLayer } from 'react-leaflet';
import type { BarrioGeometria } from '../../../shared/contracts/api.js';
import { formatArea, formatDecimal } from '../../../shared/lib/format.js';
import { MapaAjuste } from '../lib/MapaAjuste.js';

export function MapaLeaflet({ data }: { data: BarrioGeometria }) {
  return (
    <MapContainer
      center={[data.centroide.lat, data.centroide.lon]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapaAjuste limites={data.limites} />
      <GeoJSON
        data={data.geometria}
        style={{ color: '#0f766e', weight: 2, fillColor: '#14b8a6', fillOpacity: 0.18 }}
      >
        <Popup>
          <strong>{data.nombre}</strong>
          <br />
          Área oficial: {formatArea(data.area.hectareas, data.area.metrosCuadrados)}
          <br />
          Centroide: {formatDecimal(data.centroide.lat)}, {formatDecimal(data.centroide.lon)}
          <br />
          Fuente: {data.fuente.entidad} · {data.fuente.fechaConsulta}
        </Popup>
      </GeoJSON>
    </MapContainer>
  );
}

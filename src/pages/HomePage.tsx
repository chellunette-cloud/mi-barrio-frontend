import { BarrioFicha } from '../features/barrio/components/BarrioFicha.js';
import { MapaBarrio } from '../features/mapa/components/MapaBarrio.js';

export function HomePage() {
  return (
    <>
      <BarrioFicha />
      <MapaBarrio />
    </>
  );
}

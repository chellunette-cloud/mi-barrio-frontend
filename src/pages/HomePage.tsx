import { BarrioFicha } from '../features/barrio/components/BarrioFicha.js';
import { MapaBarrio } from '../features/mapa/components/MapaBarrio.js';
import { PlacesSection } from '../features/places/components/PlacesSection.js';

export function HomePage() {
  return (
    <>
      <BarrioFicha />
      <MapaBarrio />
      <PlacesSection />
    </>
  );
}

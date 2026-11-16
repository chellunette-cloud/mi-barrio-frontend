import { BarrioFicha } from '../features/barrio/components/BarrioFicha.js';
import { MapaBarrio } from '../features/mapa/components/MapaBarrio.js';
import { PlacesSection } from '../features/places/components/PlacesSection.js';
import { ViasSection } from '../features/vias/components/ViasSection.js';
import { StatsSection } from '../features/stats/components/StatsSection.js';

export function HomePage() {
  return (
    <>
      <BarrioFicha />
      <MapaBarrio />
      <PlacesSection />
      <ViasSection />
      <StatsSection />
    </>
  );
}

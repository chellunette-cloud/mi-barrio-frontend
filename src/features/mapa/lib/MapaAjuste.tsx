import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapaAjusteProps {
  limites: { norte: number; sur: number; este: number; oeste: number };
}

export function MapaAjuste({ limites }: MapaAjusteProps) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(
      [
        [limites.sur, limites.oeste],
        [limites.norte, limites.este]
      ],
      { padding: [24, 24] }
    );
  }, [map, limites]);
  return null;
}

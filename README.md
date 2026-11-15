# mi-barrio-frontend

Interfaz pública de **Mi Barrio – Ciudad Granada** para HU-01 (ficha) y HU-02 (mapa). Repositorio
independiente: consume solo la API pública por HTTP y tipos generados desde su contrato OpenAPI.

## Stack

React 19 + TypeScript estricto + Vite + Tailwind CSS 4 + Leaflet / React Leaflet. Diseño responsive y
accesibilidad con HTML semántico, foco visible, `aria-*`, estado de carga y error con reintento.

## Puesta en marcha

```bash
npm ci
cp .env.example .env
npm run dev
```

Vite usa el proxy `/api` hacia `http://127.0.0.1:3000`. Para un despliegue separado, definir
`VITE_API_BASE_URL` con la URL pública de la API.

## Contrato de la API

`contracts/public.openapi.yaml` es un artefacto sincronizado desde `mi-barrio-api`; no se edita a
mano. El hash queda en `contracts/public.openapi.sha256` y los tipos se generan con
`openapi-typescript`.

```bash
npm run contracts:sync
npm run contracts:types
npm run contracts:verify
```

La UI importa `components['schemas']['Barrio']` y `BarrioGeometria` desde el artefacto generado
`src/shared/contracts/api-schema.ts`.

## Integración Leaflet

- `src/features/mapa/components/MapaLeaflet.tsx` monta `MapContainer`, `TileLayer` y `GeoJSON`.
- `src/features/mapa/lib/MapaAjuste.tsx` usa `useMap()` y `fitBounds()` para encuadrar el polígono
  completo con margen, sin calcular límites ni dibujar geometría a mano.
- `src/styles/index.css` importa Tailwind y ajusta `z-index`, tipografía y atribución de Leaflet.
- El CSS base de Leaflet se importa en `src/main.tsx`.
- Atribución visible: mapa base © OpenStreetMap contributors; polígono y centroide SDP/UAECD – IDECA,
  licencia y fecha de consulta. El popup repite fuente y fecha.

## Pruebas

```bash
npm run typecheck
npm run lint
npm run check:lines
npm test
npm run test:acceptance
npm run ci
```

- Unitarias: formato de datos.
- Integración: ficha con datos y fuentes, estado de error y reintento.
- Aceptación Playwright: escritorio y móvil, ficha, fuentes, mapa, encuadre, zoom, popup y foco por
  teclado. Requiere backend + API + Vite en ejecución.
- Capturas reales: `test-results/ficha-mapa-desktop.png` y `ficha-mapa-mobile.png`; la copia de
  evidencia está en `../docs/evidencias/fase-1/`.

## Límite de 100 líneas

`npm run check:lines` y ESLint fallan si un archivo escrito a mano supera 100 líneas. El artefacto
generado `src/shared/contracts/api-schema.ts` se excluye.

## Alcance

No se implementan HU-03 a HU-13, autenticación administrativa, establecimientos, historia, rutas ni
datos sin fuente. Los campos sin fuente se muestran como “Información no disponible”.

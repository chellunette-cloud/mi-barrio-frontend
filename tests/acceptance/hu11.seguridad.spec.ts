import { expect, test } from '@playwright/test';
import { openHome, stats } from './helpers.js';

test.describe('HU-11 · Seguridad y entorno', () => {
  test('CA-HU11-01 muestra CAI, cuadrante, teléfono y UPZ', async ({ page }) => {
    await openHome(page);
    const section = stats(page);
    await expect(section).toContainText('CAI Bellavista', { timeout: 20000 });
    await expect(section).toContainText('MEBOGMNVCCC03E08C04000011');
    await expect(section).toContainText('300 202 6917');
    await expect(section).toContainText('UPZ 82');
  });

  test('CA-HU11-02 etiqueta los delitos como Localidad de Kennedy (08)', async ({ page }) => {
    await openHome(page);
    const section = stats(page);
    await expect(section).toContainText('Localidad de Kennedy (08)', { timeout: 20000 });
    await expect(section).toContainText('2018-2026');
    await expect(section).toContainText('Fuente F-09');
    await expect(section).toContainText('no al barrio Ciudad Granada');
  });

  test('CA-HU11-03 muestra capas ambientales con fuente y escala', async ({ page }) => {
    await openHome(page);
    const section = stats(page);
    await expect(section).toContainText('Arbolado urbano · F-10 · Censo', { timeout: 20000 });
    await expect(section).toContainText('Zona de ronda del río Bogotá · F-11 · POT 2018');
    await expect(section).toContainText('Amenaza de inundación · F-12 · POT');
  });
});

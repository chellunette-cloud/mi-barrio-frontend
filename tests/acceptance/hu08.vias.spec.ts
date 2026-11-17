import { expect, test } from '@playwright/test';
import { openHome, vias } from './helpers.js';

test.describe('HU-08 · Vías y accesos', () => {
  test('CA-HU08-01 dibuja la malla vial y declara su jerarquía disponible', async ({ page }) => {
    await openHome(page);
    const section = vias(page);
    await expect(section.getByText(/tramos cargados/)).toBeVisible({ timeout: 20000 });
    await expect(section.getByText(/residenciales/)).toBeVisible();
    await expect(section.getByText(/terciarios/)).toBeVisible();
    await expect(section.locator('.leaflet-container')).toBeVisible();
    await expect(section.locator('path.leaflet-interactive').first()).toBeVisible({ timeout: 20000 });
  });

  test('CA-HU08-02 y CA-HU08-03 resaltan accesos y no presentan rutas inventadas', async ({ page }) => {
    await openHome(page);
    const section = vias(page);
    await expect(section.getByText(/accesos al entorno/)).toBeVisible({ timeout: 20000 });
    await expect(section.getByText(/no se presentan rutas calculadas/)).toBeVisible();
    await expect(section.getByText(/Ruta sugerida|Cómo llegar calculado|Indicaciones paso a paso/i)).toHaveCount(0);
  });
});

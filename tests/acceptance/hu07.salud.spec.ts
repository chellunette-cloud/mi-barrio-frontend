import { expect, test } from '@playwright/test';
import { expectPlaces, filter, openHome, places } from './helpers.js';

test.describe('HU-07 · Servicios de salud', () => {
  test('CA-HU07-01 y CA-HU07-02 listan nombre, tipo, dirección y distancia', async ({ page }) => {
    await openHome(page);
    await filter(page, 'Servicios de salud');
    await expectPlaces(page);
    const section = places(page);

    await expect(section.getByText(/ips/i).first()).toBeVisible();
    await expect(section.getByText(/farmacia/i).first()).toBeVisible();
    await expect(section.getByText(/consultorio/i).first()).toBeVisible();
    await expect(section.getByText(/Dirección no disponible/)).toHaveCount(0);

    const farmacia = section.locator('li').filter({ hasText: /farmacia/i }).first();
    await expect(farmacia).toContainText(/\d+ m|cercano/i);
    await farmacia.getByRole('button').click();
    const farmaciaDetail = section.getByRole('article');
    await expect(farmaciaDetail).toContainText(/farmacia/i);
    await expect(farmaciaDetail).toContainText(/Dirección:/);
    await expect(farmaciaDetail).toContainText(/\d+ m/);
    await expect(farmaciaDetail).toContainText(/Fuente principal:/);

    const item = section.locator('li').filter({ hasText: /ips/i }).first();
    await expect(item).toContainText(/\d+ m|cercano/i);
    await item.getByRole('button').click();

    const detail = section.getByRole('article');
    await expect(detail).toContainText(/ips/i);
    await expect(detail).toContainText(/Dirección:/);
    await expect(detail).toContainText(/\d+ m/);
    await expect(detail).toContainText(/Fuente principal:/);
  });

  test('CA-HU07-03 declara cercanía, ausencia dentro del polígono y distancia mínima', async ({ page }) => {
    await openHome(page);
    await filter(page, 'Servicios de salud');
    await expectPlaces(page);
    const section = places(page);

    await expect(section.getByText(/Servicios de salud cercanos: \d+/)).toBeVisible();
    await expect(section.getByText(/No hay prestadores dentro del polígono/)).toBeVisible();
    await expect(section.getByText(/Distancia mínima: \d+ m/)).toBeVisible();
    await expect(section.locator('li').first()).toContainText(/Cercano/);
  });
});

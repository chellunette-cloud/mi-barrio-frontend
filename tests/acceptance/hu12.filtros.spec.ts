import { expect, test } from '@playwright/test';
import { expectPlaces, filter, openHome, places } from './helpers.js';

async function visibleCount(page: import('@playwright/test').Page): Promise<number> {
  const text = await places(page).getByText(/\d+ lugares visibles/).textContent();
  return Number(text?.match(/\d+/)?.[0] ?? -1);
}

test.describe('HU-12 · Filtros del mapa', () => {
  test('CA-HU12-01 y CA-HU12-03 filtro simple consistente entre contador, lista y mapa', async ({ page }) => {
    await openHome(page);
    await expectPlaces(page);
    await filter(page, 'Servicios de salud');
    const section = places(page);
    const items = section.locator('li[data-categoria="salud"]');
    await expect(items.first()).toBeVisible();
    await expect(section.locator('li:not([data-categoria="salud"])')).toHaveCount(0);
    const expected = await items.count();
    expect(await visibleCount(page)).toBe(expected);
    await expect.poll(async () => section.locator('path.leaflet-interactive').count()).toBe(expected);
  });

  test('CA-HU12-02 y CA-HU12-04 combinan categorías y restablecen todos los lugares', async ({ page }) => {
    await openHome(page);
    await expectPlaces(page);
    await filter(page, 'Instituciones educativas');
    await filter(page, 'Establecimientos comerciales');
    const section = places(page);
    const educacion = section.locator('li[data-categoria="educacion"]');
    const comercio = section.locator('li[data-categoria="comercio"]');
    await expect(educacion.first()).toBeVisible();
    await expect(comercio.first()).toBeVisible();
    const combined = await educacion.count() + await comercio.count();
    expect(await visibleCount(page)).toBe(combined);

    await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).click();
    await expect.poll(async () => visibleCount(page)).toBeGreaterThan(combined);
    await expect(section.locator('li[data-categoria="salud"]').first()).toBeVisible();
    await expect(section.locator('li[data-categoria="transporte"]').first()).toBeVisible();
  });

  test('CA-HU12-03 estado vacío y error de carga visibles', async ({ page }) => {
    await openHome(page);
    await expectPlaces(page);
    await page.getByPlaceholder('Buscar por nombre o dirección').fill('zzzz-sin-resultados-e2e');
    await expect(places(page).getByText('No se encontraron lugares con los filtros seleccionados.')).toBeVisible({ timeout: 20000 });
    await expect(places(page).getByText('0 lugares visibles')).toBeVisible();

    await page.route('**/api/v1/lugares**', (route) => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: { code: 'FALLO_SIMULADO', message: 'Fallo simulado de carga' } })
    }));
    await page.reload();
    await expect(page.getByText('Fallo simulado de carga')).toBeVisible({ timeout: 20000 });
  });
});

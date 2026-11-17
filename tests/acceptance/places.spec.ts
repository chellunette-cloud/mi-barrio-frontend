import { expect, test } from '@playwright/test';

test('HU-03 a HU-06 muestran catálogo, comercio, parques y educación', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Lugares de interés' })).toBeVisible();
  await page.getByRole('button', { name: 'Instituciones educativas' }).click();
  await expect(page.getByText('COLEGIO ALEJANDRO MAGNO')).toBeVisible({ timeout: 20000 });
  await page.getByRole('button', { name: 'Establecimientos comerciales' }).click();
  await expect(page.getByText('Catálogo curado con fuente por registro. Cobertura parcial para comercio.')).toBeVisible();
  await page.getByRole('button', { name: 'Parques y zonas verdes' }).click();
  await expect(page.getByRole('heading', { name: 'Parques y zonas verdes cercanas' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar filtros' }).click();
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
});

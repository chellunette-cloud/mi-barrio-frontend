import { expect, test } from '@playwright/test';
import { expectPlaces, filter, openHome, places } from './helpers.js';

test.describe('HU-09 · Transporte público', () => {
  test('CA-HU09-01 lista paraderos con nombre, ubicación y distancia', async ({ page }) => {
    await openHome(page);
    await filter(page, 'Transporte público');
    await expectPlaces(page);
    const section = places(page);
    const first = section.locator('li').first();

    await expect(first).toContainText(/paradero/i);
    await expect(first).toContainText(/\d+ m/);
    await expect(first).toContainText(/Calle|CL|KR|Sur|Dirección/);
    await expect(section.getByText(/Paraderos SITP cercanos: \d+/)).toBeVisible();
  });

  test('CA-HU09-02 identifica la estación y el portal más cercanos', async ({ page }) => {
    await openHome(page);
    await filter(page, 'Transporte público');
    await expectPlaces(page);
    const section = places(page);

    await expect(section.getByText(/Estación más cercana: .+ · \d+ m/)).toBeVisible();
    await expect(section.getByText(/Portal más cercano: .+ · \d+ m/)).toBeVisible();
  });

  test('CA-HU09-03 selecciona un elemento y no publica rutas, horarios ni frecuencias', async ({ page }) => {
    await openHome(page);
    await filter(page, 'Transporte público');
    await expectPlaces(page);
    const section = places(page);
    await section.locator('li').first().getByRole('button').click();

    await expect(section.getByRole('article')).toContainText(/Identificador interno: \d+/);
    await expect(section.getByRole('article')).toContainText(/Código SITP: \d{3}[A-Z]\d{2}/);
    await expect(section.getByRole('article')).toContainText(/paradero/i);
    await expect(section.getByText(/Rutas disponibles|Horario:|Frecuencia cada|Tiempo de llegada/i)).toHaveCount(0);
  });
});

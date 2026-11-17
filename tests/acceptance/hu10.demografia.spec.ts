import { expect, test } from '@playwright/test';
import { openHome, stats } from './helpers.js';

test.describe('HU-10 · Información demográfica', () => {
  test('CA-HU10-01 y CA-HU10-02 separan barrio y UPZ con año y fuente', async ({ page }) => {
    await openHome(page);
    const section = stats(page);
    await expect(section).toContainText('Barrio Ciudad Granada', { timeout: 20000 });
    await expect(section).toContainText('Población: 3.807');
    await expect(section).toContainText('Estrato: 2');
    await expect(section).toContainText('UPZ 82 Patio Bonito');
    await expect(section).toContainText('Población 2025: 133.130');
    await expect(section).toContainText('H 66.175 / M 66.955');
    await expect(section).toContainText('Fuente: F-01');
    await expect(section).toContainText('Fuente: F-03');

    const edadRow = section.getByText('0-4');
    await section.locator('summary').click();
    await expect(edadRow.first()).toBeVisible();
    await expect(section).toContainText('5.006');
    await expect(section).toContainText('85 y más');
  });

  test('CA-HU10-03 no prorratea edad ni sexo de la UPZ al barrio', async ({ page }) => {
    await openHome(page);
    const section = stats(page);
    const barrio = section.locator('article').filter({ hasText: 'Barrio Ciudad Granada' }).first();
    const upz = section.locator('article').filter({ hasText: 'UPZ 82 Patio Bonito' }).first();

    await expect(barrio).not.toContainText(/H \d|M \d|quinquenio/i);
    await expect(upz).not.toContainText('3.807');
    await expect(section.getByText(/no se prorratea al barrio/)).toBeVisible();
  });
});

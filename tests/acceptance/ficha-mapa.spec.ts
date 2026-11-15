import { expect, test } from '@playwright/test';

test('HU-01 y HU-02 se ven en escritorio y móvil', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Ciudad Granada' })).toBeVisible();
  await expect(page.getByText('URBANIZACION CIUDAD GRANADA')).toBeVisible();
  await expect(page.getByText('3.807')).toBeVisible();
  await expect(page.getByText(/9,1 ha/)).toBeVisible();
  await expect(page.getByText('UPL14')).toBeVisible();
  await expect(page.getByText('Información no disponible', { exact: true })).toBeVisible();
  const atribucion = page.locator('figcaption');
  await expect(atribucion).toContainText('SDP/UAECD – IDECA');
  await expect(atribucion).toContainText('CC BY 4.0');
  await expect(page.getByRole('region', { name: /Mapa interactivo/ })).toBeVisible();
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(1, { timeout: 20000 });
  const mapBox = await page.getByRole('region', { name: /Mapa interactivo/ }).boundingBox();
  const pathBox = await page.locator('.leaflet-overlay-pane path').boundingBox();
  expect(mapBox && pathBox).toBeTruthy();
  if (mapBox && pathBox) {
    expect(pathBox.x).toBeGreaterThanOrEqual(mapBox.x);
    expect(pathBox.y).toBeGreaterThanOrEqual(mapBox.y);
    expect(pathBox.x + pathBox.width).toBeLessThanOrEqual(mapBox.x + mapBox.width);
    expect(pathBox.y + pathBox.height).toBeLessThanOrEqual(mapBox.y + mapBox.height);
  }
  await page.locator('.leaflet-control-zoom-in').click();
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(1);
  await page.locator('.leaflet-overlay-pane path').click({ force: true });
  await expect(page.locator('.leaflet-popup-content')).toContainText('URBANIZACION CIUDAD GRANADA');
  await page.screenshot({ path: 'test-results/ficha-mapa-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByText('3.807')).toBeVisible();
  await expect(page.getByRole('region', { name: /Mapa interactivo/ })).toBeVisible();
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(1, { timeout: 20000 });
  await page.screenshot({ path: 'test-results/ficha-mapa-mobile.png', fullPage: true });
});

test('la ficha se recorre con teclado y el foco es visible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido principal' })).toBeFocused();
  const enlace = page.getByRole('link', { name: /datosabiertos/ }).first();
  await enlace.focus();
  const boxShadow = await enlace.evaluate((elemento) => getComputedStyle(elemento).boxShadow);
  expect(boxShadow).not.toBe('none');
});

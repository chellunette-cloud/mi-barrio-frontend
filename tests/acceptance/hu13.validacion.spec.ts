import { expect, test } from '@playwright/test';
import { ADMIN, API, loginApi } from './helpers.js';

test.describe('HU-13 · Administración: validación', () => {
  test('CA-HU13-03 rechaza campos incompletos y coordenadas fuera del área', async ({ page, request }) => {
    const token = await loginApi(request);
    const headers = { Authorization: `Bearer ${token}` };
    const emptyName = await request.post(`${API}/api/v1/admin/lugares`, {
      headers, data: { categoriaId: 1, nombre: '', lat: 4.641833, lon: -74.171758 }
    });
    expect(emptyName.status()).toBe(400);
    const emptyBody = await emptyName.json() as { error: { code: string; message: string } };
    expect(emptyBody.error.code).toBe('DATOS_INVALIDOS');
    expect(emptyBody.error.message).toContain('nombre');

    const outside = await request.post(`${API}/api/v1/admin/lugares`, {
      headers, data: { categoriaId: 1, nombre: 'E2E-FUERA-AREA', lat: 0, lon: 0 }
    });
    expect(outside.status()).toBe(400);
    expect((await outside.json() as { error: { code: string } }).error.code).toBe('COORDENADAS_FUERA_AREA');

    const name = `E2E-INVALIDO-${Date.now()}`;
    await page.goto('/#admin');
    await page.getByPlaceholder('Usuario').fill(ADMIN.username);
    await page.getByPlaceholder('Contraseña').fill(ADMIN.password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page.getByRole('heading', { name: 'Panel administrativo' })).toBeVisible({ timeout: 20000 });
    await page.getByPlaceholder('Nombre', { exact: true }).fill(name);
    await page.getByPlaceholder('Lat').fill('0');
    await page.getByRole('button', { name: 'Crear', exact: true }).click();
    await expect(page.getByText(/área de influencia/)).toBeVisible({ timeout: 20000 });

    const publicList = await request.get(`${API}/api/v1/lugares?q=${encodeURIComponent(name)}`);
    expect(await publicList.json()).toHaveLength(0);
  });
});

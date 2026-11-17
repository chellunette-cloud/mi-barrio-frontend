import { expect, test } from '@playwright/test';
import { ADMIN, API } from './helpers.js';

test.describe('HU-13 · Administración: acceso y autorización', () => {
  test('CA-HU13-01 rechaza acceso sin token y no expone datos de gestión', async ({ page, request }) => {
    const noToken = await request.get(`${API}/api/v1/admin/lugares`);
    expect(noToken.status()).toBe(401);
    const invalid = await request.get(`${API}/api/v1/admin/lugares`, { headers: { Authorization: 'Bearer invalido' } });
    expect(invalid.status()).toBe(401);

    await page.goto('/#admin');
    await expect(page.getByRole('heading', { name: 'Administración' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Panel administrativo' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Eliminar' })).toHaveCount(0);
  });

  test('rechaza credenciales incorrectas sin iniciar sesión', async ({ page }) => {
    await page.goto('/#admin');
    await page.getByPlaceholder('Usuario').fill(ADMIN.username);
    await page.getByPlaceholder('Contraseña').fill('ClaveIncorrecta!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page.getByText('Credenciales inválidas')).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('heading', { name: 'Panel administrativo' })).toHaveCount(0);

    const login = await page.request.post(`${API}/api/v1/auth/login`, {
      data: { username: ADMIN.username, password: 'ClaveIncorrecta!' }
    });
    expect(login.status()).toBe(401);
  });
});

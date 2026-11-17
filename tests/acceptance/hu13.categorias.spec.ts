import { expect, test } from '@playwright/test';
import { ADMIN, API, loginApi } from './helpers.js';

test.describe('HU-13 · Administración: categorías', () => {
  test('CA-HU13-05 crea, edita, protege y reasigna categorías', async ({ page, request }) => {
    const token = await loginApi(request);
    const code = `e2e-cat-${Date.now()}`;
    const createdName = `E2E-CAT-${Date.now()}`;
    const editedName = `${createdName} EDITADO`;
    let categoriaId: number | undefined;
    let placeId: number | undefined;

    try {
      await page.goto('/#admin');
      await page.getByPlaceholder('Usuario').fill(ADMIN.username);
      await page.getByPlaceholder('Contraseña').fill(ADMIN.password);
      await page.getByRole('button', { name: 'Ingresar' }).click();
      await expect(page.getByRole('heading', { name: 'Panel administrativo' })).toBeVisible({ timeout: 20000 });
      await page.getByPlaceholder('Código').fill(code);
      await page.getByPlaceholder('Nombre de categoría').fill(createdName);
      await page.getByPlaceholder('Descripción').fill('Categoría temporal E2E.');
      await page.getByRole('button', { name: 'Crear categoría' }).click();
      await expect(page.locator('li').filter({ hasText: createdName })).toBeVisible({ timeout: 20000 });

      const row = page.locator('li').filter({ hasText: createdName });
      await row.getByRole('button', { name: 'Editar categoría' }).click();
      await page.getByPlaceholder('Nombre de categoría').fill(editedName);
      await page.getByRole('button', { name: 'Actualizar categoría' }).click();
      await expect(page.locator('li').filter({ hasText: editedName })).toBeVisible({ timeout: 20000 });

      const categoriesResponse = await request.get(`${API}/api/v1/admin/categorias`, { headers: { Authorization: `Bearer ${token}` } });
      const categories = await categoriesResponse.json() as Array<{ id: number; codigo: string; nombre: string }>;
      const categoria = categories.find((item) => item.codigo === code);
      const educacion = categories.find((item) => item.codigo === 'educacion');
      expect(categoria).toBeDefined();
      expect(educacion).toBeDefined();
      categoriaId = categoria?.id;
      expect(categoriaId).toBeDefined();

      const placeResponse = await request.post(`${API}/api/v1/admin/lugares`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { categoriaId: categoriaId!, nombre: `E2E-CAT-${Date.now()}`, lat: 4.641833, lon: -74.171758, publicado: true }
      });
      const created = await placeResponse.json() as { id: number };
      placeId = created.id;

      const categoryRow = page.locator('li').filter({ hasText: editedName });
      await categoryRow.getByRole('button', { name: 'Eliminar categoría' }).click();
      await expect(page.getByText('La categoría tiene lugares asociados')).toBeVisible({ timeout: 20000 });
      await page.getByLabel('Categoría destino').selectOption({ label: educacion?.nombre });
      await page.getByRole('button', { name: 'Reasignar y eliminar' }).click();

      const lugaresResponse = await request.get(`${API}/api/v1/admin/lugares`, { headers: { Authorization: `Bearer ${token}` } });
      const lugares = await lugaresResponse.json() as Array<{ id: number; categoriaId: number }>;
      const moved = lugares.find((item) => item.id === placeId);
      expect(moved?.categoriaId).toBe(educacion?.id);

      const auditResponse = await request.get(`${API}/api/v1/admin/auditoria`, { headers: { Authorization: `Bearer ${token}` } });
      const audit = await auditResponse.json() as Array<{ accion: string; entidad: string; entidadId: number }>;
      expect(audit.some((item) => item.accion === 'eliminar' && item.entidad === 'categoria' && item.entidadId === categoriaId)).toBe(true);
    } finally {
      if (placeId) await request.delete(`${API}/api/v1/admin/lugares/${placeId}`, { headers: { Authorization: `Bearer ${token}` } });
    }
  });
});

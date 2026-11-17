import { expect, test } from '@playwright/test';
import { ADMIN, API, loginApi } from './helpers.js';

test.describe('HU-13 · Administración: alta, edición y auditoría', () => {
  test('CA-HU13-02 y CA-HU13-04 persisten, publican, despublican y auditan', async ({ page, request }) => {
    const token = await loginApi(request);
    const name = `E2E-HU13-${Date.now()}`;
    const edited = `${name}-EDITADO`;
    let id: number | undefined;

    try {
      await page.goto('/#admin');
      await page.getByPlaceholder('Usuario').fill(ADMIN.username);
      await page.getByPlaceholder('Contraseña').fill(ADMIN.password);
      await page.getByRole('button', { name: 'Ingresar' }).click();
      await expect(page.getByRole('heading', { name: 'Panel administrativo' })).toBeVisible({ timeout: 20000 });

      await page.getByPlaceholder('Nombre', { exact: true }).fill(name);
      await page.getByRole('button', { name: 'Crear', exact: true }).click();
      await expect(page.getByRole('listitem').filter({ hasText: name })).toBeVisible({ timeout: 20000 });

      const publicList = await request.get(`${API}/api/v1/lugares?q=${encodeURIComponent(name)}`);
      const created = await publicList.json() as Array<{ id: number; publicado: boolean }>;
      expect(created).toHaveLength(1);
      expect(created[0]?.publicado).toBe(true);
      id = created[0]?.id;

      const audit = await request.get(`${API}/api/v1/admin/auditoria`, { headers: { Authorization: `Bearer ${token}` } });
      const entries = await audit.json() as Array<{ usuario: string; accion: string; entidadId: number }>;
      expect(entries.some((entry) => entry.usuario === ADMIN.username && entry.accion === 'crear' && entry.entidadId === id)).toBe(true);

      const row = page.getByRole('listitem').filter({ hasText: name }).first();
      await row.getByRole('button', { name: 'Editar' }).click();
      await page.getByPlaceholder('Nombre', { exact: true }).fill(edited);
      await page.getByRole('button', { name: 'Actualizar', exact: true }).click();
      await expect(page.getByRole('listitem').filter({ hasText: edited })).toBeVisible({ timeout: 20000 });

      await page.getByRole('button', { name: 'Actualizar auditoría' }).click();
      await expect(page.getByText(/admin · crear/).first()).toBeVisible({ timeout: 20000 });
      await expect(page.getByText(/admin · editar/).first()).toBeVisible();
      const editAudit = await request.get(`${API}/api/v1/admin/auditoria`, { headers: { Authorization: `Bearer ${token}` } });
      const editEntries = await editAudit.json() as Array<{
        accion: string; entidadId: number; fecha: string;
        antes: { nombre: string } | null; despues: { nombre: string } | null;
      }>;
      const edit = editEntries.find((entry) => entry.accion === 'editar' && entry.entidadId === id);
      expect(edit?.antes?.nombre).toBe(name);
      expect(edit?.despues?.nombre).toBe(edited);
      expect(edit?.fecha).toBeTruthy();

      const editedRow = page.getByRole('listitem').filter({ hasText: edited }).first();
      await editedRow.getByRole('button', { name: 'Despublicar' }).click();
      await expect(page.getByRole('listitem').filter({ hasText: edited }).getByRole('button', { name: 'Publicar' })).toBeVisible({ timeout: 20000 });
      const hidden = await request.get(`${API}/api/v1/lugares?q=${encodeURIComponent(edited)}`);
      expect(await hidden.json()).toHaveLength(0);
    } finally {
      if (id) await request.delete(`${API}/api/v1/admin/lugares/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    }
  });
});

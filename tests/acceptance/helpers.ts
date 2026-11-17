import { expect, type Page } from '@playwright/test';

export const API = 'http://127.0.0.1:3000';
// La suite administrativa requiere E2E_ADMIN_USERNAME y E2E_ADMIN_PASSWORD.
export const ADMIN = {
  username: process.env.E2E_ADMIN_USERNAME ?? 'CHANGE_ME',
  password: process.env.E2E_ADMIN_PASSWORD ?? 'CHANGE_ME'
};

export async function openHome(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Ciudad Granada' })).toBeVisible({ timeout: 20000 });
}

export function places(page: Page) {
  return page.locator('section[aria-labelledby="lugares-title"]');
}

export function vias(page: Page) {
  return page.locator('section[aria-labelledby="vias-title"]');
}

export function stats(page: Page) {
  return page.locator('section[aria-labelledby="stats-title"]');
}

export async function filter(page: Page, name: string): Promise<void> {
  await page.getByRole('button', { name, exact: true }).click();
}

export async function expectPlaces(page: Page): Promise<void> {
  await expect(places(page).locator('li').first()).toBeVisible({ timeout: 20000 });
}

export async function loginApi(request: import('@playwright/test').APIRequestContext): Promise<string> {
  const response = await request.post(`${API}/api/v1/auth/login`, { data: ADMIN });
  expect(response.status()).toBe(200);
  const body = await response.json() as { accessToken: string };
  return body.accessToken;
}

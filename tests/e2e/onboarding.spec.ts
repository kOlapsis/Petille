import { expect, test } from '@playwright/test';
import { injectAxe, runAxe } from './helpers';

test.beforeEach(async ({ context }) => {
  // Isoler chaque test : on part d'un stockage vide.
  await context.clearCookies();
  await context.addInitScript(() => {
    try {
      indexedDB.deleteDatabase('petille');
      indexedDB.deleteDatabase('keyval-store');
    } catch {
      /* noop */
    }
    try {
      localStorage.clear();
    } catch {
      /* noop — pages "about:blank" n'ont pas accès à localStorage */
    }
  });
});

test('page d\'accueil — SEO + claim "aucun métier"', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Pétille/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('fait briller');
  await expect(page.locator('body')).toContainText("Aucun métier n'est jamais suggéré");
  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(jsonLd).toBeTruthy();
  expect(jsonLd!).toContain('SoftwareApplication');

  await injectAxe(page);
  const violations = await runAxe(page);
  expect(violations, `Violations AA:\n${JSON.stringify(violations, null, 2)}`).toEqual([]);
});

test('FAQ — présente les questions clés et JSON-LD FAQPage', async ({ page }) => {
  await page.goto('/faq');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questions fréquentes');
  await expect(page.locator('body')).toContainText(/test d.orientation/i);
  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(jsonLd!).toContain('FAQPage');
});

test('onboarding — création carnet → ajout enfant → dashboard', async ({ page }) => {
  await page.goto('/app');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/carnet/i);

  await page.getByRole('button', { name: /Créer un nouveau carnet/i }).click();
  await page.waitForURL(/\/app\/enfant\/nouveau/, { timeout: 10_000 });

  await page.getByLabel(/prénom/i).fill('Éléa');
  const year = new Date().getFullYear() - 8;
  await page.getByLabel(/naissance/i).selectOption(String(year));
  await page.getByRole('button', { name: /ajouter/i }).click();

  await page.waitForURL(/\/app\/tableau/, { timeout: 10_000 });
  await expect(page.locator('body')).toContainText('Éléa');
});

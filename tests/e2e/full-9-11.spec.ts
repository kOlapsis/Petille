import { expect, test } from '@playwright/test';
import { injectAxe, runAxe, runThroughQuestionnaire } from './helpers';

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
  await context.addInitScript(() => {
    try {
      indexedDB.deleteDatabase('petille');
    } catch {
      /* noop */
    }
    try {
      localStorage.clear();
    } catch {
      /* noop */
    }
  });
});

test('questionnaire 9-11 — parcours complet → synthèse affichée, AA propre', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/app');
  await page.getByRole('button', { name: /Créer un nouveau carnet/i }).click();
  await page.waitForURL(/\/app\/enfant\/nouveau/);

  await page.getByLabel(/prénom/i).fill('Mila');
  const year = new Date().getFullYear() - 10; // 10 ans → 9-11-v1
  await page.getByLabel(/naissance/i).selectOption(String(year));
  await page.getByRole('button', { name: /ajouter/i }).click();

  await page.waitForURL(/\/app\/tableau/);
  await page.getByRole('button', { name: /Commencer un nouveau passage/i }).click();
  await page.waitForURL(/\/app\/enfant\/.+\/session/);

  await expect(page.locator('body')).toContainText('9-11-v1');

  // Donne un score de 3 au premier item de rating (radio caché + label visuel).
  const ratings = page.locator('input[type="radio"][value="3"]');
  if (await ratings.count()) await ratings.first().check({ force: true });

  await runThroughQuestionnaire(page, { maxClicks: 25 });

  await page.waitForURL(/\/synthese$/, { timeout: 10_000 });
  // Attend la fin de la transition Vue (fade 180ms) avant l'audit axe.
  await expect(page.locator('body')).toContainText(/pétiller Mila/i, { timeout: 10_000 });
  await page.waitForTimeout(300);

  await expect(page.locator('body')).toContainText(/pas de métier/i);
  const text = (await page.locator('main, section').first().textContent()) ?? '';
  for (const job of ['pompier', 'médecin', 'vétérinaire', 'ingénieur', 'boulanger']) {
    expect(text.toLowerCase()).not.toContain(job);
  }

  await injectAxe(page);
  const violations = await runAxe(page);
  expect(violations, `Violations AA sur synthèse:\n${JSON.stringify(violations, null, 2)}`).toEqual(
    []
  );
});

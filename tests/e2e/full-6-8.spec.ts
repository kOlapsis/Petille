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

test('questionnaire 6-8 — parcours complet → synthèse sans un seul "métier"', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/app');
  await page.getByRole('button', { name: /Créer un nouveau carnet/i }).click();
  await page.waitForURL(/\/app\/enfant\/nouveau/);

  await page.getByLabel(/prénom/i).fill('Noé');
  const year = new Date().getFullYear() - 7; // 7 ans → 6-8-v1
  await page.getByLabel(/naissance/i).selectOption(String(year));
  await page.getByRole('button', { name: /ajouter/i }).click();

  await page.waitForURL(/\/app\/tableau/);
  await page.getByRole('button', { name: /Commencer un nouveau passage/i }).click();
  await page.waitForURL(/\/app\/enfant\/.+\/session/);

  await expect(page.locator('body')).toContainText('6-8-v1');

  // Sur la première paire on choisit une option pour exercer le ThemePair,
  // puis on laisse le reste passer via "Suivant".
  const firstOption = page.locator('button[aria-pressed]').first();
  if (await firstOption.count()) await firstOption.click();

  await runThroughQuestionnaire(page, { maxClicks: 40 });

  await page.waitForURL(/\/synthese$/, { timeout: 10_000 });
  // Attend la fin de la transition Vue (fade 180ms) avant l'audit axe.
  await expect(page.locator('body')).toContainText(/pétiller Noé/i, { timeout: 10_000 });
  await page.waitForTimeout(300);

  // Garde-fou absolu spec §3 : la synthèse affiche explicitement la règle
  // « pas de métier, pas de conclusion », et ne suggère aucun métier précis.
  await expect(page.locator('body')).toContainText(/pas de métier/i);
  const text = (await page.locator('main, section').first().textContent()) ?? '';
  for (const job of ['pompier', 'médecin', 'docteur', 'vétérinaire', 'ingénieur', 'boulanger']) {
    expect(text.toLowerCase()).not.toContain(job);
  }

  await injectAxe(page);
  const violations = await runAxe(page);
  expect(violations, `Violations AA sur synthèse:\n${JSON.stringify(violations, null, 2)}`).toEqual(
    []
  );
});

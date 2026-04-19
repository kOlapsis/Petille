import { expect, test } from '@playwright/test';
import { runThroughQuestionnaire } from './helpers';

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

test('export → import — un carnet clair fait un aller-retour sans perte', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/app');
  await page.getByRole('button', { name: /Créer un nouveau carnet/i }).click();
  await page.waitForURL(/\/app\/enfant\/nouveau/);

  await page.getByLabel(/prénom/i).fill('Lou');
  const year = new Date().getFullYear() - 7;
  await page.getByLabel(/naissance/i).selectOption(String(year));
  await page.getByRole('button', { name: /ajouter/i }).click();
  await page.waitForURL(/\/app\/tableau/);

  // Une session rapide pour avoir du contenu à sauvegarder.
  await page.getByRole('button', { name: /Commencer un nouveau passage/i }).click();
  await page.waitForURL(/\/app\/enfant\/.+\/session/);
  await runThroughQuestionnaire(page, { maxClicks: 30 });
  await page.waitForURL(/\/synthese$/, { timeout: 10_000 });

  // Navigation SPA pour conserver l'état Pinia (page.goto ré-initialiserait tout).
  await page.getByRole('link', { name: /Sauvegarder le carnet/i }).click();
  await page.waitForURL(/\/app\/export/, { timeout: 10_000 });
  // Attend la fin de la transition fade et la disponibilité du bouton.
  await expect(page.getByRole('button', { name: /Télécharger le carnet/i })).toBeEnabled({
    timeout: 10_000,
  });

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Télécharger le carnet/i }).click(),
  ]);
  const tmpPath = await download.path();
  expect(tmpPath).toBeTruthy();

  const fs = await import('node:fs/promises');
  const raw = await fs.readFile(tmpPath!, 'utf8');
  const parsed = JSON.parse(raw) as {
    schema_version: number;
    children: { first_name: string; sessions: unknown[] }[];
  };
  expect(parsed.schema_version).toBe(1);
  expect(parsed.children).toHaveLength(1);
  expect(parsed.children[0]!.first_name).toBe('Lou');
  expect(parsed.children[0]!.sessions.length).toBeGreaterThanOrEqual(1);

  // Réimport depuis un nouveau contexte (on vide l'IDB via le client).
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const req = indexedDB.deleteDatabase('petille');
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
        req.onblocked = () => resolve();
      })
  );
  await page.goto('/app');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ton carnet famille');

  const chooser = page.getByRole('button', { name: /Choisir un fichier/i });
  const fileInput = page.locator('input[type="file"]');
  await chooser.click().catch(() => undefined);
  await fileInput.setInputFiles(tmpPath!);

  await page.waitForURL(/\/app\/tableau/, { timeout: 10_000 });
  await expect(page.locator('body')).toContainText('Lou');
});

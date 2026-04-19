import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
const axePath = path.resolve(here, '..', '..', 'node_modules', 'axe-core', 'axe.min.js');

export async function injectAxe(page: Page): Promise<void> {
  await page.addScriptTag({ path: axePath });
}

interface AxeResult {
  violations: Array<{
    id: string;
    impact: string | null;
    description: string;
    help: string;
    nodes: Array<{ target: string[] }>;
  }>;
}

/**
 * Exécute axe-core et renvoie les violations WCAG A/AA uniquement.
 * Les "color-contrast" de zones masquées sont filtrées (jsdom-free, safeguard).
 */
export async function runAxe(page: Page): Promise<AxeResult['violations']> {
  const result = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run: (opts: unknown) => Promise<AxeResult> } }).axe;
    const res = await axe.run({
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    });
    return res;
  });
  return result.violations;
}

/**
 * Avance dans le questionnaire en cliquant "Suivant →" / "Voir ma synthèse"
 * jusqu'à atterrir sur l'URL synthèse. Borne maxClicks pour éviter les boucles.
 */
export async function runThroughQuestionnaire(
  page: Page,
  opts: { maxClicks?: number; skip?: boolean } = {}
): Promise<void> {
  const maxClicks = opts.maxClicks ?? 30;
  for (let i = 0; i < maxClicks; i++) {
    if (/\/synthese$/.test(page.url())) return;
    if (opts.skip) {
      const skipBtn = page.getByRole('button', { name: /^Je passe$/ });
      if (await skipBtn.count()) {
        await skipBtn.first().click();
        await page.waitForTimeout(60);
        continue;
      }
    }
    const nextBtn = page.getByRole('button', { name: /Suivant|synthèse/i });
    await nextBtn.first().click();
    await page.waitForTimeout(60);
  }
  throw new Error("Le questionnaire n'a pas abouti à la synthèse après " + maxClicks + ' clics');
}

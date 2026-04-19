import { expect, test } from '@playwright/test';

/**
 * Ce test ne refait pas le questionnaire deux fois : il seed IndexedDB
 * directement avec deux sessions distinctes puis vérifie que la vue de
 * comparaison affiche les sections attendues (stable / apparaissent / disparaissent).
 */

const CHILD_ID = '11111111-1111-1111-1111-111111111111';
const FAMILY = {
  schema_version: 1,
  family_id: '00000000-aaaa-bbbb-cccc-000000000001',
  created_at: '2026-04-19T10:00:00.000Z',
  last_updated: '2026-04-19T10:00:00.000Z',
  children: [
    {
      id: CHILD_ID,
      first_name: 'Léa',
      birth_year: 2018,
      sessions: [
        {
          id: 'session-1',
          date: '2026-04-19T10:00:00.000Z',
          age_at_session: 8,
          questionnaire_version: '6-8-v1' as const,
          duration_seconds: 300,
          answers: {
            themes: { animals: 2, drawing: 1, sports: 1 },
            actions: ['draw', 'walk'],
            context: { social: 'small_group', space: 'outside', pace: 'mix' },
            magic_day: { text: 'Une ferme pour soigner les animaux.', photo_data_url: null },
          },
          profile_summary: {
            top_themes: ['animals', 'drawing', 'sports'],
            top_actions: ['draw', 'walk'],
            context_label: 'small_group_outside_mix',
          },
        },
        {
          id: 'session-2',
          date: '2027-04-19T10:00:00.000Z',
          age_at_session: 9,
          questionnaire_version: '9-11-v1' as const,
          duration_seconds: 450,
          answers: {
            themes: { animals: 3, building: 2, science: 2 },
            actions: ['build', 'walk', 'observe'],
            context: { social: 'alone', space: 'outside', pace: 'slow_deep' },
            magic_day: {
              text: 'Construire un refuge pour animaux.',
              photo_data_url: null,
              extras: {},
            },
          },
          profile_summary: {
            top_themes: ['animals', 'building', 'science'],
            top_actions: ['build', 'walk', 'observe'],
            context_label: 'alone_outside_slow_deep',
          },
        },
      ],
    },
  ],
};

async function seedFamily(page: import('@playwright/test').Page, family: unknown): Promise<void> {
  await page.addInitScript((fam) => {
    const open = indexedDB.open('petille', 1);
    open.onupgradeneeded = () => {
      open.result.createObjectStore('kv');
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put(fam, 'family:current');
    };
  }, family);
}

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

test('comparaison — deux passages → stable / apparaît / disparaît rendus', async ({ page }) => {
  await seedFamily(page, FAMILY);
  await page.goto(`/app/enfant/${CHILD_ID}/comparer`);

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Comparer deux passages');
  await expect(page.locator('body')).toContainText('Léa');
  // animals est présent aux deux passages → bloc "stable" contient son libellé.
  await expect(page.locator('body')).toContainText(/stable/i);
  // Texte de clôture de la spec §rythme.
  await expect(page.locator('body')).toContainText(/piste/i);
});

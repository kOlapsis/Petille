#!/usr/bin/env node
/**
 * Génère public/flyers/petille-flyer-parents.pdf à partir de la route /flyer.
 *
 * Pipeline :
 *  1. Build SPA (vite build) si dist/ absent ou stale
 *  2. Démarre vite preview en arrière-plan
 *  3. Chromium headless → /flyer → attend window.__flyerReady
 *  4. page.pdf() au format A5, deux pages (recto + verso)
 *  5. Ferme tout proprement
 */
import { spawn } from 'node:child_process';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const OUTPUT_DIR = resolve(ROOT, 'public/flyers');
const OUTPUT_PDF = join(OUTPUT_DIR, 'petille-flyer-parents.pdf');
const PORT = 4178;
const BASE = `http://127.0.0.1:${PORT}`;

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function runNpmScript(script, args = []) {
  return new Promise((resolveFn, rejectFn) => {
    const child = spawn('pnpm', [script, ...args], {
      cwd: ROOT,
      stdio: 'inherit',
      env: process.env,
    });
    child.on('exit', (code) =>
      code === 0 ? resolveFn() : rejectFn(new Error(`${script} exited with ${code}`))
    );
    child.on('error', rejectFn);
  });
}

function startPreview() {
  const child = spawn(
    'pnpm',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], env: process.env }
  );
  child.stdout.on('data', (d) => process.stdout.write(`[preview] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`[preview] ${d}`));
  return child;
}

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not yet */
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  // 1) Build SPA si nécessaire (on force un rebuild pour garantir la cohérence)
  console.log('→ vite build (SPA)');
  await runNpmScript('build:spa');

  if (!(await exists(join(ROOT, 'dist/index.html')))) {
    throw new Error('dist/index.html introuvable après build');
  }

  // 2) Start preview
  console.log(`→ démarrage preview ${BASE}`);
  const preview = startPreview();
  try {
    await waitForServer(BASE);

    // 3) Capture PDF
    console.log('→ chromium → /flyer');
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 800, height: 1200 },
      locale: 'fr-FR',
    });
    const page = await context.newPage();
    await page.goto(`${BASE}/flyer`, { waitUntil: 'networkidle' });

    // Attendre que les polices et le QR code soient prêts
    await page.waitForFunction(() => window.__flyerReady === true, undefined, { timeout: 10_000 });
    await page.emulateMedia({ media: 'print' });

    const pdf = await page.pdf({
      format: 'A5',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await writeFile(OUTPUT_PDF, pdf);

    await browser.close();
    const { size } = await stat(OUTPUT_PDF);
    console.log(`✓ PDF écrit : ${OUTPUT_PDF} (${(size / 1024).toFixed(1)} KB)`);
    if (size > 500 * 1024) {
      console.warn(`⚠ Taille > 500 KB (budget indicatif).`);
    }
  } finally {
    preview.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

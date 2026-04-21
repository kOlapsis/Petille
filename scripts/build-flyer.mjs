#!/usr/bin/env node
/**
 * Génère les flyers PDF dans public/flyers/ :
 *   - petille-flyer-parents.pdf       (A5 recto-verso, distribution libre)
 *   - petille-flyer-parents-court.pdf (A6 recto, cahier de liaison)
 *
 * Pipeline : vite build (SPA) → vite preview → chromium headless → page.pdf().
 */
import { spawn } from 'node:child_process';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const OUTPUT_DIR = resolve(ROOT, 'public/flyers');
const PORT = 4178;
const BASE = `http://127.0.0.1:${PORT}`;

const FLYERS = [
  { route: '/flyer', format: 'A5', output: 'petille-flyer-parents.pdf' },
  { route: '/flyer/court', format: 'A6', output: 'petille-flyer-parents-court.pdf' },
];

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

async function renderFlyer(browser, { route, format, output }) {
  const context = await browser.newContext({
    viewport: { width: 800, height: 1200 },
    locale: 'fr-FR',
  });
  const page = await context.newPage();
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__flyerReady === true, undefined, { timeout: 10_000 });
  await page.emulateMedia({ media: 'print' });

  const pdf = await page.pdf({
    format,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  const outPath = join(OUTPUT_DIR, output);
  await writeFile(outPath, pdf);
  await context.close();

  const { size } = await stat(outPath);
  console.log(`✓ ${outPath} (${(size / 1024).toFixed(1)} KB, ${format})`);
  if (size > 500 * 1024) {
    console.warn(`⚠ ${output} > 500 KB (budget indicatif).`);
  }
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log('→ vite build (SPA)');
  await runNpmScript('build:spa');

  if (!(await exists(join(ROOT, 'dist/index.html')))) {
    throw new Error('dist/index.html introuvable après build');
  }

  console.log(`→ démarrage preview ${BASE}`);
  const preview = startPreview();
  try {
    await waitForServer(BASE);

    const browser = await chromium.launch();
    try {
      for (const flyer of FLYERS) {
        console.log(`→ chromium → ${flyer.route} (${flyer.format})`);
        await renderFlyer(browser, flyer);
      }
    } finally {
      await browser.close();
    }
  } finally {
    preview.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

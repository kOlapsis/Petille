#!/usr/bin/env node
/**
 * Vérifie que le bundle JS+CSS initial reste sous le budget gzip défini.
 * Critère spec : < 500 KB gzipped pour la première vue.
 *
 * On mesure :
 *  - le fichier index.html
 *  - tous les bundles référencés dans index.html (modulepreload + script + stylesheets)
 *  - on ignore les routes dynamiques chargées plus tard
 */
import { readFile, stat, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = Number(process.env.PETILLE_BUNDLE_BUDGET_KB ?? 500);
const DIST = resolve('dist');

async function fileGzipKb(path) {
  const buf = await readFile(path);
  return gzipSync(buf).byteLength / 1024;
}

async function listAssets() {
  const html = await readFile(join(DIST, 'index.html'), 'utf8');
  const matches = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  const assets = new Set(['/index.html']);
  for (const ref of matches) {
    if (!ref || !ref.startsWith('/assets/')) continue;
    if (!ref.endsWith('.js') && !ref.endsWith('.css')) continue;
    assets.add(ref);
  }
  // Inclure le service worker (chargé dès la 1ère visite via registerSW)
  try {
    const all = await readdir(join(DIST));
    for (const f of all) {
      if (f === 'sw.js' || f === 'registerSW.js') assets.add(`/${f}`);
    }
  } catch {
    /* ignore */
  }
  return [...assets];
}

async function main() {
  await stat(DIST).catch(() => {
    console.error('dist/ introuvable. Lance `pnpm build` d\'abord.');
    process.exit(1);
  });
  const assets = await listAssets();
  let total = 0;
  const rows = [];
  for (const rel of assets) {
    const p = join(DIST, rel);
    try {
      const kb = await fileGzipKb(p);
      total += kb;
      rows.push([rel, kb]);
    } catch {
      /* fichier absent (ex. registerSW est inline) — ignoré */
    }
  }
  rows.sort((a, b) => b[1] - a[1]);
  console.log('Bundle initial (gzip) :');
  for (const [name, kb] of rows) {
    console.log(`  ${kb.toFixed(1).padStart(7)} KB  ${name}`);
  }
  console.log(`  ----------------`);
  console.log(`  ${total.toFixed(1).padStart(7)} KB  total (budget ${BUDGET_KB} KB)`);
  if (total > BUDGET_KB) {
    console.error(`\n✗ Budget dépassé de ${(total - BUDGET_KB).toFixed(1)} KB.`);
    process.exit(1);
  }
  console.log('\n✓ Sous le budget.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

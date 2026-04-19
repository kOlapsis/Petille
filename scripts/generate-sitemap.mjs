#!/usr/bin/env node
/**
 * Génère dist/sitemap.xml après le build SSG.
 * Base URL paramétrable via PETILLE_SITE_URL (défaut: https://petille.app).
 */
import { readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const SITE = process.env.PETILLE_SITE_URL ?? 'https://petille.app';
const DIST = resolve('dist');

async function walk(dir, base = '') {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      if (['assets', 'icons'].includes(entry.name)) continue;
      out.push(...(await walk(join(dir, entry.name), `${base}/${entry.name}`)));
    } else if (entry.name.endsWith('.html')) {
      const name = entry.name.replace(/\.html$/, '');
      if (name === 'index') {
        out.push(base || '/');
      } else {
        out.push(`${base}/${name}`);
      }
    }
  }
  return out;
}

const urls = [...new Set(await walk(DIST))].sort();
const now = new Date().toISOString().slice(0, 10);

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map(
      (u) =>
        `  <url><loc>${SITE}${u === '/' ? '' : u}/</loc><lastmod>${now}</lastmod></url>`
    )
    .join('\n') +
  '\n</urlset>\n';

await writeFile(join(DIST, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml écrit (${urls.length} URLs) — base ${SITE}`);

/**
 * Sérialisation d'un carnet famille en JSON.
 * Le chiffrement par passphrase arrive en P4 (crypto.ts).
 */
import type { Family } from '../schema';

export interface ExportOptions {
  /** Si fourni, le JSON sera chiffré (impl. P4). */
  passphrase?: string;
  /** Pretty-print (true par défaut pour lisibilité humaine). */
  pretty?: boolean;
}

export interface ExportResult {
  filename: string;
  mime: string;
  /** Contenu sérialisé prêt à être téléchargé. */
  payload: string;
}

export function buildFilename(family: Family, encrypted = false): string {
  const date = family.last_updated.slice(0, 10);
  const suffix = encrypted ? '.enc.json' : '.json';
  return `petille-${family.family_id.slice(0, 8)}-${date}${suffix}`;
}

export function serializeFamily(family: Family, pretty = true): string {
  return pretty ? JSON.stringify(family, null, 2) : JSON.stringify(family);
}

export async function exportFamily(
  family: Family,
  options: ExportOptions = {}
): Promise<ExportResult> {
  const json = serializeFamily(family, options.pretty ?? true);
  if (options.passphrase) {
    const { encryptJson } = await import('../crypto');
    const payload = await encryptJson(json, options.passphrase);
    return {
      filename: buildFilename(family, true),
      mime: 'application/json',
      payload,
    };
  }
  return {
    filename: buildFilename(family, false),
    mime: 'application/json',
    payload: json,
  };
}

/** Déclenche le téléchargement côté navigateur. */
export function downloadAsFile(result: ExportResult): void {
  const blob = new Blob([result.payload], { type: result.mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

import { describe, it, expect, beforeAll } from 'vitest';
import {
  InvalidFamilyJsonError,
  PassphraseRequiredError,
  importFamily,
} from '@/lib/exporters/importJson';
import { exportFamily } from '@/lib/exporters/exportJson';
import { SCHEMA_VERSION, type Family } from '@/lib/schema';

beforeAll(() => {
  if (!globalThis.crypto?.subtle) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require('node:crypto');
    Object.defineProperty(globalThis, 'crypto', { value: nodeCrypto.webcrypto });
  }
});

function sampleFamily(): Family {
  return {
    schema_version: SCHEMA_VERSION,
    family_id: '00000000-0000-0000-0000-000000000000',
    created_at: '2026-04-19T10:00:00.000Z',
    last_updated: '2026-04-19T10:00:00.000Z',
    children: [],
  };
}

describe('importFamily', () => {
  it('rejects malformed JSON', async () => {
    await expect(importFamily('{ not json')).rejects.toBeInstanceOf(InvalidFamilyJsonError);
  });

  it('rejects a JSON that does not look like a family', async () => {
    await expect(importFamily(JSON.stringify({ hello: 'world' }))).rejects.toBeInstanceOf(
      InvalidFamilyJsonError
    );
  });

  it('rejects an unknown schema_version', async () => {
    const fam = { ...sampleFamily(), schema_version: 99 } as unknown as Family;
    await expect(importFamily(JSON.stringify(fam))).rejects.toThrow(/schéma non supportée/);
  });

  it('round-trips a clear-text export', async () => {
    const result = await exportFamily(sampleFamily());
    const reimported = await importFamily(result.payload);
    expect(reimported.family_id).toBe(sampleFamily().family_id);
  });

  it('requires a passphrase for encrypted files', async () => {
    const enc = await exportFamily(sampleFamily(), { passphrase: 'secret-lourd' });
    await expect(importFamily(enc.payload)).rejects.toBeInstanceOf(PassphraseRequiredError);
  });

  it('round-trips an encrypted export with the right passphrase', async () => {
    const enc = await exportFamily(sampleFamily(), { passphrase: 'secret-lourd' });
    const round = await importFamily(enc.payload, { passphrase: 'secret-lourd' });
    expect(round.family_id).toBe(sampleFamily().family_id);
  });
});

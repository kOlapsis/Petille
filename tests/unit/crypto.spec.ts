import { describe, it, expect, beforeAll } from 'vitest';
import { decryptJson, encryptJson } from '@/lib/crypto';

beforeAll(() => {
  // jsdom 25 ne fournit pas Web Crypto ; on utilise celui de Node.
  if (!globalThis.crypto?.subtle) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require('node:crypto');
    Object.defineProperty(globalThis, 'crypto', { value: nodeCrypto.webcrypto });
  }
});

describe('encryptJson / decryptJson', () => {
  it('round-trips a JSON string with the correct passphrase', async () => {
    const plain = JSON.stringify({ hello: 'monde', n: 42, nested: { ok: true } });
    const enc = await encryptJson(plain, 'motdepasse-tres-long');
    const envelope = JSON.parse(enc);
    expect(envelope.alg).toBe('AES-GCM-256/PBKDF2-SHA256');
    expect(envelope.salt).toBeTruthy();
    expect(envelope.iv).toBeTruthy();
    expect(envelope.ciphertext).toBeTruthy();

    const round = await decryptJson(enc, 'motdepasse-tres-long');
    expect(round).toBe(plain);
  });

  it('throws on wrong passphrase', async () => {
    const enc = await encryptJson('{"a":1}', 'bon-mdp');
    await expect(decryptJson(enc, 'mauvais-mdp')).rejects.toThrow(/Passphrase/);
  });

  it('rejects an unknown algorithm', async () => {
    const fake = JSON.stringify({
      v: 1,
      alg: 'ROT13',
      salt: 'AAAA',
      iv: 'AAAA',
      ciphertext: 'AAAA',
    });
    await expect(decryptJson(fake, 'whatever')).rejects.toThrow(/Algorithme inconnu/);
  });
});

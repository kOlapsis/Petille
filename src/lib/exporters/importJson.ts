/**
 * Importe un carnet JSON (clair ou chiffré) et garantit qu'il est valide.
 *
 * Pipeline : détection format → déchiffrement éventuel → parse →
 * validation schema_version → migrations → typeguard final.
 */
import { SCHEMA_VERSION, type Family } from '../schema';

export class InvalidFamilyJsonError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'InvalidFamilyJsonError';
  }
}

export class PassphraseRequiredError extends Error {
  constructor() {
    super('Ce fichier est chiffré, une passphrase est nécessaire.');
    this.name = 'PassphraseRequiredError';
  }
}

interface EncryptedEnvelope {
  v: number;
  alg: string;
  salt: string;
  iv: string;
  ciphertext: string;
}

function isEncrypted(parsed: unknown): parsed is EncryptedEnvelope {
  return (
    typeof parsed === 'object' &&
    parsed !== null &&
    'salt' in parsed &&
    'iv' in parsed &&
    'ciphertext' in parsed
  );
}

function isFamilyShape(value: unknown): value is Family {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.schema_version === 'number' &&
    typeof v.family_id === 'string' &&
    typeof v.created_at === 'string' &&
    typeof v.last_updated === 'string' &&
    Array.isArray(v.children)
  );
}

/** Migrations versionnées : à étoffer dès qu'un v2 apparaît. */
function migrate(family: Family): Family {
  const current = family;
  // Slot pour migrations futures :
  // if (current.schema_version === 1) { current = migrateV1toV2(current); }
  if (current.schema_version !== SCHEMA_VERSION) {
    throw new InvalidFamilyJsonError(
      `Version de schéma non supportée : ${current.schema_version}`
    );
  }
  return current;
}

export interface ImportOptions {
  /** Passphrase si le JSON est chiffré. */
  passphrase?: string;
}

export async function importFamily(raw: string, options: ImportOptions = {}): Promise<Family> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new InvalidFamilyJsonError('JSON malformé.', err);
  }

  if (isEncrypted(parsed)) {
    if (!options.passphrase) throw new PassphraseRequiredError();
    const { decryptJson } = await import('../crypto');
    const decrypted = await decryptJson(raw, options.passphrase);
    return importFamily(decrypted); // récursion sur le clair
  }

  if (!isFamilyShape(parsed)) {
    throw new InvalidFamilyJsonError(
      'Le fichier ne ressemble pas à un carnet Pétille (champs manquants).'
    );
  }

  return migrate(parsed);
}

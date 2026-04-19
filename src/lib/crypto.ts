/**
 * Chiffrement symétrique du JSON carnet via passphrase utilisateur.
 *
 * AES-256-GCM + PBKDF2-SHA256 (210 000 itérations, OWASP 2023).
 * Sortie sérialisée : { v, alg, salt, iv, ciphertext } base64.
 */

const PBKDF2_ITERATIONS = 210_000;
const KEY_LENGTH_BITS = 256;
const SALT_BYTES = 16;
const IV_BYTES = 12;

function b64encode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]!);
  return btoa(s);
}

function b64decode(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH_BITS },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptJson(plain: string, passphrase: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plain)
  );
  return JSON.stringify(
    {
      v: 1,
      alg: 'AES-GCM-256/PBKDF2-SHA256',
      salt: b64encode(salt),
      iv: b64encode(iv),
      ciphertext: b64encode(ciphertext),
    },
    null,
    2
  );
}

export async function decryptJson(envelope: string, passphrase: string): Promise<string> {
  const parsed = JSON.parse(envelope) as {
    v: number;
    alg: string;
    salt: string;
    iv: string;
    ciphertext: string;
  };
  if (parsed.alg !== 'AES-GCM-256/PBKDF2-SHA256') {
    throw new Error(`Algorithme inconnu : ${parsed.alg}`);
  }
  const salt = b64decode(parsed.salt);
  const iv = b64decode(parsed.iv);
  const key = await deriveKey(passphrase, salt);
  let plain: ArrayBuffer;
  try {
    plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      b64decode(parsed.ciphertext)
    );
  } catch (err) {
    throw new Error('Passphrase incorrecte ou fichier altéré.', { cause: err });
  }
  return new TextDecoder().decode(plain);
}

/**
 * Wrapper minimal autour d'idb-keyval pour ne dépendre du backend de stockage
 * qu'à un seul endroit. Toutes les clés Pétille passent ici.
 */
import { clear, createStore, del, get, set } from 'idb-keyval';
import type { Family } from './schema';

const store = createStore('petille', 'kv');

export const KEY_FAMILY = 'family:current';
export const KEY_SESSION_WIP = 'session:wip';

export async function loadFamily(): Promise<Family | null> {
  return (await get<Family>(KEY_FAMILY, store)) ?? null;
}

export async function saveFamily(family: Family): Promise<void> {
  // JSON round-trip to strip Vue/Pinia reactive Proxy wrappers that break IDB's structuredClone.
  await set(KEY_FAMILY, JSON.parse(JSON.stringify(family)) as Family, store);
}

export async function clearFamily(): Promise<void> {
  await del(KEY_FAMILY, store);
}

export async function getRaw<T>(key: string): Promise<T | undefined> {
  return get<T>(key, store);
}

export async function setRaw<T>(key: string, value: T): Promise<void> {
  await set(key, value, store);
}

export async function delRaw(key: string): Promise<void> {
  await del(key, store);
}

export async function clearAll(): Promise<void> {
  await clear(store);
}

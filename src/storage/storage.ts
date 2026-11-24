const PREFIX = 'budgetquest';
const VERSION = 1;

function namespaced(userId: string, name: string): string {
  return `${PREFIX}.${userId}.${name}.v${VERSION}`;
}

export function storageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!storageAvailable()) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!storageAvailable()) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota or serialization errors in the demo app.
  }
}

export function removeKey(key: string): void {
  if (!storageAvailable()) {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage errors in the demo app.
  }
}

export function hasKey(key: string): boolean {
  if (!storageAvailable()) {
    return false;
  }
  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export const keys = {
  session: `${PREFIX}.session.v${VERSION}`,
  settings: (userId: string) => namespaced(userId, 'settings'),
  checkins: (userId: string) => namespaced(userId, 'checkins'),
  rewards: (userId: string) => namespaced(userId, 'rewards'),
};

import { keys, readJSON, removeKey, writeJSON } from './storage';

interface Session {
  userId: string;
}

export function loadSessionUserId(): string | null {
  const session = readJSON<Session | null>(keys.session, null);
  return session?.userId ?? null;
}

export function saveSession(userId: string): void {
  writeJSON<Session>(keys.session, { userId });
}

export function clearSession(): void {
  removeKey(keys.session);
}

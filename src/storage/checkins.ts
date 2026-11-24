import type { Checkin } from '@/types';

import { keys, readJSON, removeKey, writeJSON } from './storage';

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `checkin-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadCheckins(userId: string): Checkin[] {
  const checkins = readJSON<Checkin[]>(keys.checkins(userId), []);
  return [...checkins].sort((a, b) =>
    a.periodStart < b.periodStart ? 1 : a.periodStart > b.periodStart ? -1 : 0,
  );
}

export function saveCheckins(userId: string, checkins: Checkin[]): void {
  writeJSON(keys.checkins(userId), checkins);
}

export function upsertCheckin(
  userId: string,
  input: Omit<Checkin, 'id' | 'createdAt'>,
): Checkin {
  const existing = loadCheckins(userId);
  const index = existing.findIndex(
    (checkin) =>
      checkin.periodStart === input.periodStart && checkin.periodType === input.periodType,
  );
  const saved: Checkin = {
    ...input,
    id: index >= 0 ? existing[index].id : makeId(),
    createdAt: new Date().toISOString(),
  };
  const next =
    index >= 0
      ? existing.map((checkin, current) => (current === index ? saved : checkin))
      : [saved, ...existing];
  saveCheckins(userId, next);
  return saved;
}

export function clearCheckins(userId: string): void {
  removeKey(keys.checkins(userId));
}

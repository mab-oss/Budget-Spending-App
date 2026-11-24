import type { UnlockedReward } from '@/types';

import { keys, readJSON, removeKey, writeJSON } from './storage';

export function loadUnlockedRewards(userId: string): UnlockedReward[] {
  return readJSON<UnlockedReward[]>(keys.rewards(userId), []);
}

export function saveUnlockedRewards(userId: string, rewards: UnlockedReward[]): void {
  writeJSON(keys.rewards(userId), rewards);
}

export function unlockRewards(userId: string, ids: string[]): UnlockedReward[] {
  const existing = loadUnlockedRewards(userId);
  const map = new Map(existing.map((reward) => [reward.id, reward]));
  const now = new Date().toISOString();
  for (const id of ids) {
    if (!map.has(id)) {
      map.set(id, { id, unlockedAt: now });
    }
  }
  const next = Array.from(map.values());
  saveUnlockedRewards(userId, next);
  return next;
}

export function clearUnlockedRewards(userId: string): void {
  removeKey(keys.rewards(userId));
}

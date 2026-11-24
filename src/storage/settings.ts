import type { Settings } from '@/types';

import { keys, readJSON, removeKey, writeJSON } from './storage';

export function loadSettings(userId: string): Settings | null {
  return readJSON<Settings | null>(keys.settings(userId), null);
}

export function saveSettings(userId: string, settings: Settings): void {
  writeJSON(keys.settings(userId), settings);
}

export function clearSettings(userId: string): void {
  removeKey(keys.settings(userId));
}

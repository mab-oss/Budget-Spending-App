import { getPeriodForDate, previousPeriod, toDateKey, type Period } from '@/lib/periods';
import { getEligibleRewardIds } from '@/lib/rewards';
import { computeStreakSummary } from '@/lib/streak';
import type { Checkin, DemoUser, Settings, UnlockedReward } from '@/types';

import { saveCheckins } from './checkins';
import { saveSettings } from './settings';
import { hasKey, keys } from './storage';
import { saveUnlockedRewards } from './rewards';

export interface SeedData {
  settings: Settings;
  checkins: Checkin[];
  rewards: UnlockedReward[];
}

export function buildSeed(user: DemoUser, now: Date): SeedData {
  const current = getPeriodForDate(now, user.periodType, 0);
  const statuses = user.seedStatuses ?? [];

  const completed: Period[] = [];
  let cursor = previousPeriod(current, user.periodType, 0);
  for (let index = 0; index < statuses.length; index += 1) {
    completed.push(cursor);
    cursor = previousPeriod(cursor, user.periodType, 0);
  }

  const checkins: Checkin[] = [];
  statuses.forEach((status, index) => {
    if (status === 'missed') {
      return;
    }
    const period = completed[index];
    const budget = user.budgetCents;
    const spent =
      status === 'win'
        ? Math.round(budget * (0.45 + (index % 5) * 0.08))
        : Math.round(budget * (1.1 + (index % 3) * 0.12));
    checkins.push({
      id: `${user.id}-seed-${index}`,
      periodStart: period.startKey,
      periodEnd: period.endKey,
      periodType: user.periodType,
      budgetCents: budget,
      spentCents: spent,
      status,
      createdAt: period.end.toISOString(),
    });
  });
  checkins.sort((a, b) =>
    a.periodStart < b.periodStart ? 1 : a.periodStart > b.periodStart ? -1 : 0,
  );

  const oldest = completed[completed.length - 1];
  const settings: Settings = {
    periodType: user.periodType,
    budgetCents: user.budgetCents,
    currency: 'USD',
    weekStartDay: 0,
    trackingStart: oldest?.startKey ?? toDateKey(now),
    onboardingComplete: true,
  };

  const summary = computeStreakSummary(checkins, user.periodType, 0, now, settings.trackingStart);
  const rewards = getEligibleRewardIds(summary.best, user.periodType).map((id) => ({
    id,
    unlockedAt: now.toISOString(),
  }));

  return { settings, checkins, rewards };
}

export function ensureDemoData(user: DemoUser): void {
  if (hasKey(keys.settings(user.id))) {
    return;
  }
  const seed = buildSeed(user, new Date());
  saveSettings(user.id, seed.settings);
  saveCheckins(user.id, seed.checkins);
  saveUnlockedRewards(user.id, seed.rewards);
}

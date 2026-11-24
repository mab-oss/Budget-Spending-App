import { REWARD_CATALOG, type RewardDefinition } from '@/constants/rewards';
import type { PeriodType } from '@/types';

export function thresholdFor(reward: RewardDefinition, periodType: PeriodType): number {
  return reward.threshold[periodType];
}

export function getEligibleRewardIds(bestStreak: number, periodType: PeriodType): string[] {
  return REWARD_CATALOG.filter((reward) => bestStreak >= thresholdFor(reward, periodType)).map(
    (reward) => reward.id,
  );
}

export function getNextReward(
  bestStreak: number,
  periodType: PeriodType,
): RewardDefinition | null {
  const locked = REWARD_CATALOG.filter(
    (reward) => bestStreak < thresholdFor(reward, periodType),
  ).sort((a, b) => thresholdFor(a, periodType) - thresholdFor(b, periodType));
  return locked[0] ?? null;
}

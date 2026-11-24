import { getEligibleRewardIds, getNextReward, thresholdFor } from '../rewards';
import { REWARD_CATALOG } from '@/constants/rewards';

describe('getEligibleRewardIds', () => {
  it('unlocks the first win reward at one win', () => {
    expect(getEligibleRewardIds(1, 'daily')).toEqual(['first-win']);
  });

  it('unlocks multiple rewards for a long daily streak', () => {
    expect(getEligibleRewardIds(7, 'daily')).toEqual([
      'first-win',
      'hot-streak',
      'week-warrior',
    ]);
  });

  it('uses weekly thresholds', () => {
    expect(getEligibleRewardIds(2, 'weekly')).toEqual(['first-win', 'hot-streak']);
  });

  it('returns nothing for a zero streak', () => {
    expect(getEligibleRewardIds(0, 'daily')).toEqual([]);
  });
});

describe('getNextReward', () => {
  it('returns the closest locked reward', () => {
    expect(getNextReward(0, 'daily')?.id).toBe('first-win');
    expect(getNextReward(7, 'daily')?.id).toBe('halfway-hero');
  });

  it('returns null when every reward is unlocked', () => {
    expect(getNextReward(30, 'daily')).toBeNull();
  });
});

describe('thresholdFor', () => {
  it('reads the period-specific threshold', () => {
    const monthMaster = REWARD_CATALOG.find((reward) => reward.id === 'month-master');
    expect(monthMaster).toBeDefined();
    expect(thresholdFor(monthMaster!, 'daily')).toBe(30);
    expect(thresholdFor(monthMaster!, 'weekly')).toBe(12);
  });
});

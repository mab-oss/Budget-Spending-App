import { DEMO_USERS } from '@/constants/demo-users';
import type { DemoUser } from '@/types';

import { buildSeed } from '../seed';

function localDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0);
}

function userById(id: string): DemoUser {
  const user = DEMO_USERS.find((candidate) => candidate.id === id);
  if (!user) {
    throw new Error(`Missing demo user ${id}`);
  }
  return user;
}

const NOW = localDate(2026, 1, 15);

describe('buildSeed', () => {
  it('builds onboarding-complete settings from the demo user', () => {
    const { settings } = buildSeed(userById('maya'), NOW);
    expect(settings).toMatchObject({
      periodType: 'daily',
      budgetCents: 4000,
      currency: 'USD',
      weekStartDay: 0,
      onboardingComplete: true,
    });
    expect(settings.trackingStart).toBe('2026-01-05');
  });

  it('skips missed periods but keeps wins and losses', () => {
    const { checkins } = buildSeed(userById('maya'), NOW);
    expect(checkins).toHaveLength(9);
    expect(checkins.some((checkin) => checkin.status === 'win')).toBe(true);
  });

  it('sorts check-ins newest first', () => {
    const { checkins } = buildSeed(userById('maya'), NOW);
    const keys = checkins.map((checkin) => checkin.periodStart);
    expect(keys).toEqual([...keys].sort().reverse());
    expect(keys[0]).toBe('2026-01-14');
  });

  it('seeds Maya with an 8 period streak', () => {
    const { checkins, settings, rewards } = buildSeed(userById('maya'), NOW);
    const statuses = checkins.map((checkin) => checkin.status);
    expect(statuses.filter((status) => status === 'win')).toHaveLength(9);
    expect(settings.trackingStart).toBe('2026-01-05');
    expect(rewards.map((reward) => reward.id)).toEqual([
      'first-win',
      'hot-streak',
      'week-warrior',
    ]);
  });

  it('seeds Leo with a weekly 3 period streak', () => {
    const { settings, rewards } = buildSeed(userById('leo'), NOW);
    expect(settings.trackingStart).toBe('2025-12-14');
    expect(rewards.map((reward) => reward.id)).toEqual([
      'first-win',
      'hot-streak',
      'week-warrior',
    ]);
  });

  it('seeds Sam with a broken streak but a best of 2', () => {
    const { checkins } = buildSeed(userById('sam'), NOW);
    expect(checkins).toHaveLength(5);
    expect(checkins[0].periodStart).toBe('2026-01-12');
  });

  it('marks win check-ins under budget and loss check-ins over budget', () => {
    const { checkins } = buildSeed(userById('leo'), NOW);
    for (const checkin of checkins) {
      if (checkin.status === 'win') {
        expect(checkin.spentCents).toBeLessThanOrEqual(checkin.budgetCents);
      } else {
        expect(checkin.spentCents).toBeGreaterThan(checkin.budgetCents);
      }
    }
  });
});

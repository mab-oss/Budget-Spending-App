import type { Checkin, CheckinStatus, PeriodType } from '@/types';

import { computeStreakSummary } from '../streak';

function localDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0);
}

function checkin(periodStart: string, status: CheckinStatus, type: PeriodType = 'daily'): Checkin {
  return {
    id: periodStart,
    periodStart,
    periodEnd: periodStart,
    periodType: type,
    budgetCents: 4000,
    spentCents: status === 'win' ? 3000 : 5000,
    status,
    createdAt: `${periodStart}T12:00:00.000Z`,
  };
}

const NOW = localDate(2026, 1, 15);

describe('computeStreakSummary', () => {
  it('counts consecutive wins including the current period', () => {
    const checkins = [
      checkin('2026-01-10', 'win'),
      checkin('2026-01-11', 'win'),
      checkin('2026-01-12', 'win'),
      checkin('2026-01-13', 'win'),
      checkin('2026-01-14', 'win'),
      checkin('2026-01-15', 'win'),
    ];
    expect(computeStreakSummary(checkins, 'daily', 0, NOW, '2026-01-10')).toEqual({
      current: 6,
      best: 6,
    });
  });

  it('breaks the current streak when a past period was missed', () => {
    const checkins = [
      checkin('2026-01-10', 'win'),
      checkin('2026-01-11', 'win'),
      checkin('2026-01-12', 'win'),
      checkin('2026-01-14', 'win'),
      checkin('2026-01-15', 'win'),
    ];
    expect(computeStreakSummary(checkins, 'daily', 0, NOW, '2026-01-10')).toEqual({
      current: 2,
      best: 3,
    });
  });

  it('does not break the streak when the current period is not logged yet', () => {
    const checkins = [checkin('2026-01-14', 'win')];
    expect(computeStreakSummary(checkins, 'daily', 0, NOW, '2026-01-14')).toEqual({
      current: 1,
      best: 1,
    });
  });

  it('resets the current streak on a loss', () => {
    const checkins = [checkin('2026-01-14', 'lose'), checkin('2026-01-15', 'win')];
    expect(computeStreakSummary(checkins, 'daily', 0, NOW, '2026-01-14')).toEqual({
      current: 1,
      best: 1,
    });
  });

  it('tracks weekly streaks across Sunday periods', () => {
    const checkins = [checkin('2026-01-04', 'win', 'weekly'), checkin('2026-01-11', 'win', 'weekly')];
    expect(computeStreakSummary(checkins, 'weekly', 0, NOW, '2026-01-04')).toEqual({
      current: 2,
      best: 2,
    });
  });

  it('returns zero when there is no history', () => {
    expect(computeStreakSummary([], 'daily', 0, NOW, '2026-01-15')).toEqual({
      current: 0,
      best: 0,
    });
  });
});

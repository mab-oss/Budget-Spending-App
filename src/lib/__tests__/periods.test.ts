import {
  formatPeriodLabel,
  getPeriodForDate,
  nextPeriod,
  previousPeriod,
  startOfWeekOn,
} from '../periods';

function localDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0);
}

describe('startOfWeekOn', () => {
  it('returns the Sunday on or before the date', () => {
    const thursday = localDate(2026, 1, 15);
    expect(startOfWeekOn(thursday).getDate()).toBe(11);
    expect(startOfWeekOn(thursday).getDay()).toBe(0);
  });

  it('returns the same day when already Sunday', () => {
    expect(startOfWeekOn(localDate(2026, 1, 11)).getDate()).toBe(11);
  });
});

describe('getPeriodForDate', () => {
  it('creates a single-day period for daily budgets', () => {
    const period = getPeriodForDate(localDate(2026, 1, 15), 'daily');
    expect(period.startKey).toBe('2026-01-15');
    expect(period.endKey).toBe('2026-01-15');
  });

  it('creates a Sunday-to-Saturday period for weekly budgets', () => {
    const period = getPeriodForDate(localDate(2026, 1, 15), 'weekly');
    expect(period.startKey).toBe('2026-01-11');
    expect(period.endKey).toBe('2026-01-17');
  });
});

describe('period navigation', () => {
  it('moves a daily period by one day', () => {
    const period = getPeriodForDate(localDate(2026, 1, 15), 'daily');
    expect(previousPeriod(period, 'daily').startKey).toBe('2026-01-14');
    expect(nextPeriod(period, 'daily').startKey).toBe('2026-01-16');
  });

  it('moves a weekly period by one week', () => {
    const period = getPeriodForDate(localDate(2026, 1, 15), 'weekly');
    expect(previousPeriod(period, 'weekly').startKey).toBe('2026-01-04');
    expect(nextPeriod(period, 'weekly').startKey).toBe('2026-01-18');
  });
});

describe('formatPeriodLabel', () => {
  it('formats daily labels', () => {
    const period = getPeriodForDate(localDate(2026, 1, 15), 'daily');
    expect(formatPeriodLabel(period, 'daily')).toBe('Thursday, Jan 15');
  });

  it('formats weekly labels as a range', () => {
    const period = getPeriodForDate(localDate(2026, 1, 15), 'weekly');
    expect(formatPeriodLabel(period, 'weekly')).toBe('Jan 11 – Jan 17');
  });
});

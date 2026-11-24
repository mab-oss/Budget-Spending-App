import type { Checkin, PeriodType } from '@/types';

import { fromDateKey, getPeriodForDate, nextPeriod } from './periods';

export interface StreakSummary {
  current: number;
  best: number;
}

export function computeStreakSummary(
  checkins: Checkin[],
  periodType: PeriodType,
  weekStartDay: number,
  now: Date,
  trackingStart: string,
): StreakSummary {
  const statusByStart = new Map<string, Checkin['status']>();
  for (const checkin of checkins) {
    statusByStart.set(checkin.periodStart, checkin.status);
  }

  const currentPeriod = getPeriodForDate(now, periodType, weekStartDay);
  const currentKey = currentPeriod.startKey;

  let firstKey = currentKey;
  if (trackingStart) {
    const trackingPeriod = getPeriodForDate(fromDateKey(trackingStart), periodType, weekStartDay);
    if (trackingPeriod.startKey < firstKey) {
      firstKey = trackingPeriod.startKey;
    }
  }
  for (const checkin of checkins) {
    if (checkin.periodStart < firstKey) {
      firstKey = checkin.periodStart;
    }
  }
  if (firstKey > currentKey) {
    firstKey = currentKey;
  }

  let period = getPeriodForDate(fromDateKey(firstKey), periodType, weekStartDay);
  let current = 0;
  let best = 0;
  let guard = 0;

  while (guard < 10000) {
    guard += 1;
    const key = period.startKey;
    const status = statusByStart.get(key);
    const isCurrent = key === currentKey;

    if (status === 'win') {
      current += 1;
      if (current > best) {
        best = current;
      }
    } else if (status === 'lose') {
      current = 0;
    } else if (!isCurrent) {
      current = 0;
    }

    if (isCurrent) {
      break;
    }
    period = nextPeriod(period, periodType, weekStartDay);
  }

  return { current, best };
}

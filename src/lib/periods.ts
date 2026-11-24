import { addDays, endOfDay, format, parseISO, startOfDay, subDays } from 'date-fns';

import type { PeriodType } from '@/types';

export interface Period {
  start: Date;
  end: Date;
  startKey: string;
  endKey: string;
}

export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function fromDateKey(key: string): Date {
  return parseISO(key);
}

export function startOfWeekOn(date: Date, weekStartDay = 0): Date {
  const day = startOfDay(date);
  const diff = (day.getDay() - weekStartDay + 7) % 7;
  return subDays(day, diff);
}

export function getPeriodForDate(date: Date, periodType: PeriodType, weekStartDay = 0): Period {
  if (periodType === 'daily') {
    const start = startOfDay(date);
    const end = endOfDay(date);
    return { start, end, startKey: toDateKey(start), endKey: toDateKey(end) };
  }

  const start = startOfWeekOn(date, weekStartDay);
  const end = endOfDay(addDays(start, 6));
  return { start, end, startKey: toDateKey(start), endKey: toDateKey(end) };
}

export function shiftPeriod(
  period: Period,
  direction: 1 | -1,
  periodType: PeriodType,
  weekStartDay = 0,
): Period {
  const days = (periodType === 'daily' ? 1 : 7) * direction;
  return getPeriodForDate(addDays(period.start, days), periodType, weekStartDay);
}

export function nextPeriod(period: Period, periodType: PeriodType, weekStartDay = 0): Period {
  return shiftPeriod(period, 1, periodType, weekStartDay);
}

export function previousPeriod(period: Period, periodType: PeriodType, weekStartDay = 0): Period {
  return shiftPeriod(period, -1, periodType, weekStartDay);
}

export function formatPeriodLabel(period: Period, periodType: PeriodType): string {
  if (periodType === 'daily') {
    return format(period.start, 'EEEE, MMM d');
  }
  return `${format(period.start, 'MMM d')} – ${format(period.end, 'MMM d')}`;
}

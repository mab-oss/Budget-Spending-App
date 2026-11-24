import type { PeriodType } from '@/types';

export interface RewardDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  code: string;
  threshold: Record<PeriodType, number>;
}

export const REWARD_CATALOG: RewardDefinition[] = [
  {
    id: 'first-win',
    title: 'First Win',
    description: 'Log your first period under budget.',
    icon: 'leaf',
    code: 'BQ-FIRSTWIN',
    threshold: { daily: 1, weekly: 1 },
  },
  {
    id: 'hot-streak',
    title: 'Hot Streak',
    description: 'Win three periods in a row.',
    icon: 'flame',
    code: 'BQ-HOTSTREAK',
    threshold: { daily: 3, weekly: 2 },
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Keep a full week of wins.',
    icon: 'shield-checkmark',
    code: 'BQ-WEEKWARRIOR',
    threshold: { daily: 7, weekly: 3 },
  },
  {
    id: 'halfway-hero',
    title: 'Halfway Hero',
    description: 'Two weeks of wins in a row.',
    icon: 'rocket',
    code: 'BQ-HALFWAY',
    threshold: { daily: 14, weekly: 6 },
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'A full month of wins unlocks a mock $10 gift card.',
    icon: 'gift',
    code: 'BQ-GIFT10',
    threshold: { daily: 30, weekly: 12 },
  },
];

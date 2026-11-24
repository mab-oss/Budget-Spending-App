import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0B1220',
    textSecondary: '#5B6472',
    background: '#F5F7FB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E7EEFA',
    border: '#E2E6EE',
    primary: '#208AEF',
    primaryText: '#FFFFFF',
    success: '#16A34A',
    successSoft: '#DCFCE7',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
    warning: '#B45309',
    warningSoft: '#FEF3C7',
    track: '#E7EEFA',
  },
  dark: {
    text: '#F2F4F8',
    textSecondary: '#A3ABBA',
    background: '#0B0E14',
    backgroundElement: '#151A23',
    backgroundSelected: '#1E2633',
    border: '#242B38',
    primary: '#4DA3FF',
    primaryText: '#06121F',
    success: '#34D399',
    successSoft: '#0F2E22',
    danger: '#F87171',
    dangerSoft: '#3A1414',
    warning: '#FBBF24',
    warningSoft: '#3A2A08',
    track: '#1E2633',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const MaxContentWidth = 960;

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { RewardDefinition } from '@/constants/rewards';
import { getPeriodForDate, toDateKey, type Period } from '@/lib/periods';
import { getEligibleRewardIds, getNextReward } from '@/lib/rewards';
import { computeStreakSummary, type StreakSummary } from '@/lib/streak';
import { clearCheckins, loadCheckins, upsertCheckin } from '@/storage/checkins';
import {
  clearUnlockedRewards,
  loadUnlockedRewards,
  unlockRewards,
} from '@/storage/rewards';
import { clearSettings, loadSettings, saveSettings } from '@/storage/settings';
import type {
  Checkin,
  CheckinStatus,
  DemoUser,
  PeriodType,
  Settings,
  UnlockedReward,
} from '@/types';

import { useAuth } from './auth-context';

interface OnboardingInput {
  periodType: PeriodType;
  budgetCents: number;
  currency: string;
}

interface SettingsPatch {
  periodType?: PeriodType;
  budgetCents?: number;
  currency?: string;
}

interface AppContextValue {
  ready: boolean;
  settings: Settings | null;
  checkins: Checkin[];
  unlockedRewards: UnlockedReward[];
  currentPeriod: Period | null;
  currentCheckin: Checkin | null;
  streak: StreakSummary;
  nextReward: RewardDefinition | null;
  completeOnboarding: (input: OnboardingInput) => void;
  updateSettings: (patch: SettingsPatch) => void;
  logSpending: (amountCents: number) => Checkin;
  resetProgress: () => void;
  resetAll: () => void;
  refresh: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_STREAK: StreakSummary = { current: 0, best: 0 };

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  return (
    <UserAppProvider key={currentUser?.id ?? 'guest'} user={currentUser}>
      {children}
    </UserAppProvider>
  );
}

function UserAppProvider({ user, children }: { user: DemoUser | null; children: ReactNode }) {
  const userId = user?.id ?? null;
  const ready = true;

  const [settings, setSettings] = useState<Settings | null>(() =>
    userId ? loadSettings(userId) : null,
  );
  const [checkins, setCheckins] = useState<Checkin[]>(() =>
    userId ? loadCheckins(userId) : [],
  );
  const [unlockedRewards, setUnlockedRewards] = useState<UnlockedReward[]>(() =>
    userId ? loadUnlockedRewards(userId) : [],
  );

  const refresh = useCallback(() => {
    if (!userId) {
      setSettings(null);
      setCheckins([]);
      setUnlockedRewards([]);
      return;
    }
    setSettings(loadSettings(userId));
    setCheckins(loadCheckins(userId));
    setUnlockedRewards(loadUnlockedRewards(userId));
  }, [userId]);

  const completeOnboarding = useCallback(
    (input: OnboardingInput) => {
      if (!userId) {
        return;
      }
      const next: Settings = {
        periodType: input.periodType,
        budgetCents: input.budgetCents,
        currency: input.currency,
        weekStartDay: 0,
        trackingStart: toDateKey(new Date()),
        onboardingComplete: true,
      };
      saveSettings(userId, next);
      refresh();
    },
    [userId, refresh],
  );

  const updateSettings = useCallback(
    (patch: SettingsPatch) => {
      if (!userId) {
        return;
      }
      const current = loadSettings(userId);
      if (!current) {
        return;
      }
      saveSettings(userId, { ...current, ...patch });
      refresh();
    },
    [userId, refresh],
  );

  const logSpending = useCallback(
    (amountCents: number): Checkin => {
      if (!userId) {
        throw new Error('Sign in first.');
      }
      const current = loadSettings(userId);
      if (!current) {
        throw new Error('Set up your budget first.');
      }
      const period = getPeriodForDate(new Date(), current.periodType, current.weekStartDay);
      const status: CheckinStatus = amountCents <= current.budgetCents ? 'win' : 'lose';
      const saved = upsertCheckin(userId, {
        periodStart: period.startKey,
        periodEnd: period.endKey,
        periodType: current.periodType,
        budgetCents: current.budgetCents,
        spentCents: amountCents,
        status,
      });
      const all = loadCheckins(userId);
      const summary = computeStreakSummary(
        all,
        current.periodType,
        current.weekStartDay,
        new Date(),
        current.trackingStart,
      );
      unlockRewards(userId, getEligibleRewardIds(summary.best, current.periodType));
      refresh();
      return saved;
    },
    [userId, refresh],
  );

  const resetProgress = useCallback(() => {
    if (!userId) {
      return;
    }
    clearCheckins(userId);
    clearUnlockedRewards(userId);
    refresh();
  }, [userId, refresh]);

  const resetAll = useCallback(() => {
    if (!userId) {
      return;
    }
    clearCheckins(userId);
    clearUnlockedRewards(userId);
    clearSettings(userId);
    refresh();
  }, [userId, refresh]);

  const now = new Date();
  const currentPeriod = settings
    ? getPeriodForDate(now, settings.periodType, settings.weekStartDay)
    : null;
  const currentCheckin =
    currentPeriod && settings
      ? (checkins.find(
          (checkin) =>
            checkin.periodStart === currentPeriod.startKey &&
            checkin.periodType === settings.periodType,
        ) ?? null)
      : null;
  const streak = settings
    ? computeStreakSummary(
        checkins,
        settings.periodType,
        settings.weekStartDay,
        now,
        settings.trackingStart,
      )
    : EMPTY_STREAK;
  const nextReward = settings ? getNextReward(streak.best, settings.periodType) : null;

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      settings,
      checkins,
      unlockedRewards,
      currentPeriod,
      currentCheckin,
      streak,
      nextReward,
      completeOnboarding,
      updateSettings,
      logSpending,
      resetProgress,
      resetAll,
      refresh,
    }),
    [
      ready,
      settings,
      checkins,
      unlockedRewards,
      currentPeriod,
      currentCheckin,
      streak,
      nextReward,
      completeOnboarding,
      updateSettings,
      logSpending,
      resetProgress,
      resetAll,
      refresh,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

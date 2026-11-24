export type PeriodType = 'daily' | 'weekly';

export type CheckinStatus = 'win' | 'lose';

export type SeedStatus = 'win' | 'lose' | 'missed';

export interface Settings {
  periodType: PeriodType;
  budgetCents: number;
  currency: string;
  weekStartDay: number;
  trackingStart: string;
  onboardingComplete: boolean;
}

export interface Checkin {
  id: string;
  periodStart: string;
  periodEnd: string;
  periodType: PeriodType;
  budgetCents: number;
  spentCents: number;
  status: CheckinStatus;
  createdAt: string;
}

export interface UnlockedReward {
  id: string;
  unlockedAt: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  initials: string;
  color: string;
  persona: string;
  periodType: PeriodType;
  budgetCents: number;
  seedStatuses: SeedStatus[] | null;
}

import type { DemoUser } from '@/types';

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'maya',
    name: 'Maya',
    email: 'maya@demo.com',
    password: 'demo123',
    initials: 'MA',
    color: '#208AEF',
    persona: 'Daily regular',
    periodType: 'daily',
    budgetCents: 4000,
    seedStatuses: [
      'win',
      'win',
      'win',
      'win',
      'win',
      'win',
      'win',
      'win',
      'missed',
      'win',
    ],
  },
  {
    id: 'leo',
    name: 'Leo',
    email: 'leo@demo.com',
    password: 'demo123',
    initials: 'LE',
    color: '#16A34A',
    persona: 'Weekly planner',
    periodType: 'weekly',
    budgetCents: 25000,
    seedStatuses: ['win', 'win', 'win', 'lose'],
  },
  {
    id: 'sam',
    name: 'Sam',
    email: 'sam@demo.com',
    password: 'demo123',
    initials: 'SA',
    color: '#D97706',
    persona: 'Getting started',
    periodType: 'daily',
    budgetCents: 3000,
    seedStatuses: ['missed', 'missed', 'win', 'lose', 'win', 'win', 'missed', 'win'],
  },
];

export function findDemoUserByCredentials(email: string, password: string): DemoUser | null {
  const normalized = email.trim().toLowerCase();
  return (
    DEMO_USERS.find(
      (user) => user.email.toLowerCase() === normalized && user.password === password,
    ) ?? null
  );
}

export function findDemoUserById(id: string): DemoUser | null {
  return DEMO_USERS.find((user) => user.id === id) ?? null;
}

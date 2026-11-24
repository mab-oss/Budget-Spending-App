import { DEMO_USERS, findDemoUserByCredentials, findDemoUserById } from '../demo-users';

describe('demo users', () => {
  it('exposes three seeded accounts', () => {
    expect(DEMO_USERS).toHaveLength(3);
    expect(DEMO_USERS.map((user) => user.id)).toEqual(['maya', 'leo', 'sam']);
  });

  it('uses the shared demo password', () => {
    for (const user of DEMO_USERS) {
      expect(user.password).toBe('demo123');
    }
  });

  it('finds users by credentials case-insensitively', () => {
    expect(findDemoUserByCredentials('MAYA@DEMO.COM', 'demo123')?.id).toBe('maya');
    expect(findDemoUserByCredentials('  leo@demo.com ', 'demo123')?.id).toBe('leo');
  });

  it('rejects wrong passwords and unknown emails', () => {
    expect(findDemoUserByCredentials('maya@demo.com', 'nope')).toBeNull();
    expect(findDemoUserByCredentials('nobody@demo.com', 'demo123')).toBeNull();
  });

  it('finds users by id', () => {
    expect(findDemoUserById('sam')?.name).toBe('Sam');
    expect(findDemoUserById('unknown')).toBeNull();
  });
});

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { DEMO_USERS, findDemoUserByCredentials, findDemoUserById } from '@/constants/demo-users';
import { ensureDemoData } from '@/storage/seed';
import { clearSession, loadSessionUserId, saveSession } from '@/storage/session';
import type { DemoUser } from '@/types';

interface LoginResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  ready: boolean;
  currentUser: DemoUser | null;
  demoUsers: DemoUser[];
  login: (email: string, password: string) => LoginResult;
  loginAs: (userId: string) => LoginResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadInitialUser(): DemoUser | null {
  const userId = loadSessionUserId();
  if (!userId) {
    return null;
  }
  const user = findDemoUserById(userId);
  if (!user) {
    clearSession();
    return null;
  }
  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(loadInitialUser);
  const ready = true;

  const loginAs = useCallback((userId: string): LoginResult => {
    const user = findDemoUserById(userId);
    if (!user) {
      return { ok: false, error: 'That demo account was not found.' };
    }
    ensureDemoData(user);
    saveSession(user.id);
    setCurrentUser(user);
    return { ok: true };
  }, []);

  const login = useCallback((email: string, password: string): LoginResult => {
    const user = findDemoUserByCredentials(email, password);
    if (!user) {
      return { ok: false, error: 'Incorrect email or password. Try a demo account below.' };
    }
    ensureDemoData(user);
    saveSession(user.id);
    setCurrentUser(user);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      currentUser,
      demoUsers: DEMO_USERS,
      login,
      loginAs,
      logout,
    }),
    [ready, currentUser, login, loginAs, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

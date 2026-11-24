import { Redirect } from 'expo-router';

import { Loading } from '@/components/loading';
import { useApp } from '@/store/app-context';
import { useAuth } from '@/store/auth-context';

export default function Index() {
  const { ready: authReady, currentUser } = useAuth();
  const { ready: appReady, settings } = useApp();

  if (!authReady || !appReady) {
    return <Loading label="Loading BudgetQuest..." />;
  }

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!settings?.onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/home" />;
}

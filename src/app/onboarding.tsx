import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Loading } from '@/components/loading';
import { SegmentedControl } from '@/components/segmented-control';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { parseMoneyToCents } from '@/lib/money';
import { useApp } from '@/store/app-context';
import { useAuth } from '@/store/auth-context';
import type { PeriodType } from '@/types';

const PERIOD_OPTIONS: { label: string; value: PeriodType }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { ready: authReady, currentUser } = useAuth();
  const { ready: appReady, settings, completeOnboarding } = useApp();
  const [periodType, setPeriodType] = useState<PeriodType>('daily');
  const [budgetInput, setBudgetInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!authReady || !appReady) {
    return <Loading label="Loading your quest..." />;
  }

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (settings?.onboardingComplete) {
    return <Redirect href="/home" />;
  }

  const handleStart = () => {
    const budgetCents = parseMoneyToCents(budgetInput);
    if (!budgetCents || budgetCents <= 0) {
      setError('Enter a budget greater than $0.');
      return;
    }
    setError(null);
    completeOnboarding({ periodType, budgetCents, currency: 'USD' });
    router.replace('/home');
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.inner}>
        <View style={styles.brand}>
          <View style={[styles.logo, { backgroundColor: theme.primary }]}>
            <Ionicons name="wallet" size={28} color={theme.primaryText} />
          </View>
          <ThemedText type="heading">Welcome, {currentUser.name}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.center}>
            Set a budget, check in, and win the game of spending less.
          </ThemedText>
        </View>

        <Card>
          <ThemedText type="smallBold">How often will you check in?</ThemedText>
          <SegmentedControl options={PERIOD_OPTIONS} value={periodType} onChange={setPeriodType} />
          <ThemedText type="caption" themeColor="textSecondary">
            {periodType === 'daily'
              ? 'You will log spending once per day.'
              : 'You will log spending once per week. Weeks start on Sunday.'}
          </ThemedText>
        </Card>

        <Card>
          <ThemedText type="smallBold">
            {periodType === 'daily' ? 'Daily' : 'Weekly'} budget
          </ThemedText>
          <View
            style={[
              styles.inputRow,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}>
            <ThemedText type="heading" themeColor="textSecondary">
              $
            </ThemedText>
            <TextInput
              value={budgetInput}
              onChangeText={setBudgetInput}
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              inputMode="decimal"
              style={[styles.input, { color: theme.text }]}
              onSubmitEditing={handleStart}
              returnKeyType="done"
              accessibilityLabel="Budget amount"
            />
          </View>
          <ThemedText type="caption" themeColor="textSecondary">
            Spend this amount or less each {periodType === 'daily' ? 'day' : 'week'} to win.
          </ThemedText>
        </Card>

        {error ? (
          <ThemedText type="small" style={{ color: theme.danger }}>
            {error}
          </ThemedText>
        ) : null}

        <Button title="Start my quest" icon="arrow-forward" onPress={handleStart} />

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
          <ThemedText type="caption" themeColor="textSecondary" style={styles.grow}>
            You can change your budget and check-in frequency later in Settings.
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.six,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 560,
    gap: Spacing.three,
  },
  brand: {
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
  },
  input: {
    flex: 1,
    minHeight: 54,
    fontSize: 24,
    fontWeight: '700',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  grow: {
    flex: 1,
  },
});

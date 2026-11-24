import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Loading } from '@/components/loading';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { centsToInput, formatMoney, parseMoneyToCents } from '@/lib/money';
import { formatPeriodLabel, type Period } from '@/lib/periods';
import { useApp } from '@/store/app-context';
import { useAuth } from '@/store/auth-context';
import type { Checkin, Settings } from '@/types';

export default function CheckinScreen() {
  const router = useRouter();
  const { ready: authReady, currentUser } = useAuth();
  const { ready: appReady, settings, currentPeriod, currentCheckin, logSpending } = useApp();

  if (!authReady || !appReady) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!settings || !currentPeriod) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <CheckinForm
      key={currentCheckin?.id ?? 'new'}
      settings={settings}
      period={currentPeriod}
      currentCheckin={currentCheckin}
      logSpending={logSpending}
      onSaved={(saved) =>
        router.replace({
          pathname: '/result',
          params: {
            status: saved.status,
            spent: String(saved.spentCents),
            budget: String(saved.budgetCents),
          },
        })
      }
      onCancel={() => router.replace('/home')}
    />
  );
}

interface CheckinFormProps {
  settings: Settings;
  period: Period;
  currentCheckin: Checkin | null;
  logSpending: (amountCents: number) => Checkin;
  onSaved: (saved: Checkin) => void;
  onCancel: () => void;
}

function CheckinForm({
  settings,
  period,
  currentCheckin,
  logSpending,
  onSaved,
  onCancel,
}: CheckinFormProps) {
  const theme = useTheme();
  const [amountInput, setAmountInput] = useState(
    currentCheckin ? centsToInput(currentCheckin.spentCents) : '',
  );
  const [error, setError] = useState<string | null>(null);

  const amountCents = parseMoneyToCents(amountInput) ?? 0;
  const remaining = settings.budgetCents - amountCents;
  const over = remaining < 0;
  const progress = settings.budgetCents > 0 ? amountCents / settings.budgetCents : 0;

  const handleSubmit = () => {
    const cents = parseMoneyToCents(amountInput);
    if (cents === null) {
      setError('Enter how much you spent.');
      return;
    }
    setError(null);
    try {
      onSaved(logSpending(cents));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your check-in.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <View style={styles.grow}>
              <ThemedText type="heading">
                {currentCheckin ? 'Edit check-in' : 'Check in'}
              </ThemedText>
              <ThemedText themeColor="textSecondary">
                {formatPeriodLabel(period, settings.periodType)}
              </ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onCancel}
              style={styles.close}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </Pressable>
          </View>

          <Card style={styles.cardStack}>
            <View style={styles.rowBetween}>
              <ThemedText type="small" themeColor="textSecondary">
                Budget
              </ThemedText>
              <ThemedText type="smallBold">
                {formatMoney(settings.budgetCents, settings.currency)}
              </ThemedText>
            </View>

            <ThemedText type="label" themeColor="textSecondary">
              How much did you spend?
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
                value={amountInput}
                onChangeText={setAmountInput}
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
                inputMode="decimal"
                autoFocus
                style={[styles.input, { color: theme.text }]}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                accessibilityLabel="Amount spent"
              />
            </View>

            <ProgressBar value={progress} tone={over ? 'danger' : 'success'} height={10} />

            <View style={styles.rowBetween}>
              <ThemedText type="caption" themeColor="textSecondary">
                {over ? 'Over budget by' : 'Left after this'}
              </ThemedText>
              <ThemedText
                type="smallBold"
                style={{ color: over ? theme.danger : theme.success }}>
                {formatMoney(Math.abs(remaining), settings.currency)}
              </ThemedText>
            </View>
          </Card>

          {error ? (
            <ThemedText type="small" style={{ color: theme.danger }}>
              {error}
            </ThemedText>
          ) : null}

          <Button
            title={currentCheckin ? 'Update check-in' : 'Log spending'}
            icon="checkmark"
            onPress={handleSubmit}
          />
          <Button title="Cancel" variant="ghost" onPress={onCancel} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.five,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 560,
    gap: Spacing.three,
  },
  cardStack: {
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  grow: {
    flex: 1,
  },
  close: {
    padding: Spacing.one,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
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
});

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Loading } from '@/components/loading';
import { Page } from '@/components/page';
import { SegmentedControl } from '@/components/segmented-control';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { centsToInput, parseMoneyToCents } from '@/lib/money';
import { useApp } from '@/store/app-context';
import { useAuth } from '@/store/auth-context';
import type { DemoUser, PeriodType, Settings } from '@/types';

const PERIOD_OPTIONS: { label: string; value: PeriodType }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
];

type DialogKind = 'reset-progress' | 'start-over' | null;

export default function SettingsScreen() {
  const { currentUser } = useAuth();
  const { ready, settings } = useApp();

  if (!ready || !settings || !currentUser) {
    return <Loading />;
  }

  return <SettingsForm settings={settings} user={currentUser} />;
}

function SettingsForm({ settings, user }: { settings: Settings; user: DemoUser }) {
  const theme = useTheme();
  const router = useRouter();
  const { logout } = useAuth();
  const { updateSettings, resetProgress, resetAll } = useApp();

  const [periodType, setPeriodType] = useState<PeriodType>(settings.periodType);
  const [budgetInput, setBudgetInput] = useState(centsToInput(settings.budgetCents));
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const budgetCents = parseMoneyToCents(budgetInput);
    if (!budgetCents || budgetCents <= 0) {
      setError('Enter a budget greater than $0.');
      return;
    }
    setError(null);
    updateSettings({ periodType, budgetCents });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <Page>
      <ThemedText type="heading">Settings</ThemedText>

      <Card style={styles.cardStack}>
        <View style={styles.accountRow}>
          <View style={[styles.avatar, { backgroundColor: user.color }]}>
            <ThemedText type="smallBold" style={styles.avatarText}>
              {user.initials}
            </ThemedText>
          </View>
          <View style={styles.grow}>
            <ThemedText type="smallBold">{user.name}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {user.email}
            </ThemedText>
          </View>
        </View>
        <View style={styles.rowGap}>
          <Button
            title="Log out"
            variant="secondary"
            icon="log-out-outline"
            onPress={handleLogout}
            style={styles.flex}
          />
          <Button
            title="Switch account"
            variant="ghost"
            icon="swap-horizontal-outline"
            onPress={handleLogout}
            style={styles.flex}
          />
        </View>
      </Card>

      <Card style={styles.cardStack}>
        <ThemedText type="smallBold">Budget</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          Change how often you check in and how much you can spend.
        </ThemedText>
        <SegmentedControl options={PERIOD_OPTIONS} value={periodType} onChange={setPeriodType} />
        <View style={styles.field}>
          <ThemedText type="label" themeColor="textSecondary">
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
              inputMode="decimal"
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text }]}
              onSubmitEditing={handleSave}
              returnKeyType="done"
              accessibilityLabel="Budget amount"
            />
          </View>
        </View>
        {error ? (
          <ThemedText type="small" style={{ color: theme.danger }}>
            {error}
          </ThemedText>
        ) : null}
        {saved ? (
          <ThemedText type="small" style={{ color: theme.success }}>
            Saved.
          </ThemedText>
        ) : null}
        <Button title="Save changes" icon="save-outline" onPress={handleSave} />
      </Card>

      <Card style={styles.cardStack}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
          <ThemedText type="caption" themeColor="textSecondary">
            Weeks start on Sunday.
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={18} color={theme.textSecondary} />
          <ThemedText type="caption" themeColor="textSecondary">
            Currency: USD
          </ThemedText>
        </View>
      </Card>

      <Card tone="danger" style={styles.cardStack}>
        <ThemedText type="smallBold">Danger zone</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          Reset clears your check-ins and rewards. Start over also removes your budget.
        </ThemedText>
        <Button
          title="Reset progress"
          variant="secondary"
          onPress={() => setDialog('reset-progress')}
        />
        <Button title="Start over" variant="danger" onPress={() => setDialog('start-over')} />
      </Card>

      <ConfirmDialog
        visible={dialog === 'reset-progress'}
        title="Reset progress?"
        message="This clears all check-ins and unlocked rewards for this account. Your budget stays the same."
        confirmLabel="Reset progress"
        destructive
        onConfirm={() => {
          resetProgress();
          setDialog(null);
        }}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        visible={dialog === 'start-over'}
        title="Start over?"
        message="This clears your budget, check-ins, and rewards, then sends you back to setup."
        confirmLabel="Start over"
        destructive
        onConfirm={() => {
          resetAll();
          setDialog(null);
          router.replace('/onboarding');
        }}
        onCancel={() => setDialog(null)}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  cardStack: {
    gap: Spacing.two,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
  },
  grow: {
    flex: 1,
  },
  rowGap: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  field: {
    gap: Spacing.one,
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
    minHeight: 48,
    fontSize: 22,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});

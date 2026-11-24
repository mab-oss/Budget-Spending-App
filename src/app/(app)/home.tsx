import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Loading } from '@/components/loading';
import { Page } from '@/components/page';
import { ProgressBar } from '@/components/progress-bar';
import { StatusBadge } from '@/components/status-badge';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/lib/money';
import { formatPeriodLabel } from '@/lib/periods';
import { useApp } from '@/store/app-context';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { ready, settings, currentPeriod, currentCheckin, streak, nextReward } = useApp();

  if (!ready || !settings || !currentPeriod) {
    return <Loading label="Loading your quest..." />;
  }

  const currency = settings.currency;
  const budget = settings.budgetCents;
  const spent = currentCheckin?.spentCents ?? 0;
  const remaining = budget - spent;
  const over = remaining < 0;
  const progress = budget > 0 ? spent / budget : 0;
  const isWin = currentCheckin?.status === 'win';
  const periodUnit = settings.periodType === 'daily' ? 'today' : 'this week';
  const unit = settings.periodType === 'daily' ? 'day' : 'week';
  const nextThreshold = nextReward ? nextReward.threshold[settings.periodType] : 0;
  const nextProgress = nextThreshold > 0 ? Math.min(1, streak.best / nextThreshold) : 1;

  return (
    <Page>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="label" themeColor="textSecondary">
            Your quest
          </ThemedText>
          <ThemedText type="heading">
            {currentCheckin ? 'Check-in complete' : `Ready for ${periodUnit}?`}
          </ThemedText>
        </View>
        <View style={[styles.streakPill, { backgroundColor: theme.warningSoft }]}>
          <Ionicons name="flame" size={16} color={theme.warning} />
          <ThemedText type="smallBold" style={{ color: theme.warning }}>
            {streak.current}
          </ThemedText>
        </View>
      </View>

      <Card style={styles.cardStack}>
        <View style={styles.rowBetween}>
          <View style={styles.grow}>
            <ThemedText type="caption" themeColor="textSecondary">
              {settings.periodType === 'daily' ? 'Daily period' : 'Weekly period'}
            </ThemedText>
            <ThemedText type="smallBold">
              {formatPeriodLabel(currentPeriod, settings.periodType)}
            </ThemedText>
          </View>
          {currentCheckin ? <StatusBadge status={currentCheckin.status} /> : null}
        </View>

        <View style={styles.amountRow}>
          <ThemedText type="hero">{formatMoney(spent, currency)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            of {formatMoney(budget, currency)}
          </ThemedText>
        </View>

        <ProgressBar
          value={progress}
          tone={over ? 'danger' : currentCheckin ? 'success' : 'primary'}
          height={12}
        />

        <View style={styles.rowBetween}>
          <ThemedText type="caption" themeColor="textSecondary">
            {over ? 'Over budget' : 'Remaining'}
          </ThemedText>
          <ThemedText
            type="smallBold"
            style={{ color: over ? theme.danger : theme.success }}>
            {formatMoney(Math.abs(remaining), currency)}
          </ThemedText>
        </View>

        {currentCheckin ? (
          <View style={styles.resultNote}>
            <Ionicons
              name={isWin ? 'checkmark-circle' : 'alert-circle'}
              size={18}
              color={isWin ? theme.success : theme.danger}
            />
            <ThemedText type="caption" themeColor="textSecondary" style={styles.grow}>
              {isWin
                ? 'You are under budget. Nice work!'
                : 'You are over budget this period. Try again next time.'}
            </ThemedText>
          </View>
        ) : null}
      </Card>

      <Button
        title={currentCheckin ? 'Edit check-in' : `Check in for ${periodUnit}`}
        icon={currentCheckin ? 'create-outline' : 'add'}
        onPress={() => router.push('/checkin')}
      />

      <View style={styles.statGrid}>
        <Card style={styles.statCard}>
          <ThemedText type="caption" themeColor="textSecondary">
            Current streak
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.warning }}>
            {streak.current}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {unit}s in a row
          </ThemedText>
        </Card>
        <Card style={styles.statCard}>
          <ThemedText type="caption" themeColor="textSecondary">
            Best streak
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.primary }}>
            {streak.best}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            personal record
          </ThemedText>
        </Card>
      </View>

      {nextReward ? (
        <Card style={styles.cardStack}>
          <View style={styles.rewardHeader}>
            <View style={[styles.rewardIcon, { backgroundColor: theme.backgroundSelected }]}>
              <Ionicons
                name={nextReward.icon as keyof typeof Ionicons.glyphMap}
                size={18}
                color={theme.primary}
              />
            </View>
            <View style={styles.grow}>
              <ThemedText type="smallBold">Next reward: {nextReward.title}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {nextThreshold - streak.best} more winning {unit}s
              </ThemedText>
            </View>
          </View>
          <ProgressBar value={nextProgress} height={8} />
        </Card>
      ) : (
        <Card tone="success">
          <ThemedText type="smallBold">All rewards unlocked!</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            You have collected every reward. Keep the streak going.
          </ThemedText>
        </Card>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  cardStack: {
    gap: Spacing.two,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  grow: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  resultNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  statGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  statCard: {
    flex: 1,
    gap: Spacing.one,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rewardIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

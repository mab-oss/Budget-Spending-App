import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Loading } from '@/components/loading';
import { Page } from '@/components/page';
import { StatusBadge } from '@/components/status-badge';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/lib/money';
import { formatPeriodLabel, fromDateKey } from '@/lib/periods';
import { useApp } from '@/store/app-context';

export default function HistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { ready, settings, checkins } = useApp();

  if (!ready || !settings) {
    return <Loading />;
  }

  const wins = checkins.filter((checkin) => checkin.status === 'win').length;
  const losses = checkins.length - wins;
  const totalSpent = checkins.reduce((sum, checkin) => sum + checkin.spentCents, 0);

  return (
    <Page>
      <ThemedText type="heading">History</ThemedText>

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <ThemedText type="caption" themeColor="textSecondary">
            Wins
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.success }}>
            {wins}
          </ThemedText>
        </Card>
        <Card style={styles.summaryCard}>
          <ThemedText type="caption" themeColor="textSecondary">
            Losses
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.danger }}>
            {losses}
          </ThemedText>
        </Card>
        <Card style={styles.summaryCard}>
          <ThemedText type="caption" themeColor="textSecondary">
            Total spent
          </ThemedText>
          <ThemedText type="smallBold">{formatMoney(totalSpent, settings.currency)}</ThemedText>
        </Card>
      </View>

      {checkins.length === 0 ? (
        <Card style={styles.empty}>
          <Ionicons name="receipt-outline" size={40} color={theme.textSecondary} />
          <ThemedText type="smallBold">No check-ins yet</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.center}>
            Log your first period to start building your history.
          </ThemedText>
          <Button title="Check in now" onPress={() => router.push('/checkin')} />
        </Card>
      ) : (
        <View style={styles.list}>
          {checkins.map((checkin) => {
            const period = {
              start: fromDateKey(checkin.periodStart),
              end: fromDateKey(checkin.periodEnd),
              startKey: checkin.periodStart,
              endKey: checkin.periodEnd,
            };
            const remaining = checkin.budgetCents - checkin.spentCents;
            const over = remaining < 0;
            return (
              <Card key={checkin.id} style={styles.cardStack}>
                <View style={styles.rowBetween}>
                  <ThemedText type="smallBold">
                    {formatPeriodLabel(period, checkin.periodType)}
                  </ThemedText>
                  <StatusBadge status={checkin.status} />
                </View>
                <View style={styles.rowBetween}>
                  <ThemedText type="caption" themeColor="textSecondary">
                    Spent {formatMoney(checkin.spentCents, settings.currency)} of{' '}
                    {formatMoney(checkin.budgetCents, settings.currency)}
                  </ThemedText>
                  <ThemedText
                    type="caption"
                    style={{ color: over ? theme.danger : theme.success }}>
                    {over ? 'Over' : 'Left'} {formatMoney(Math.abs(remaining), settings.currency)}
                  </ThemedText>
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  summaryCard: {
    flex: 1,
    gap: Spacing.one,
  },
  list: {
    gap: Spacing.two,
  },
  cardStack: {
    gap: Spacing.two,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
});

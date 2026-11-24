import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/lib/money';
import { useApp } from '@/store/app-context';

export default function ResultScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ status?: string; spent?: string; budget?: string }>();
  const { settings, streak } = useApp();

  const isWin = params.status !== 'lose';
  const spentCents = Number(params.spent ?? 0);
  const budgetCents = Number(params.budget ?? settings?.budgetCents ?? 0);
  const difference = Math.abs(budgetCents - spentCents);
  const currency = settings?.currency ?? 'USD';

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      <View style={styles.inner}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isWin ? theme.successSoft : theme.dangerSoft },
          ]}>
          <Ionicons
            name={isWin ? 'trophy' : 'close-circle'}
            size={56}
            color={isWin ? theme.success : theme.danger}
          />
        </View>

        <ThemedText type="hero" style={styles.center}>
          {isWin ? 'You won!' : 'Over budget'}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.center}>
          {isWin
            ? 'You stayed within your budget this period. Keep the streak alive.'
            : `You went over by ${formatMoney(difference, currency)}. Reset and try again next period.`}
        </ThemedText>

        <Card style={styles.stats}>
          <View style={styles.rowBetween}>
            <ThemedText themeColor="textSecondary">Spent</ThemedText>
            <ThemedText type="smallBold">{formatMoney(spentCents, currency)}</ThemedText>
          </View>
          <View style={styles.rowBetween}>
            <ThemedText themeColor="textSecondary">Budget</ThemedText>
            <ThemedText type="smallBold">{formatMoney(budgetCents, currency)}</ThemedText>
          </View>
          <View style={styles.rowBetween}>
            <ThemedText themeColor="textSecondary">{isWin ? 'Remaining' : 'Over'}</ThemedText>
            <ThemedText
              type="smallBold"
              style={{ color: isWin ? theme.success : theme.danger }}>
              {formatMoney(difference, currency)}
            </ThemedText>
          </View>
          <View style={styles.rowBetween}>
            <ThemedText themeColor="textSecondary">Current streak</ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.warning }}>
              {streak.current}
            </ThemedText>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button title="Back to home" onPress={() => router.replace('/home')} />
          <Button
            title="View rewards"
            variant="secondary"
            icon="gift-outline"
            onPress={() => router.replace('/rewards')}
          />
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
    maxWidth: 520,
    gap: Spacing.three,
    alignItems: 'stretch',
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  center: {
    textAlign: 'center',
  },
  stats: {
    gap: Spacing.two,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
  },
});

import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { Loading } from '@/components/loading';
import { Page } from '@/components/page';
import { RewardCard } from '@/components/reward-card';
import { ThemedText } from '@/components/themed-text';
import { REWARD_CATALOG } from '@/constants/rewards';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/store/app-context';

export default function RewardsScreen() {
  const theme = useTheme();
  const { ready, settings, streak, unlockedRewards } = useApp();

  if (!ready || !settings) {
    return <Loading />;
  }

  const unlockedById = new Map(
    unlockedRewards.map((reward) => [reward.id, reward.unlockedAt]),
  );
  const unlockedCount = REWARD_CATALOG.filter(
    (reward) =>
      unlockedById.has(reward.id) || streak.best >= reward.threshold[settings.periodType],
  ).length;

  return (
    <Page>
      <ThemedText type="heading">Rewards</ThemedText>
      <ThemedText themeColor="textSecondary">
        Stay under budget to build a streak and unlock mock perks, badges, and vouchers.
      </ThemedText>

      <Card>
        <View style={styles.summaryRow}>
          <View style={styles.grow}>
            <ThemedText type="caption" themeColor="textSecondary">
              Current streak
            </ThemedText>
            <ThemedText type="subtitle" style={{ color: theme.warning }}>
              {streak.current}
            </ThemedText>
          </View>
          <View style={styles.grow}>
            <ThemedText type="caption" themeColor="textSecondary">
              Best streak
            </ThemedText>
            <ThemedText type="subtitle" style={{ color: theme.primary }}>
              {streak.best}
            </ThemedText>
          </View>
          <View style={styles.grow}>
            <ThemedText type="caption" themeColor="textSecondary">
              Unlocked
            </ThemedText>
            <ThemedText type="subtitle" style={{ color: theme.success }}>
              {unlockedCount}/{REWARD_CATALOG.length}
            </ThemedText>
          </View>
        </View>
      </Card>

      <View style={styles.list}>
        {REWARD_CATALOG.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            periodType={settings.periodType}
            bestStreak={streak.best}
            unlockedAt={unlockedById.get(reward.id)}
          />
        ))}
      </View>

      <ThemedText type="caption" themeColor="textSecondary" style={styles.footer}>
        Demo rewards only. Vouchers are simulated and have no cash value.
      </ThemedText>
    </Page>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  grow: {
    flex: 1,
  },
  list: {
    gap: Spacing.two,
  },
  footer: {
    textAlign: 'center',
  },
});

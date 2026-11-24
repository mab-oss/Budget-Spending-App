import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import type { RewardDefinition } from '@/constants/rewards';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PeriodType } from '@/types';

export function RewardCard({
  reward,
  periodType,
  bestStreak,
  unlockedAt,
}: {
  reward: RewardDefinition;
  periodType: PeriodType;
  bestStreak: number;
  unlockedAt?: string;
}) {
  const theme = useTheme();
  const threshold = reward.threshold[periodType];
  const unlocked = bestStreak >= threshold || Boolean(unlockedAt);
  const progress = threshold > 0 ? Math.min(1, bestStreak / threshold) : 1;
  const remaining = Math.max(0, threshold - bestStreak);
  const unit = periodType === 'daily' ? 'day' : 'week';

  return (
    <Card tone={unlocked ? 'success' : 'default'}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: unlocked ? theme.successSoft : theme.backgroundSelected },
          ]}>
          <Ionicons
            name={reward.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color={unlocked ? theme.success : theme.textSecondary}
          />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="smallBold">{reward.title}</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {reward.description}
          </ThemedText>
        </View>
        {unlocked ? (
          <Ionicons name="checkmark-circle" size={22} color={theme.success} />
        ) : (
          <ThemedText type="label" themeColor="textSecondary">
            {threshold} {unit}
            {threshold === 1 ? '' : 's'}
          </ThemedText>
        )}
      </View>

      {unlocked ? (
        <View style={styles.unlockedRow}>
          <View
            style={[
              styles.codeWrap,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}>
            <ThemedText type="code">{reward.code}</ThemedText>
          </View>
          <ThemedText type="caption" themeColor="textSecondary">
            Mock voucher
          </ThemedText>
        </View>
      ) : (
        <View style={styles.progressWrap}>
          <ProgressBar value={progress} height={8} />
          <ThemedText type="caption" themeColor="textSecondary">
            {remaining} more winning {unit}
            {remaining === 1 ? '' : 's'} to unlock
          </ThemedText>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrap: {
    marginTop: Spacing.three,
    gap: Spacing.one,
  },
  unlockedRow: {
    marginTop: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  codeWrap: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
});

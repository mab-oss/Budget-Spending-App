import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CheckinStatus } from '@/types';

export function StatusBadge({ status }: { status: CheckinStatus }) {
  const theme = useTheme();
  const isWin = status === 'win';
  const color = isWin ? theme.success : theme.danger;
  const background = isWin ? theme.successSoft : theme.dangerSoft;

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Ionicons name={isWin ? 'checkmark-circle' : 'alert-circle'} size={14} color={color} />
      <ThemedText type="label" style={{ color }}>
        {isWin ? 'Under budget' : 'Over budget'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
});

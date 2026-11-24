import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Tone = 'default' | 'success' | 'danger' | 'warning' | 'primary';

export function Card({
  children,
  style,
  tone = 'default',
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: Tone;
}) {
  const theme = useTheme();
  const backgrounds: Record<Tone, string> = {
    default: theme.backgroundElement,
    success: theme.successSoft,
    danger: theme.dangerSoft,
    warning: theme.warningSoft,
    primary: theme.backgroundSelected,
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: backgrounds[tone], borderColor: theme.border },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
});

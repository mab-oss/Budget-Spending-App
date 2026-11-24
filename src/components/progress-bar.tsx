import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Tone = 'primary' | 'success' | 'danger' | 'warning';

export function ProgressBar({
  value,
  tone = 'primary',
  height = 10,
}: {
  value: number;
  tone?: Tone;
  height?: number;
}) {
  const theme = useTheme();
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const colors: Record<Tone, string> = {
    primary: theme.primary,
    success: theme.success,
    danger: theme.danger,
    warning: theme.warning,
  };
  const width = `${clamped * 100}%` as `${number}%`;

  return (
    <View style={[styles.track, { backgroundColor: theme.track, height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width, backgroundColor: colors[tone], borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

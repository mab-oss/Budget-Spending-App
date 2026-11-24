import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { DemoUser } from '@/types';

export function UserChip({ user, onLogout }: { user: DemoUser; onLogout: () => void }) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.avatar, { backgroundColor: user.color }]}>
        <ThemedText type="smallBold" style={styles.avatarText}>
          {user.initials}
        </ThemedText>
      </View>
      <View style={styles.nameWrap}>
        <ThemedText type="smallBold">{user.name}</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          {user.persona}
        </ThemedText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log out"
        onPress={onLogout}
        style={styles.logout}>
        <Ionicons name="log-out-outline" size={18} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
  },
  nameWrap: {
    gap: 0,
  },
  logout: {
    padding: Spacing.one,
  },
});

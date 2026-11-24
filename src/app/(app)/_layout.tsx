import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { UserChip } from '@/components/user-chip';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/store/auth-context';

const NAV_ITEMS = [
  { name: 'home', href: '/home', label: 'Home', icon: 'home-outline' },
  { name: 'history', href: '/history', label: 'History', icon: 'time-outline' },
  { name: 'rewards', href: '/rewards', label: 'Rewards', icon: 'gift-outline' },
  { name: 'settings', href: '/settings', label: 'Settings', icon: 'settings-outline' },
] as const;

export default function AppLayout() {
  const { ready, currentUser } = useAuth();

  if (!ready) {
    return <Loading label="Loading BudgetQuest..." />;
  }

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs style={styles.shell}>
      <TabList asChild>
        <TopNav>
          {NAV_ITEMS.map((item) => (
            <TabTrigger key={item.name} name={item.name} href={item.href} asChild>
              <NavItem label={item.label} icon={item.icon} />
            </TabTrigger>
          ))}
        </TopNav>
      </TabList>
      <TabSlot style={styles.slot} />
    </Tabs>
  );
}

function TopNav({ children, ...props }: TabListProps) {
  const theme = useTheme();
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View
      {...props}
      style={[styles.nav, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={styles.navInner}>
        <View style={styles.brand}>
          <View style={[styles.logo, { backgroundColor: theme.primary }]}>
            <Ionicons name="wallet" size={18} color={theme.primaryText} />
          </View>
          <ThemedText type="smallBold">BudgetQuest</ThemedText>
        </View>

        <View style={styles.links}>{children}</View>

        {currentUser ? <UserChip user={currentUser} onLogout={handleLogout} /> : null}
      </View>
    </View>
  );
}

function NavItem({
  label,
  icon,
  isFocused,
  ...props
}: Omit<TabTriggerSlotProps, 'ref'> & { label: string; icon: keyof typeof Ionicons.glyphMap }) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      style={[styles.navItem, isFocused && { backgroundColor: theme.backgroundSelected }]}>
      <Ionicons
        name={icon}
        size={16}
        color={isFocused ? theme.primary : theme.textSecondary}
      />
      <ThemedText type="smallBold" themeColor={isFocused ? 'text' : 'textSecondary'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  nav: {
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  navInner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: Spacing.three,
    rowGap: Spacing.two,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginRight: 'auto',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
});

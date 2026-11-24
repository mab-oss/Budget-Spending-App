import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Card } from '@/components/card';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/store/auth-context';
import type { DemoUser } from '@/types';

const webCursor =
  Platform.OS === 'web' ? ({ cursor: 'pointer' } as unknown as object) : undefined;

export default function LoginScreen() {
  const theme = useTheme();
  const { ready, currentUser, demoUsers, login, loginAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) {
    return <Loading label="Loading BudgetQuest..." />;
  }

  if (currentUser) {
    return <Redirect href="/" />;
  }

  const handleSubmit = () => {
    setBusy(true);
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? 'Could not sign in.');
      setBusy(false);
    }
  };

  const handleDemo = (user: DemoUser) => {
    setBusy(true);
    const result = loginAs(user.id);
    if (!result.ok) {
      setError(result.error ?? 'Could not sign in.');
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.inner}>
        <View style={styles.brand}>
          <View style={[styles.logo, { backgroundColor: theme.primary }]}>
            <Ionicons name="wallet" size={28} color={theme.primaryText} />
          </View>
          <ThemedText type="heading">BudgetQuest</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.center}>
            Sign in to keep your spending streak alive.
          </ThemedText>
        </View>

        <Card>
          <View style={styles.field}>
            <ThemedText type="label" themeColor="textSecondary">
              Email
            </ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            />
          </View>
          <View style={styles.field}>
            <ThemedText type="label" themeColor="textSecondary">
              Password
            </ThemedText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="demo123"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
              onSubmitEditing={handleSubmit}
            />
          </View>

          {error ? (
            <ThemedText type="small" style={{ color: theme.danger }}>
              {error}
            </ThemedText>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submit,
              {
                backgroundColor: theme.primary,
                opacity: busy ? 0.6 : pressed ? 0.85 : 1,
              },
              webCursor,
            ]}>
            <ThemedText type="smallBold" style={{ color: theme.primaryText }}>
              Sign in
            </ThemedText>
          </Pressable>
        </Card>

        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <ThemedText type="caption" themeColor="textSecondary">
            Demo accounts
          </ThemedText>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
        </View>

        <View style={styles.demoList}>
          {demoUsers.map((user) => (
            <Pressable
              key={user.id}
              accessibilityRole="button"
              onPress={() => handleDemo(user)}
              style={({ pressed }) => [
                styles.demoCard,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                  opacity: pressed ? 0.85 : 1,
                },
                webCursor,
              ]}>
              <View style={[styles.avatar, { backgroundColor: user.color }]}>
                <ThemedText type="smallBold" style={styles.avatarText}>
                  {user.initials}
                </ThemedText>
              </View>
              <View style={styles.demoText}>
                <ThemedText type="smallBold">{user.name}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  {user.email} · {user.persona}
                </ThemedText>
              </View>
              <Ionicons name="arrow-forward" size={18} color={theme.textSecondary} />
            </Pressable>
          ))}
        </View>

        <ThemedText type="caption" themeColor="textSecondary" style={styles.center}>
          Demo only — no real authentication. Data stays in this browser.
        </ThemedText>
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
    maxWidth: 460,
    gap: Spacing.three,
  },
  brand: {
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    minHeight: 46,
  },
  submit: {
    marginTop: Spacing.two,
    minHeight: 46,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  demoList: {
    gap: Spacing.two,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.two,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
  },
  demoText: {
    flex: 1,
    gap: 1,
  },
});

import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Web build is a single-page client app, so the platform color scheme can be
 * read directly without a hydration guard.
 */
export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}

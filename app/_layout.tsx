import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSettingsStore } from '../store/settingsStore';
import { useStreakStore } from '../store/streakStore';
import { useJournalStore } from '../store/journalStore';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userId = useSettingsStore((s) => s.userId);
  const fetchStats = useStreakStore((s) => s.fetchStats);
  const fetchInsight = useJournalStore((s) => s.fetchInsight);

  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchStats(userId);
      fetchInsight(userId);
    }
  }, [isLoggedIn, userId]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0F0F0F" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0F0F0F' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/check-in"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="(modals)/reset-streak"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="(modals)/log-slip"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="(modals)/breathing"
            options={{ presentation: 'fullScreenModal', animation: 'fade' }}
          />
          <Stack.Screen
            name="(modals)/cold-shower"
            options={{ presentation: 'fullScreenModal', animation: 'fade' }}
          />
          <Stack.Screen
            name="(modals)/paywall"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="(modals)/journal-entry"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

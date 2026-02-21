import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function AuthLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  // Already logged in — send straight to the main app
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0D0D0D' },
        animation: 'slide_from_right',
      }}
    />
  );
}

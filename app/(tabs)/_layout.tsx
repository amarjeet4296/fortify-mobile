import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useAuthStore } from '../../store/authStore';

function TabIcon({
  name,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}) {
  return (
    <View className="items-center justify-center pt-1">
      <Ionicons
        name={name}
        size={22}
        color={focused ? '#EC4899' : '#6B7280'}
        style={{
          transform: [{ scale: focused ? 1.05 : 1 }],
        }}
      />
      <View
        style={{
          marginTop: 4,
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: focused ? '#EC4899' : 'transparent',
        }}
      >
      </View>
    </View>
  );
}

export default function TabLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  // Not authenticated — send to login
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopColor: '#2A2A2A',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 12,
          paddingTop: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="heatmap"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'book' : 'book-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="toolkit"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'construct' : 'construct-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'settings' : 'settings-outline'} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

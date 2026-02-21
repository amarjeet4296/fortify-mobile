import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../store/settingsStore';
import { useStreakStore } from '../../store/streakStore';
import { useAuthStore } from '../../store/authStore';
import { StreakType } from '../../types/streak';

const STREAK_TYPE_META: { key: StreakType; icon: string }[] = [
  { key: 'nofap', icon: '💪' },
  { key: 'noporn', icon: '🔒' },
  { key: 'semenretention', icon: '⚡' },
];

export default function SettingsScreen() {
  const {
    userName, userId, memberSince, enabledTypes, activityLabels,
    isPremium, reminderEnabled, reminderTime,
    toggleStreakType, toggleReminder, setPremium, setActivityLabel,
  } = useSettingsStore();

  const [editingKey, setEditingKey] = useState<StreakType | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const { streaks } = useStreakStore();
  const { logout } = useAuthStore();

  const totalDays = Object.values(streaks).reduce((sum, s) => sum + s.totalCleanDays, 0);

  function handleLogout() {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  }

  function handleResetData() {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your streak data, journal entries, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Data Reset', 'All data has been cleared. Restart the app.');
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F0F' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: '#2A2A2A',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#EC489920',
                borderWidth: 2,
                borderColor: '#EC4899',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#EC4899' }}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>{userName}</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Member since {memberSince}</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{totalDays} total clean days</Text>
            </View>
            {isPremium && (
              <View style={{ backgroundColor: '#EAB30820', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ fontSize: 11, color: '#EAB308', fontWeight: '700' }}>PREMIUM 👑</Text>
              </View>
            )}
          </View>
        </View>

        {/* Streak Types */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#9CA3AF', marginBottom: 10, letterSpacing: 0.5 }}>
            ACTIVE STREAK TYPES
          </Text>
          <View style={{ backgroundColor: '#1A1A1A', borderRadius: 16, borderWidth: 1, borderColor: '#2A2A2A' }}>
            {STREAK_TYPE_META.map((t, i) => (
              <View
                key={t.key}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 14,
                  borderBottomWidth: i < STREAK_TYPE_META.length - 1 ? 1 : 0,
                  borderBottomColor: '#2A2A2A',
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 12 }}>{t.icon}</Text>

                {/* Label: inline edit on tap */}
                {editingKey === t.key ? (
                  <TextInput
                    autoFocus
                    value={editingValue}
                    onChangeText={setEditingValue}
                    onBlur={() => {
                      const trimmed = editingValue.trim();
                      if (trimmed) setActivityLabel(t.key, trimmed);
                      setEditingKey(null);
                    }}
                    onSubmitEditing={() => {
                      const trimmed = editingValue.trim();
                      if (trimmed) setActivityLabel(t.key, trimmed);
                      setEditingKey(null);
                    }}
                    style={{
                      flex: 1,
                      fontSize: 15,
                      color: '#FFFFFF',
                      fontWeight: '500',
                      borderBottomWidth: 1,
                      borderBottomColor: '#EC4899',
                      paddingVertical: 2,
                      marginRight: 8,
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      setEditingKey(t.key);
                      setEditingValue(activityLabels[t.key]);
                    }}
                  >
                    <Text style={{ fontSize: 15, color: '#FFFFFF', fontWeight: '500', marginRight: 6 }}>
                      {activityLabels[t.key]}
                    </Text>
                    <Ionicons name="pencil-outline" size={13} color="#6B7280" />
                  </TouchableOpacity>
                )}

                <Switch
                  value={enabledTypes[t.key]}
                  onValueChange={() => toggleStreakType(t.key)}
                  trackColor={{ false: '#3A3A3A', true: '#EC489960' }}
                  thumbColor={enabledTypes[t.key] ? '#EC4899' : '#9CA3AF'}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#9CA3AF', marginBottom: 10, letterSpacing: 0.5 }}>
            NOTIFICATIONS
          </Text>
          <View style={{ backgroundColor: '#1A1A1A', borderRadius: 16, borderWidth: 1, borderColor: '#2A2A2A' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
              <Text style={{ fontSize: 20, marginRight: 12 }}>🔔</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: '#FFFFFF', fontWeight: '500' }}>Daily Reminder</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Check-in at {reminderTime}</Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{ false: '#3A3A3A', true: '#EC489960' }}
                thumbColor={reminderEnabled ? '#EC4899' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        {/* Premium */}
        {!isPremium && (
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => router.push('/(modals)/paywall')}
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: '#EAB30840',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 28, marginRight: 14 }}>👑</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>Fortify Premium</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>AI insights, full heatmap, more</Text>
              </View>
              <Text style={{ color: '#EAB308', fontWeight: '600' }}>Upgrade →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dev: Enable Premium */}
        {__DEV__ && (
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setPremium(!isPremium)}
              style={{ backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#2A2A2A' }}
            >
              <Text style={{ color: '#9CA3AF', textAlign: 'center' }}>
                [DEV] {isPremium ? 'Disable' : 'Enable'} Premium
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Danger Zone */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#9CA3AF', marginBottom: 10, letterSpacing: 0.5 }}>
            DANGER ZONE
          </Text>
          <TouchableOpacity
            onPress={handleResetData}
            style={{
              backgroundColor: '#EF444410',
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: '#EF444430',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, color: '#EF4444', fontWeight: '600' }}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        {/* Log Out */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: '#EF444415',
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: '#EF444450',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14, color: '#EF4444', fontWeight: '600' }}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* App info */}
        <View style={{ paddingHorizontal: 16, alignItems: 'center', paddingBottom: 20 }}>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>Fortify v1.0.0 · Built with ❤️</Text>
          <Text style={{ fontSize: 11, color: '#4B5563', marginTop: 4 }}>User ID: {userId.slice(0, 8)}...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

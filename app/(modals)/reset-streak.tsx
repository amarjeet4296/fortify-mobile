import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useStreakStore } from '../../store/streakStore';
import { useSettingsStore } from '../../store/settingsStore';
import { StreakType } from '../../types/streak';

const STREAK_LABELS: Record<StreakType, string> = {
  nofap: 'NoFap',
  noporn: 'No Porn',
  semenretention: 'Semen Retention',
};

export default function ResetStreakModal() {
  const { streakType } = useLocalSearchParams<{ streakType: StreakType }>();
  const { resetStreak, streaks } = useStreakStore();
  const { userId } = useSettingsStore();
  const [note, setNote] = useState('');
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);

  const type = (streakType || 'nofap') as StreakType;
  const currentStreak = streaks[type]?.currentStreak || 0;

  const handleReset = async () => {
    if (!note.trim()) {
      Alert.alert('Add a reflection', 'Write a short note about what happened. It helps you learn.');
      return;
    }
    setResetting(true);
    await resetStreak(userId, type, note);
    setResetting(false);
    setDone(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F0F' }}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFFFFF' }}>
            {done ? 'Reset Logged' : 'Reset Streak'}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#9CA3AF', fontSize: 18 }}>✕</Text>
            </View>
          </TouchableOpacity>
        </View>

        {done ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>💪</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 10, textAlign: 'center' }}>
              Reset Logged
            </Text>
            <Text style={{ fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22, marginBottom: 30 }}>
              Every master was once a beginner. Use this as fuel, not failure.{'\n\n'}Start fresh today.
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ backgroundColor: '#EC4899', borderRadius: 14, paddingHorizontal: 40, paddingVertical: 14 }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>Start Fresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {/* Warning */}
            <View
              style={{
                backgroundColor: '#EF444415',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: '#EF444430',
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 14, color: '#EF4444', fontWeight: '600', marginBottom: 4 }}>
                Resetting: {STREAK_LABELS[type]}
              </Text>
              <Text style={{ fontSize: 13, color: '#FCA5A5' }}>
                This will reset your {currentStreak}-day streak to 0.
              </Text>
            </View>

            {/* Reflection prompt */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 }}>
              Reflection note (required)
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12, lineHeight: 18 }}>
              What triggered this? What will you do differently? Being honest helps you grow.
            </Text>

            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="I relapsed because... Next time I will..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={6}
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 12,
                padding: 14,
                color: '#FFFFFF',
                fontSize: 14,
                minHeight: 140,
                textAlignVertical: 'top',
                marginBottom: 24,
                borderWidth: 1,
                borderColor: '#2A2A2A',
              }}
            />

            <TouchableOpacity
              onPress={handleReset}
              disabled={resetting}
              style={{
                backgroundColor: '#EF4444',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                opacity: resetting ? 0.7 : 1,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
                {resetting ? 'Resetting...' : 'Reset & Start Fresh'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#9CA3AF' }}>Cancel — I can do this</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStreakStore } from '../../store/streakStore';
import { useSettingsStore } from '../../store/settingsStore';
import { StreakType } from '../../types/streak';
import { todayStr } from '../../utils/dateUtils';
import { CalendarPicker } from '../../components/CalendarPicker';

const STREAK_TYPES: { key: StreakType; label: string; icon: string; color: string }[] = [
  { key: 'nofap', label: 'NoFap', icon: '💪', color: '#EC4899' },
  { key: 'noporn', label: 'No Porn', icon: '🔒', color: '#8B5CF6' },
  { key: 'semenretention', label: 'Semen Retention', icon: '⚡', color: '#3B82F6' },
];

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[date.getDay()]}, ${day}/${month}/${year}`;
}

export default function CheckInModal() {
  const { checkIn, streaks, todayCheckedIn } = useStreakStore();
  const { userId, enabledTypes } = useSettingsStore();
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [showCalendar, setShowCalendar] = useState(false);

  const enabledList = STREAK_TYPES.filter((t) => enabledTypes[t.key]);
  const selectedIsToday = selectedDate === todayStr();

  const handleCheckIn = async () => {
    setChecking(true);
    for (const type of enabledList) {
      await checkIn(userId, type.key, selectedDate);
    }
    setChecking(false);
    setDone(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F0F' }}>
      <View style={{ flex: 1 }}>

        {/* Nav Bar */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ color: '#9CA3AF', fontSize: 20 }}>‹</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 14, marginLeft: 2 }}>Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>
            {done ? 'Well Done! 🎉' : 'Daily Check-In'}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        {done ? (
          // Success state
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 80, marginBottom: 20 }}>🔥</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 10, textAlign: 'center' }}>
              Checked In!
            </Text>
            <Text style={{ fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginBottom: 30 }}>
              Another day of growth. Keep it up!
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {enabledList.map((t) => (
                <View key={t.key} style={{ alignItems: 'center', marginHorizontal: 12 }}>
                  <Text style={{ fontSize: 32, marginBottom: 4 }}>{t.icon}</Text>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: t.color }}>
                    {streaks[t.key].currentStreak}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{t.label}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginTop: 40, backgroundColor: '#22C55E', borderRadius: 14, paddingHorizontal: 40, paddingVertical: 14 }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Form (hidden when calendar is open) */}
            {!showCalendar && (
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Text style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 8, paddingHorizontal: 16, lineHeight: 20 }}>
                  Confirm you stayed clean and log the exact date for this check-in.
                </Text>

                {/* Date Row */}
                <TouchableOpacity
                  onPress={() => setShowCalendar(true)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#2A2A2A',
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: '#6B7280', fontSize: 15 }}>Date</Text>
                  <Text style={{
                    color: '#EC4899',
                    fontSize: 15,
                    textDecorationLine: 'underline',
                    textDecorationColor: '#EC4899',
                  }}>
                    {formatDisplayDate(selectedDate)}
                  </Text>
                </TouchableOpacity>

                {/* Active streaks preview */}
                <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
                  <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
                    Checking in for
                  </Text>
                  {enabledList.map((t) => (
                    <View
                      key={t.key}
                      style={{
                        backgroundColor: '#1A1A1A',
                        borderRadius: 14,
                        padding: 16,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: t.color + '30',
                      }}
                    >
                      <Text style={{ fontSize: 28, marginRight: 14 }}>{t.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>{t.label}</Text>
                        <Text style={{ fontSize: 13, color: '#9CA3AF' }}>
                          Current streak: {streaks[t.key].currentStreak} days
                        </Text>
                      </View>
                      <View style={{
                        width: 24, height: 24, borderRadius: 12,
                        backgroundColor: t.color + '20',
                        borderWidth: 2, borderColor: t.color,
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Text style={{ fontSize: 12, color: t.color }}>✓</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={{ height: 24 }} />
              </ScrollView>
            )}

            {/* Calendar bottom panel */}
            {showCalendar && (
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <CalendarPicker
                  selectedDate={selectedDate}
                  onSelect={(d) => {
                    setSelectedDate(d);
                    setShowCalendar(false);
                  }}
                  onClose={() => setShowCalendar(false)}
                />
              </View>
            )}

            {/* Confirm Button */}
            {!showCalendar && (
              <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }}>
                <TouchableOpacity
                  onPress={handleCheckIn}
                  disabled={checking || (selectedIsToday && todayCheckedIn)}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: selectedIsToday && todayCheckedIn ? '#22C55E' : '#EC4899',
                    borderRadius: 16,
                    paddingVertical: 18,
                    alignItems: 'center',
                    opacity: checking ? 0.7 : 1,
                  }}
                >
                  <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>
                    {checking
                      ? 'Checking in...'
                      : selectedIsToday && todayCheckedIn
                      ? '✓ Already Checked In'
                      : '✓ Confirm Check-In'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

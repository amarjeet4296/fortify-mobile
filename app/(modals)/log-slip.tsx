import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useStreakStore } from '../../store/streakStore';
import { useSettingsStore } from '../../store/settingsStore';
import { StreakType } from '../../types/streak';
import { todayStr } from '../../utils/dateUtils';
import { CalendarPicker } from '../../components/CalendarPicker';

const STREAK_TYPES: { key: StreakType; label: string }[] = [
  { key: 'nofap', label: 'NoFap' },
  { key: 'noporn', label: 'No Porn' },
  { key: 'semenretention', label: 'SR' },
];

const ACTIVITY_OPTIONS = [
  { key: 'porn', label: 'Watched Porn' },
  { key: 'masturbation', label: 'Masturbation' },
  { key: 'edging', label: 'Edging' },
  { key: 'sexual_content', label: 'Explicit Content' },
  { key: 'other', label: 'Other' },
];

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[date.getDay()]}, ${day}/${month}/${year}`;
}

export default function LogSlipModal() {
  const { resetStreak } = useStreakStore();
  const { userId, enabledTypes } = useSettingsStore();
  const { streakType, date } = useLocalSearchParams<{ streakType?: StreakType; date?: string }>();

  const lockedType =
    streakType && ['nofap', 'noporn', 'semenretention'].includes(streakType)
      ? (streakType as StreakType)
      : null;

  const selectedDateFromParam =
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;

  const enabledBySettings = STREAK_TYPES.filter((t) => enabledTypes[t.key]).map((t) => t.key);

  const [selectedDate, setSelectedDate] = useState(selectedDateFromParam || todayStr());
  const [selectedTypes, setSelectedTypes] = useState<StreakType[]>(
    lockedType ? [lockedType] : enabledBySettings,
  );
  const [activityTypes, setActivityTypes] = useState<string[]>(['porn']);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleStreakType = (type: StreakType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleActivity = (key: string) => {
    setActivityTypes((prev) => {
      if (key === 'other') {
        // "Other" is exclusive — selecting it clears everything else
        return ['other'];
      }
      // Selecting a specific activity clears "Other" if present
      const withoutOther = prev.filter((k) => k !== 'other');
      return withoutOther.includes(key)
        ? withoutOther.filter((k) => k !== key)
        : [...withoutOther, key];
    });
  };

  const submit = async () => {
    if (!selectedTypes.length) {
      Alert.alert('Select habits', 'Choose at least one habit to log the slip for.');
      return;
    }
    if (!note.trim()) {
      Alert.alert('Add details', 'Please describe what happened so you can learn from it.');
      return;
    }
    const activityStr = activityTypes.join(',');
    setSaving(true);
    for (const type of selectedTypes) {
      await resetStreak(userId, type, note.trim(), selectedDate, activityStr);
    }
    setSaving(false);
    Alert.alert('Saved', 'Slip was logged and streaks updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleSave = () => {
    const labels = selectedTypes
      .map((t) => STREAK_TYPES.find((s) => s.key === t)?.label)
      .filter(Boolean)
      .join(', ');
    Alert.alert(
      'Reset Streak?',
      `This will reset ${labels || 'selected'} streak(s) to 0. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Reset', style: 'destructive', onPress: submit },
      ],
    );
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
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>Log Slip</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Streak Type Tabs */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#2A2A2A',
        }}>
          {STREAK_TYPES.filter((t) => enabledTypes[t.key]).map((item) => {
            const active = selectedTypes.includes(item.key);
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => toggleStreakType(item.key)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  marginHorizontal: 4,
                  borderWidth: 1.5,
                  borderColor: active ? '#EC4899' : '#2A2A2A',
                  borderRadius: 10,
                  alignItems: 'center',
                  backgroundColor: active ? '#EC489912' : 'transparent',
                }}
              >
                <Text style={{
                  color: active ? '#EC4899' : '#6B7280',
                  fontSize: 13,
                  fontWeight: '600',
                }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Form fields (hidden when calendar is shown) */}
        {!showCalendar && (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* Date Row */}
            <TouchableOpacity
              onPress={() => setShowCalendar(true)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#2A2A2A',
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

            {/* Activity Row */}
            <View style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#2A2A2A',
            }}>
              <Text style={{ color: '#6B7280', fontSize: 15, marginBottom: 12 }}>Activity</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {ACTIVITY_OPTIONS.map((item) => {
                  const active = activityTypes.includes(item.key);
                  return (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => toggleActivity(item.key)}
                      style={{
                        borderWidth: 1,
                        borderColor: active ? '#EC4899' : '#2A2A2A',
                        backgroundColor: active ? '#EC489915' : '#1A1A1A',
                        borderRadius: 10,
                        paddingVertical: 7,
                        paddingHorizontal: 12,
                        marginRight: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{
                        color: active ? '#EC4899' : '#6B7280',
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Note Row */}
            <View style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#2A2A2A',
            }}>
              <Text style={{ color: '#6B7280', fontSize: 15, marginBottom: 12 }}>Note</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="What happened? What will you do differently?"
                placeholderTextColor="#3A3A3A"
                multiline
                numberOfLines={4}
                style={{
                  color: '#FFFFFF',
                  fontSize: 14,
                  minHeight: 90,
                  textAlignVertical: 'top',
                  lineHeight: 20,
                }}
              />
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

        {/* Save Button */}
        {!showCalendar && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={{
                backgroundColor: '#EF4444',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                {saving ? 'Saving...' : 'Save Slip'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

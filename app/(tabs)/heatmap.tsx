import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { HeatmapGrid } from '../../components/HeatmapGrid';
import { useStreakStore } from '../../store/streakStore';
import { useSettingsStore } from '../../store/settingsStore';
import { StreakType, HeatmapEntry } from '../../types/streak';
import { formatDate, todayStr } from '../../utils/dateUtils';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TYPE_COLORS: Record<StreakType, string> = {
  nofap: '#EC4899',
  noporn: '#8B5CF6',
  semenretention: '#3B82F6',
};

export default function HeatmapScreen() {
  const { streaks, fetchHistory } = useStreakStore();
  const { userId, enabledTypes, activityLabels } = useSettingsStore();
  const [activeType, setActiveType] = useState<StreakType>('nofap');
  const [history, setHistory] = useState<HeatmapEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [rangeDays, setRangeDays] = useState<30 | 45 | 365>(30);
  const [loading, setLoading] = useState(false);

  const enabledList = (Object.keys(enabledTypes) as StreakType[]).filter(t => enabledTypes[t]);

  useEffect(() => {
    loadHistory();
  }, [activeType, rangeDays]);

  // Reload fresh data every time screen gains focus (e.g. returning from log-slip)
  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      setLoading(true);
      fetchHistory(userId, activeType, rangeDays).then((data) => {
        if (mounted) { setHistory(data); setLoading(false); }
      });
      return () => { mounted = false; };
    }, [userId, activeType, rangeDays]),
  );

  async function loadHistory() {
    setLoading(true);
    const data = await fetchHistory(userId, activeType, rangeDays);
    setHistory(data);
    setLoading(false);
  }

  const stats = streaks[activeType];
  const cleanCount = history.filter(h => h.status === 'clean').length;
  const resetCount = history.reduce((sum, h) => sum + (h.relapseCount || (h.status === 'reset' ? 1 : 0)), 0);
  const selectedDay = history.find((h) => h.date === selectedDate);
  const selectedRelapses = selectedDay?.relapseCount || (selectedDay?.status === 'reset' ? 1 : 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F0F' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>Progress</Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF' }}>Your journey over time</Text>
        </View>

        {/* Type Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          {enabledList.map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setActiveType(type)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: activeType === type ? TYPE_COLORS[type] + '25' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeType === type ? TYPE_COLORS[type] : '#2A2A2A',
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 13, color: activeType === type ? TYPE_COLORS[type] : '#9CA3AF', fontWeight: '600' }}>
                {activityLabels[type]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Range Selector */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 }}>
          {[
            { label: '1 Month', value: 30 as const },
            { label: '45 Days', value: 45 as const },
            { label: '1 Year', value: 365 as const },
          ].map((item) => {
            const active = rangeDays === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => setRangeDays(item.value)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: active ? '#EC489920' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: active ? '#EC4899' : '#2A2A2A',
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: active ? '#EC4899' : '#9CA3AF', fontWeight: '600' }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats Summary */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 20 }}>
          {[
            { label: 'Current Streak', value: `${stats.currentStreak}d`, color: '#22C55E' },
            { label: 'Best Streak', value: `${stats.bestStreak}d`, color: '#F97316' },
            { label: 'Clean Days', value: `${cleanCount}`, color: '#3B82F6' },
            { label: 'Relapses', value: `${resetCount}`, color: '#EF4444' },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: '#1A1A1A',
                borderRadius: 12,
                padding: 10,
                alignItems: 'center',
                marginHorizontal: 3,
                borderWidth: 1,
                borderColor: '#2A2A2A',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: stat.color }}>{stat.value}</Text>
              <Text style={{ fontSize: 9, color: '#9CA3AF', textAlign: 'center', marginTop: 2 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Heatmap */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 }}>
            Activity Heatmap <Text style={{ fontSize: 11, color: '#EC4899' }}>({rangeDays} days)</Text>
          </Text>
          {loading ? (
            <Text style={{ color: '#9CA3AF', textAlign: 'center', padding: 20 }}>Loading...</Text>
          ) : (
            <HeatmapGrid
              entries={history}
              days={rangeDays}
              onDayPress={(date) => {
                setSelectedDate(date);
              }}
            />
          )}
        </View>

        {/* Day Entry */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: selectedDay?.status === 'reset'
                ? '#EF444440'
                : selectedDay?.status === 'clean'
                ? '#22C55E40'
                : '#2A2A2A',
            }}
          >
            {/* Header row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{
                width: 8, height: 8, borderRadius: 4, marginRight: 8,
                backgroundColor: selectedDay?.status === 'reset'
                  ? '#EF4444'
                  : selectedDay?.status === 'clean'
                  ? '#22C55E'
                  : '#3A3A3A',
              }} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', flex: 1 }}>
                {formatDate(selectedDate)}
              </Text>
              <Text style={{ fontSize: 11, color: '#4B5563' }}>
                {activityLabels[activeType]}
              </Text>
            </View>

            {/* Status */}
            {selectedDay?.status === 'reset' ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, color: '#EF4444', fontWeight: '700' }}>
                    {selectedRelapses} {selectedRelapses === 1 ? 'slip' : 'slips'} recorded
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                  Streak was reset on this day
                </Text>
              </>
            ) : selectedDay?.status === 'clean' ? (
              <>
                <Text style={{ fontSize: 13, color: '#22C55E', fontWeight: '700', marginBottom: 4 }}>
                  Clean day — Day {selectedDay.streakDay}
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>No slips recorded</Text>
              </>
            ) : (
              <Text style={{ fontSize: 13, color: '#3A3A3A' }}>No data for this day</Text>
            )}
          </View>
        </View>

        {/* Legend */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: '#2A2A2A',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 10 }}>Legend</Text>
            {[
              { color: '#1F2937', label: 'No data' },
              { color: '#86EFAC', label: 'Day 1-6 clean' },
              { color: '#22C55E', label: 'Day 7-29 clean' },
              { color: '#16A34A', label: 'Day 30+ clean' },
              { color: '#EF4444', label: 'Reset day' },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <View style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: item.color, marginRight: 10 }} />
                <Text style={{ fontSize: 13, color: '#9CA3AF' }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/(modals)/log-slip',
            params: { streakType: activeType, date: selectedDate },
          })
        }
        activeOpacity={0.9}
        style={{
          position: 'absolute',
          right: 22,
          bottom: 96,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: '#EF4444',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#EF4444',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.45,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

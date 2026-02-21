import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useStreakStore } from '../../store/streakStore';
import { useSettingsStore } from '../../store/settingsStore';
import { StreakType, HeatmapEntry } from '../../types/streak';
import { HeatmapGrid } from '../../components/HeatmapGrid';

const TYPE_META: Record<StreakType, { label: string; icon: string; color: string }> = {
  nofap:          { label: 'NoFap',       icon: '💪', color: '#EC4899' },
  noporn:         { label: 'No Porn',     icon: '🔒', color: '#8B5CF6' },
  semenretention: { label: 'SR',          icon: '⚡', color: '#3B82F6' },
};

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#1A1A1A',
      borderRadius: 14,
      padding: 14,
      alignItems: 'center',
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: '#2A2A2A',
    }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color }}>{value}</Text>
      <Text style={{ fontSize: 10, color: '#6B7280', marginTop: 4, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

function RecentActivity({ history }: { history: HeatmapEntry[] }) {
  const recent = [...history].reverse().slice(0, 14);
  if (!recent.length) return null;

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 }}>
        Recent Activity
      </Text>
      {recent.map((entry) => {
        const isClean = entry.status === 'clean';
        const isReset = entry.status === 'reset';
        if (entry.status === 'empty') return null;

        const [year, month, day] = entry.date.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        return (
          <View
            key={entry.date}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#1E1E1E',
            }}
          >
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: isClean ? '#22C55E' : isReset ? '#EF4444' : '#6B7280',
              marginRight: 12,
            }} />
            <Text style={{ flex: 1, fontSize: 13, color: '#D1D5DB' }}>{label}</Text>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: isClean ? '#22C55E' : isReset ? '#EF4444' : '#6B7280',
            }}>
              {isClean
                ? `Day ${entry.streakDay}`
                : isReset
                ? `Relapse${entry.relapseCount && entry.relapseCount > 1 ? ` ×${entry.relapseCount}` : ''}`
                : 'No data'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function StreakAnalyticsModal() {
  const { streaks, fetchHistory } = useStreakStore();
  const { userId } = useSettingsStore();
  const { streakType } = useLocalSearchParams<{ streakType?: StreakType }>();

  const type: StreakType =
    streakType && ['nofap', 'noporn', 'semenretention'].includes(streakType)
      ? (streakType as StreakType)
      : 'nofap';

  const meta = TYPE_META[type];
  const data = streaks[type];

  const [history, setHistory] = useState<HeatmapEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const h = await fetchHistory(userId, type, 90);
      setHistory(h);
      setLoading(false);
    })();
  }, [type, userId]);

  const relapseCount = history.reduce(
    (sum, d) => sum + (d.relapseCount || (d.status === 'reset' ? 1 : 0)),
    0,
  );
  const cleanCount = history.filter((d) => d.status === 'clean').length;
  const winRate = history.length
    ? Math.round((cleanCount / Math.max(history.filter(d => d.status !== 'empty').length, 1)) * 100)
    : 0;

  // Longest streak inside the fetched window
  let longestRun = 0;
  let run = 0;
  for (const d of history) {
    if (d.status === 'clean') { run++; longestRun = Math.max(longestRun, run); }
    else if (d.status === 'reset') { run = 0; }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F0F' }}>

      {/* Nav */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#9CA3AF', fontSize: 20 }}>‹</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 14, marginLeft: 2 }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>Analytics</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Hero */}
        <View style={{ alignItems: 'center', paddingVertical: 28 }}>
          <Text style={{ fontSize: 44 }}>{meta.icon}</Text>
          <Text style={{ fontSize: 15, color: '#9CA3AF', marginTop: 6, fontWeight: '600' }}>
            {meta.label}
          </Text>
          <Text style={{
            fontSize: 72,
            fontWeight: '800',
            color: data.currentStreak > 0 ? meta.color : '#4B5563',
            lineHeight: 80,
            marginTop: 8,
          }}>
            {data.currentStreak}
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>
            {data.currentStreak === 1 ? 'day' : 'days'} current streak
          </Text>
          {data.currentStreak > 0 && (
            <View style={{
              marginTop: 10,
              paddingHorizontal: 14,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor: meta.color + '20',
              borderWidth: 1,
              borderColor: meta.color + '50',
            }}>
              <Text style={{ fontSize: 12, color: meta.color, fontWeight: '600' }}>
                🔥 Streak active
              </Text>
            </View>
          )}
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 24 }}>
          <StatBox label="Best Streak" value={`${data.bestStreak}d`} color="#F97316" />
          <StatBox label="Total Clean" value={`${data.totalCleanDays}d`} color="#3B82F6" />
          <StatBox label="Win Rate (90d)" value={`${winRate}%`} color={winRate >= 75 ? '#22C55E' : winRate >= 50 ? '#F97316' : '#EF4444'} />
        </View>

        {/* Secondary stats */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 28 }}>
          <StatBox label="Clean Days (90d)" value={`${cleanCount}`} color="#22C55E" />
          <StatBox label="Relapses (90d)" value={`${relapseCount}`} color="#EF4444" />
          <StatBox label="Best Run (90d)" value={`${longestRun}d`} color="#A78BFA" />
        </View>

        {/* Heatmap */}
        <View style={{ paddingHorizontal: 16, marginBottom: 28 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 }}>
            90-Day Heatmap
          </Text>
          {loading ? (
            <Text style={{ color: '#6B7280', textAlign: 'center', padding: 20 }}>Loading...</Text>
          ) : (
            <HeatmapGrid entries={history} days={90} />
          )}
        </View>

        {/* Recent activity */}
        {!loading && <RecentActivity history={history} />}

      </ScrollView>
    </SafeAreaView>
  );
}

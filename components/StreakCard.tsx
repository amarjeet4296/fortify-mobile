import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { StreakType, StreakData, HeatmapEntry } from '../types/streak';
import { StreakColors } from '../constants/colors';
import { router } from 'expo-router';

const STREAK_LABELS: Record<StreakType, string> = {
  nofap: 'NoFap',
  noporn: 'No Porn',
  semenretention: 'SR',
};

const STREAK_ICONS: Record<StreakType, string> = {
  nofap: '💪',
  noporn: '🔒',
  semenretention: '⚡',
};

interface Props {
  type: StreakType;
  data: StreakData;
  relapseCount?: number;
  history?: HeatmapEntry[];
  onViewAnalytics?: () => void;
}

function MiniDots({ history }: { history: HeatmapEntry[] }) {
  // Show last 7 days, oldest → newest left to right
  const last7 = history.slice(-7);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 6 }}>
      {last7.map((entry, i) => {
        const isClean = entry.status === 'clean';
        const isReset = entry.status === 'reset';
        return (
          <View
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              marginRight: 3,
              backgroundColor: isClean ? '#22C55E' : isReset ? '#EF4444' : '#2A2A2A',
            }}
          />
        );
      })}
      {/* Pad remaining dots if less than 7 days of data */}
      {Array.from({ length: Math.max(0, 7 - last7.length) }, (_, i) => (
        <View
          key={`pad-${i}`}
          style={{ width: 7, height: 7, borderRadius: 4, marginRight: 3, backgroundColor: '#1A1A1A' }}
        />
      ))}
    </View>
  );
}

export function StreakCard({ type, data, relapseCount = 0, history = [], onViewAnalytics }: Props) {
  const color = StreakColors[type];
  const isActive = data.currentStreak > 0;

  // Analytics derived from available data
  const winRate = Math.round(Math.max(0, (45 - relapseCount) / 45 * 100));
  const hasHistory = history.length > 0;

  const handleLongPress = () => {
    Alert.alert(
      'Reset Streak?',
      'This will reset your current streak. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () =>
            router.push({
              pathname: '/(modals)/reset-streak',
              params: { streakType: type },
            }),
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      onPress={onViewAnalytics}
      onLongPress={handleLongPress}
      activeOpacity={0.85}
      style={{
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 12,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: isActive ? color + '40' : '#2A2A2A',
      }}
    >
      {/* Header: icon + label + active dot */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ fontSize: 16 }}>{STREAK_ICONS[type]}</Text>
        {isActive && (
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: color }} />
        )}
      </View>

      {/* Current streak */}
      <Text style={{ fontSize: 28, fontWeight: '800', color: isActive ? color : '#6B7280', lineHeight: 32 }}>
        {data.currentStreak}
      </Text>
      <Text style={{ fontSize: 10, color: '#6B7280' }}>days</Text>

      {/* Label */}
      <Text style={{ fontSize: 11, fontWeight: '600', color: '#9CA3AF', marginTop: 2 }}>
        {STREAK_LABELS[type]}
      </Text>

      {/* 7-day dots */}
      {hasHistory && <MiniDots history={history} />}
      {!hasHistory && <View style={{ height: 21 }} />}

      {/* Stats row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#F97316' }}>
            {data.bestStreak}
          </Text>
          <Text style={{ fontSize: 8, color: '#6B7280', marginTop: 1 }}>best</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#3B82F6' }}>
            {data.totalCleanDays}
          </Text>
          <Text style={{ fontSize: 8, color: '#6B7280', marginTop: 1 }}>total</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: 11,
            fontWeight: '700',
            color: winRate >= 80 ? '#22C55E' : winRate >= 50 ? '#F97316' : '#EF4444',
          }}>
            {winRate}%
          </Text>
          <Text style={{ fontSize: 8, color: '#6B7280', marginTop: 1 }}>win</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

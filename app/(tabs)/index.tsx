import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useStreakStore } from '../../store/streakStore';
import { useSettingsStore } from '../../store/settingsStore';
import { StreakCard } from '../../components/StreakCard';
import { CircularProgress } from '../../components/CircularProgress';
import { MilestoneRail } from '../../components/MilestoneCard';
import { QuoteCard } from '../../components/QuoteCard';
import { getNextMilestone } from '../../constants/milestones';
import { StreakType, HeatmapEntry } from '../../types/streak';

export default function HomeScreen() {
  const { streaks, todayCheckedIn, fetchStats, fetchHistory } = useStreakStore();
  const { userId, enabledTypes, isPremium } = useSettingsStore();

  const [refreshing, setRefreshing] = React.useState(false);
  const [relapseCounts, setRelapseCounts] = React.useState<Record<StreakType, number>>({
    nofap: 0,
    noporn: 0,
    semenretention: 0,
  });
  const [historyMap, setHistoryMap] = React.useState<Record<StreakType, HeatmapEntry[]>>({
    nofap: [],
    noporn: [],
    semenretention: [],
  });

  // Primary streak for the progress ring (first enabled type)
  const primaryType: StreakType = enabledTypes.nofap
    ? 'nofap'
    : enabledTypes.noporn
    ? 'noporn'
    : 'semenretention';
  const primaryStreak = streaks[primaryType];
  const nextMilestone = getNextMilestone(primaryStreak.currentStreak);
  const enabledStreakTypes = (Object.keys(enabledTypes) as StreakType[]).filter(
    (t) => enabledTypes[t],
  );

  useEffect(() => {
    fetchStats(userId);
    loadRelapseCounts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchStats(userId);
      loadRelapseCounts();
    }, [userId, enabledTypes.nofap, enabledTypes.noporn, enabledTypes.semenretention]),
  );

  async function loadRelapseCounts() {
    const results = await Promise.all(
      enabledStreakTypes.map(async (type) => {
        const history = await fetchHistory(userId, type, 45);
        const count = history.reduce(
          (sum, day) => sum + (day.relapseCount || (day.status === 'reset' ? 1 : 0)),
          0,
        );
        return { type, count, history } as const;
      }),
    );

    setRelapseCounts((prev) => {
      const next = { ...prev };
      for (const { type, count } of results) next[type] = count;
      return next;
    });
    setHistoryMap((prev) => {
      const next = { ...prev };
      for (const { type, history } of results) next[type] = history;
      return next;
    });
  }

  const handleCheckIn = async () => {
    if (todayCheckedIn) {
      Alert.alert('Already Checked In', 'You have already checked in today. Keep going!');
      return;
    }
    router.push('/(modals)/check-in');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats(userId);
    await loadRelapseCounts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F0F' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EC4899" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#FFFFFF' }}>Fortify</Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#1A1A1A',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#2A2A2A',
              }}
            >
              <Text style={{ fontSize: 18 }}>⚙️</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Streak Cards */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 20 }}>
          {enabledStreakTypes.map((type) => (
            <StreakCard
              key={type}
              type={type}
              data={streaks[type]}
              relapseCount={relapseCounts[type]}
              history={historyMap[type]}
              onViewAnalytics={() =>
                router.push({
                  pathname: '/(modals)/streak-analytics',
                  params: { streakType: type },
                })
              }
            />
          ))}
        </View>

        {/* Progress Ring */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <CircularProgress
            currentDays={primaryStreak.currentStreak}
            nextMilestone={nextMilestone.days}
            size={180}
          />
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
            {primaryStreak.currentStreak > 0
              ? `${nextMilestone.days - primaryStreak.currentStreak} days until ${nextMilestone.label}`
              : 'Start your journey today'}
          </Text>
          <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
            Total clean days: {primaryStreak.totalCleanDays} · Best: {primaryStreak.bestStreak}
          </Text>
        </View>

        {/* Quote */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <QuoteCard />
        </View>

        {/* Milestones */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', paddingHorizontal: 16, marginBottom: 12 }}>
            Milestones
          </Text>
          <MilestoneRail
            currentDays={primaryStreak.currentStreak}
            showBenefits
            isPremium={isPremium}
            onUpgrade={() => router.push('/(modals)/paywall')}
          />
        </View>

      </ScrollView>

      {/* Floating Check-In Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 90,
          left: 16,
          right: 16,
        }}
      >
        <TouchableOpacity
          onPress={handleCheckIn}
          activeOpacity={0.85}
          style={{
            backgroundColor: todayCheckedIn ? '#0D0D0D' : '#0D0D0D',
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            borderWidth: 1.5,
            borderColor: todayCheckedIn ? '#39FF14' : '#00FFFF',
            shadowColor: todayCheckedIn ? '#39FF14' : '#00FFFF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 14,
            elevation: 10,
          }}
        >
          <Ionicons
            name={todayCheckedIn ? 'checkmark-circle' : 'flash'}
            size={20}
            color={todayCheckedIn ? '#39FF14' : '#00FFFF'}
          />
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: todayCheckedIn ? '#39FF14' : '#00FFFF',
            letterSpacing: 0.5,
          }}>
            {todayCheckedIn ? 'Checked In Today' : 'Check In Today'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

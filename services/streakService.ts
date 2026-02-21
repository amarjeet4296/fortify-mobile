import { api } from './api';
import { StreakType, StreakStats, HeatmapEntry, CheckInResponse, ResetResponse } from '../types/streak';
import { todayStr } from '../utils/dateUtils';

export async function checkIn(
  userId: string,
  streakType: StreakType,
  date: string = todayStr(),
): Promise<CheckInResponse> {
  const { data } = await api.post('/streaks/checkin', {
    userId,
    streakType,
    date,
  });
  return data;
}

export async function resetStreak(
  userId: string,
  streakType: StreakType,
  reflectionNote: string,
  date: string = todayStr(),
  activityType: string = 'other',
): Promise<ResetResponse> {
  const { data } = await api.post('/streaks/reset', {
    userId,
    streakType,
    reflectionNote,
    activityType,
    date,
  });
  return data;
}

export async function fetchStats(userId: string): Promise<StreakStats> {
  const { data } = await api.get(`/streaks/stats/${userId}`);
  return data;
}

export async function fetchHistory(
  userId: string,
  type: StreakType,
  days: number = 365,
): Promise<HeatmapEntry[]> {
  const { data } = await api.get(`/streaks/history/${userId}`, {
    params: { type, days },
  });
  return data;
}

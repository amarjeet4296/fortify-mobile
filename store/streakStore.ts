import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StreakType, StreakData, HeatmapEntry } from '../types/streak';
import * as streakService from '../services/streakService';
import { todayStr } from '../utils/dateUtils';

const defaultStreakData: StreakData = {
  currentStreak: 0,
  bestStreak: 0,
  totalCleanDays: 0,
  lastCheckIn: null,
};

interface StreakStoreState {
  streaks: {
    nofap: StreakData;
    noporn: StreakData;
    semenretention: StreakData;
  };
  todayCheckedIn: boolean;
  lastSyncedAt: string | null;
  isLoading: boolean;
  error: string | null;
  checkIn: (userId: string, type: StreakType, date?: string) => Promise<void>;
  resetStreak: (
    userId: string,
    type: StreakType,
    note: string,
    date?: string,
    activityType?: string,
  ) => Promise<void>;
  fetchStats: (userId: string) => Promise<void>;
  fetchHistory: (userId: string, type: StreakType, days?: number) => Promise<HeatmapEntry[]>;
}

export const useStreakStore = create<StreakStoreState>()(
  persist(
    (set, get) => ({
      streaks: {
        nofap: { ...defaultStreakData },
        noporn: { ...defaultStreakData },
        semenretention: { ...defaultStreakData },
      },
      todayCheckedIn: false,
      lastSyncedAt: null,
      isLoading: false,
      error: null,

      checkIn: async (userId, type, date = todayStr()) => {
        set({ isLoading: true, error: null });
        try {
          const isToday = date === todayStr();

          // Optimistic update
          const current = get().streaks[type];
          set((s) => ({
            streaks: {
              ...s.streaks,
              [type]: {
                ...current,
                currentStreak: current.currentStreak + 1,
                totalCleanDays: current.totalCleanDays + 1,
                lastCheckIn: date,
              },
            },
            todayCheckedIn: isToday ? true : s.todayCheckedIn,
          }));

          // Sync with server
          const result = await streakService.checkIn(userId, type, date);
          set((s) => ({
            streaks: {
              ...s.streaks,
              [type]: {
                ...s.streaks[type],
                currentStreak: result.currentStreak,
                totalCleanDays: result.totalCleanDays,
              },
            },
          }));
        } catch (e) {
          // Keep optimistic update on failure
          console.warn('Check-in sync failed, keeping local state');
        } finally {
          set({ isLoading: false });
        }
      },

      resetStreak: async (userId, type, note, date = todayStr(), activityType = 'other') => {
        set({ isLoading: true, error: null });
        try {
          await streakService.resetStreak(userId, type, note, date, activityType);
          await get().fetchStats(userId);
        } catch {
          // Keep existing local state on failure
        } finally {
          set({ isLoading: false });
        }
      },

      fetchStats: async (userId) => {
        try {
          const stats = await streakService.fetchStats(userId);
          const today = todayStr();
          const anyCheckedIn =
            stats.nofap.lastCheckIn === today ||
            stats.noporn.lastCheckIn === today ||
            stats.semenretention.lastCheckIn === today;
          set({
            streaks: {
              nofap: stats.nofap,
              noporn: stats.noporn,
              semenretention: stats.semenretention,
            },
            todayCheckedIn: anyCheckedIn,
            lastSyncedAt: new Date().toISOString(),
          });
        } catch {
          // Keep local state
        }
      },

      fetchHistory: async (userId, type, days = 365) => {
        try {
          return await streakService.fetchHistory(userId, type, days);
        } catch {
          return [];
        }
      },
    }),
    {
      name: 'fortify-streaks',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        streaks: state.streaks,
        todayCheckedIn: state.todayCheckedIn,
        lastSyncedAt: state.lastSyncedAt,
      }),
    },
  ),
);

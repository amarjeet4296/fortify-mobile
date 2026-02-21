import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, WeeklyInsight } from '../types/journal';
import * as journalService from '../services/journalService';
import { todayStr } from '../utils/dateUtils';

interface JournalState {
  todayMood: number;
  todayEnergy: number;
  todayNotes: string;
  todaySaved: boolean;
  entries: Record<string, JournalEntry>;
  latestInsight: WeeklyInsight | null;
  insightLoading: boolean;

  setTodayMood: (v: number) => void;
  setTodayEnergy: (v: number) => void;
  setTodayNotes: (t: string) => void;
  saveEntry: (userId: string) => Promise<void>;
  fetchEntries: (userId: string, from?: string, to?: string) => Promise<void>;
  fetchInsight: (userId: string) => Promise<void>;
  generateInsight: (userId: string) => Promise<void>;
  getEntryForDate: (date: string) => JournalEntry | null;
  deleteEntryForDate: (userId: string, date: string) => Promise<void>;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      todayMood: 5,
      todayEnergy: 5,
      todayNotes: '',
      todaySaved: false,
      entries: {},
      latestInsight: null,
      insightLoading: false,

      setTodayMood: (v) => set({ todayMood: v }),
      setTodayEnergy: (v) => set({ todayEnergy: v }),
      setTodayNotes: (t) => set({ todayNotes: t }),

      saveEntry: async (userId) => {
        const { todayMood, todayNotes } = get();
        const today = todayStr();
        try {
          const entry = await journalService.saveEntry(userId, todayMood, todayMood, todayNotes);
          set((s) => ({
            entries: { ...s.entries, [today]: entry },
            todaySaved: true,
          }));
        } catch {
          // Local save fallback
          const fakeEntry: JournalEntry = {
            id: Date.now().toString(),
            userId,
            date: today,
            mood: todayMood,
            energy: todayMood,
            notes: todayNotes,
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((s) => ({
            entries: { ...s.entries, [today]: fakeEntry },
            todaySaved: true,
          }));
        }
      },

      fetchEntries: async (userId, from, to) => {
        try {
          const entries = await journalService.fetchEntries(userId, from, to);
          const map: Record<string, JournalEntry> = {};
          entries.forEach((e) => { map[e.date] = e; });
          const today = todayStr();
          const todayEntry = map[today];
          set((s) => ({
            entries: { ...s.entries, ...map },
            todayMood: todayEntry?.mood ?? s.todayMood,
            todayEnergy: todayEntry?.mood ?? s.todayEnergy,
            todayNotes: todayEntry?.notes ?? s.todayNotes,
            todaySaved: Boolean(todayEntry),
          }));
        } catch {
          // Keep local
        }
      },

      fetchInsight: async (userId) => {
        try {
          const insight = await journalService.fetchLatestInsight(userId);
          if (insight) set({ latestInsight: insight });
        } catch {}
      },

      generateInsight: async (userId) => {
        set({ insightLoading: true });
        try {
          const insight = await journalService.generateInsight(userId);
          set({ latestInsight: insight });
        } catch {
          set({
            latestInsight: {
              hasInsight: false,
              message: 'Could not reach server. Check your connection and try again.',
            },
          });
        } finally {
          set({ insightLoading: false });
        }
      },

      getEntryForDate: (date) => get().entries[date] || null,

      deleteEntryForDate: async (userId, date) => {
        try {
          await journalService.deleteEntryByDate(userId, date);
        } catch {
          // Keep local behavior if backend is unavailable
        } finally {
          set((s) => {
            const updated = { ...s.entries };
            delete updated[date];
            const isToday = date === todayStr();
            return {
              entries: updated,
              todaySaved: isToday ? false : s.todaySaved,
              todayNotes: isToday ? '' : s.todayNotes,
            };
          });
        }
      },
    }),
    {
      name: 'fortify-journal',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        entries: state.entries,
        latestInsight: state.latestInsight,
        todaySaved: state.todaySaved,
        todayMood: state.todayMood,
        todayEnergy: state.todayEnergy,
        todayNotes: state.todayNotes,
      }),
    },
  ),
);

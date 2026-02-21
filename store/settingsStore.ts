import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

function generateUserId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface EnabledTypes {
  nofap: boolean;
  noporn: boolean;
  semenretention: boolean;
}

export interface ActivityLabels {
  nofap: string;
  noporn: string;
  semenretention: string;
}

interface SettingsState {
  userId: string;
  userName: string;
  memberSince: string;
  enabledTypes: EnabledTypes;
  activityLabels: ActivityLabels;
  isPremium: boolean;
  darkMode: boolean;
  reminderTime: string | null;
  reminderEnabled: boolean;
  hasOnboarded: boolean;
  setUserId: (id: string) => void;
  setUserName: (name: string) => void;
  toggleStreakType: (type: keyof EnabledTypes) => void;
  setActivityLabel: (type: keyof ActivityLabels, label: string) => void;
  setPremium: (value: boolean) => void;
  toggleDarkMode: () => void;
  setReminderTime: (time: string) => void;
  toggleReminder: () => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userId: generateUserId(),
      userName: 'Warrior',
      memberSince: new Date().toISOString().split('T')[0],
      enabledTypes: { nofap: true, noporn: true, semenretention: true },
      activityLabels: { nofap: 'NoFap', noporn: 'No Porn', semenretention: 'Semen Retention' },
      isPremium: false,
      darkMode: true,
      reminderTime: '09:00',
      reminderEnabled: false,
      hasOnboarded: false,

      setUserId: (id) => set({ userId: id }),
      setUserName: (name) => set({ userName: name }),
      toggleStreakType: (type) =>
        set((s) => ({
          enabledTypes: { ...s.enabledTypes, [type]: !s.enabledTypes[type] },
        })),
      setActivityLabel: (type, label) =>
        set((s) => ({
          activityLabels: { ...s.activityLabels, [type]: label },
        })),
      setPremium: (value) => set({ isPremium: value }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setReminderTime: (time) => set({ reminderTime: time }),
      toggleReminder: () => set((s) => ({ reminderEnabled: !s.reminderEnabled })),
      completeOnboarding: () => set({ hasOnboarded: true }),
    }),
    {
      name: 'fortify-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

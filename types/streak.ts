export type StreakType = 'nofap' | 'noporn' | 'semenretention';

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalCleanDays: number;
  lastCheckIn: string | null;
}

export interface StreakStats {
  nofap: StreakData;
  noporn: StreakData;
  semenretention: StreakData;
}

export interface HeatmapEntry {
  date: string;
  status: 'clean' | 'reset' | 'empty';
  streakDay: number;
  relapseCount?: number;
}

export interface CheckInResponse {
  success: boolean;
  currentStreak: number;
  totalCleanDays: number;
  checkInId: string;
  alreadyCheckedIn?: boolean;
}

export interface ResetResponse {
  success: boolean;
  previousStreak: number;
  resetId: string;
}

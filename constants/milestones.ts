import { Ionicons } from '@expo/vector-icons';

export interface Milestone {
  days: number;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  message: string;
  color: string;
}

export const MILESTONES: Milestone[] = [
  { days: 7,   label: '1 Week',   icon: 'leaf-outline', message: 'One week of clarity!',              color: '#86EFAC' },
  { days: 14,  label: '2 Weeks',  icon: 'water-outline', message: 'Two weeks, stronger mind.',         color: '#4ADE80' },
  { days: 30,  label: '1 Month',  icon: 'flame-outline', message: '30 days — a new habit forms.',       color: '#22C55E' },
  { days: 90,  label: '90 Days',  icon: 'flash-outline', message: '90 days — transformation begins.',  color: '#16A34A' },
  { days: 180, label: '6 Months', icon: 'trending-up-outline', message: 'Half a year of mastery.',           color: '#15803D' },
  { days: 365, label: '1 Year',   icon: 'trophy-outline', message: 'One year — you are the 1%.',        color: '#14532D' },
];

export function getNextMilestone(currentDays: number): Milestone {
  return MILESTONES.find(m => m.days > currentDays) || MILESTONES[MILESTONES.length - 1];
}

export function getAchievedMilestones(currentDays: number): Milestone[] {
  return MILESTONES.filter(m => m.days <= currentDays);
}

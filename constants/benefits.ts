export interface Benefit {
  day: number;
  benefit: string;
  category: 'mental' | 'physical' | 'social' | 'spiritual';
  icon: string;
}

export const BENEFITS_TIMELINE: Benefit[] = [
  { day: 1,   benefit: 'Brain fog lifts — mental clarity begins',         category: 'mental',   icon: '🧠' },
  { day: 3,   benefit: 'Testosterone levels start rising naturally',      category: 'physical', icon: '⚡' },
  { day: 5,   benefit: 'Improved motivation and goal-setting ability',    category: 'mental',   icon: '🎯' },
  { day: 7,   benefit: 'Better sleep quality and vivid dreams',           category: 'physical', icon: '💤' },
  { day: 10,  benefit: 'Increased energy throughout the day',             category: 'physical', icon: '🔋' },
  { day: 14,  benefit: 'Deeper voice, stronger eye contact',              category: 'social',   icon: '👁️' },
  { day: 21,  benefit: 'Social confidence improves significantly',        category: 'social',   icon: '🤝' },
  { day: 30,  benefit: 'Peak dopamine receptor restoration',              category: 'mental',   icon: '🎉' },
  { day: 45,  benefit: 'Emotional resilience strengthened',               category: 'mental',   icon: '🛡️' },
  { day: 60,  benefit: 'Creative energy and productivity at its peak',    category: 'mental',   icon: '✨' },
  { day: 90,  benefit: 'Full neurological rebalancing complete',          category: 'physical', icon: '🧬' },
  { day: 120, benefit: 'Deep sense of inner peace and self-respect',      category: 'spiritual',icon: '🕊️' },
  { day: 180, benefit: 'Identity-level transformation achieved',          category: 'spiritual', icon: '🦋' },
  { day: 365, benefit: 'Master of self — permanent rewiring complete',    category: 'spiritual', icon: '👑' },
];

export function getUnlockedBenefits(currentDays: number): Benefit[] {
  return BENEFITS_TIMELINE.filter(b => b.day <= currentDays);
}

export function getNextBenefit(currentDays: number): Benefit | null {
  return BENEFITS_TIMELINE.find(b => b.day > currentDays) || null;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  mood: number;
  energy?: number;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PatternItem {
  pattern: string;
  frequency: 'daily' | 'often' | 'sometimes';
}

export interface WeeklyInsight {
  insightId?: string;
  summary?: string;
  patterns?: PatternItem[];
  recommendations?: string[];
  affirmation?: string;
  moodTrend?: 'improving' | 'declining' | 'stable';
  energyTrend?: 'improving' | 'declining' | 'stable';
  generatedAt?: string;
  hasInsight: boolean;
  message?: string;
}

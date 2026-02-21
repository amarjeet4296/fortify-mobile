import { api } from './api';
import { JournalEntry, WeeklyInsight } from '../types/journal';
import { todayStr, weekStartDate, daysAgo } from '../utils/dateUtils';

export async function saveEntry(
  userId: string,
  mood: number,
  energy: number,
  notes: string,
  tags: string[] = [],
  date?: string,
): Promise<JournalEntry> {
  const { data } = await api.post('/journal/entries', {
    userId,
    date: date || todayStr(),
    mood,
    energy,
    notes,
    tags,
  });
  return data;
}

export async function fetchEntries(
  userId: string,
  fromDate?: string,
  toDate?: string,
): Promise<JournalEntry[]> {
  const { data } = await api.get(`/journal/entries/${userId}`, {
    params: {
      from_date: fromDate || daysAgo(365),
      to_date: toDate || todayStr(),
    },
  });
  return data;
}

export async function fetchEntryByDate(userId: string, date: string): Promise<JournalEntry | null> {
  try {
    const { data } = await api.get(`/journal/entries/${userId}/${date}`);
    return data;
  } catch {
    return null;
  }
}

export async function deleteEntryByDate(userId: string, date: string): Promise<void> {
  await api.delete(`/journal/entries/${userId}/${date}`);
}

export async function generateInsight(userId: string): Promise<WeeklyInsight> {
  const { data } = await api.post('/insights/generate', {
    userId,
    weekStartDate: weekStartDate(),
  });
  return data;
}

export async function fetchLatestInsight(userId: string): Promise<WeeklyInsight | null> {
  try {
    const { data } = await api.get(`/insights/latest/${userId}`);
    return data;
  } catch {
    return null;
  }
}

export async function fetchDailyQuote(date?: string): Promise<{ quote: string; author: string; category: string }> {
  const { data } = await api.get('/quotes/daily', { params: { date } });
  return data;
}

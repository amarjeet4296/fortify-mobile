import { HeatmapEntry } from '../types/streak';
import { Colors } from '../constants/colors';

export function generateHeatmapData(
  serverEntries: HeatmapEntry[],
  days: number = 365,
): HeatmapEntry[] {
  const entryMap = new Map<string, HeatmapEntry>();
  serverEntries.forEach(e => entryMap.set(e.date, e));

  const result: HeatmapEntry[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push(entryMap.get(dateStr) || { date: dateStr, status: 'empty', streakDay: 0 });
  }

  return result;
}

export function getDayColor(entry: HeatmapEntry): string {
  if (entry.status === 'empty') return Colors.heatmapEmpty;
  if (entry.status === 'reset') return Colors.heatmapReset;
  if (entry.streakDay >= 30) return Colors.heatmapClean4;
  if (entry.streakDay >= 14) return Colors.heatmapClean3;
  if (entry.streakDay >= 7) return Colors.heatmapClean2;
  return Colors.heatmapClean1;
}

export function groupByWeek(entries: HeatmapEntry[]): HeatmapEntry[][] {
  const weeks: HeatmapEntry[][] = [];
  let currentWeek: HeatmapEntry[] = [];

  // Pad the start so first day aligns to correct weekday
  const firstDate = new Date(entries[0]?.date + 'T00:00:00');
  const startPad = firstDate.getDay(); // 0=Sun
  for (let i = 0; i < startPad; i++) {
    currentWeek.push({ date: '', status: 'empty', streakDay: 0 });
  }

  entries.forEach(entry => {
    currentWeek.push(entry);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', status: 'empty', streakDay: 0 });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

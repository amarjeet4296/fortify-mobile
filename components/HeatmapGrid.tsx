import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { HeatmapEntry } from '../types/streak';
import { generateHeatmapData, getDayColor, groupByWeek } from '../utils/heatmapUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface Props {
  entries: HeatmapEntry[];
  onDayPress?: (date: string) => void;
  days?: number;
}

export function HeatmapGrid({ entries, onDayPress, days = 365 }: Props) {
  const heatmapData = useMemo(
    () => generateHeatmapData(entries, days),
    [entries, days],
  );
  const weeks = useMemo(() => groupByWeek(heatmapData), [heatmapData]);
  const layout = useMemo(() => {
    const visibleWeeks = Math.max(5, Math.ceil(days / 7));
    const dayLabelWidth = 18;
    const availableWidth = SCREEN_WIDTH - 32 - dayLabelWidth;
    const gap = days <= 45 ? 3 : 2;
    const rawCellSize = Math.floor((availableWidth - (visibleWeeks - 1) * gap) / visibleWeeks);
    const cellSize = Math.max(9, Math.min(days <= 45 ? 16 : 13, rawCellSize));
    return {
      cellSize,
      gap,
      weekWidth: cellSize + gap,
    };
  }, [days]);

  // Month labels positioning
  const monthPositions = useMemo(() => {
    const positions: { label: string; x: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstReal = week.find(d => d.date);
      if (firstReal?.date) {
        const month = new Date(firstReal.date + 'T00:00:00').getMonth();
        if (month !== lastMonth) {
          positions.push({ label: MONTH_LABELS[month], x: wi * layout.weekWidth });
          lastMonth = month;
        }
      }
    });
    return positions;
  }, [weeks, layout.weekWidth]);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Month labels */}
          <View style={{ height: 16, flexDirection: 'row', marginLeft: 20 }}>
            {monthPositions.map((mp, i) => (
              <Text
                key={i}
                style={{
                  position: 'absolute',
                  left: mp.x,
                  fontSize: 9,
                  color: '#9CA3AF',
                }}
              >
                {mp.label}
              </Text>
            ))}
          </View>

          {/* Grid */}
          <View style={{ flexDirection: 'row' }}>
            {/* Day labels */}
            <View style={{ marginRight: 4, justifyContent: 'space-around', height: 7 * (layout.cellSize + layout.gap) }}>
              {DAY_LABELS.map((d, i) => (
                <Text key={i} style={{ fontSize: 8, color: '#6B7280', width: 14, textAlign: 'right' }}>
                  {i % 2 === 1 ? d : ''}
                </Text>
              ))}
            </View>

            {/* Cells */}
            <View style={{ flexDirection: 'row' }}>
              {weeks.map((week, wi) => (
                <View key={wi} style={{ flexDirection: 'column', marginRight: layout.gap }}>
                  {week.map((day, di) => (
                    <TouchableOpacity
                      key={di}
                      onPress={() => day.date && onDayPress?.(day.date)}
                      activeOpacity={day.date ? 0.7 : 1}
                      style={{
                        width: layout.cellSize,
                        height: layout.cellSize,
                        borderRadius: 2,
                        backgroundColor: day.date ? getDayColor(day) : 'transparent',
                        marginBottom: layout.gap,
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Legend */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 20 }}>
            <Text style={{ fontSize: 9, color: '#6B7280', marginRight: 6 }}>Less</Text>
            {['#1F2937', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A'].map((c, i) => (
              <View
                key={i}
                style={{
                  width: layout.cellSize,
                  height: layout.cellSize,
                  borderRadius: 2,
                  backgroundColor: c,
                  marginRight: 2,
                }}
              />
            ))}
            <Text style={{ fontSize: 9, color: '#6B7280', marginLeft: 4 }}>More</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

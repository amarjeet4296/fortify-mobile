import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { todayStr } from '../utils/dateUtils';

interface CalendarPickerProps {
  selectedDate: string; // 'YYYY-MM-DD'
  onSelect: (date: string) => void;
  onClose: () => void;
  accentColor?: string;
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarPicker({ selectedDate, onSelect, onClose, accentColor = '#EC4899' }: CalendarPickerProps) {
  const todayDate = new Date();

  const initYear = selectedDate ? parseInt(selectedDate.split('-')[0]) : todayDate.getFullYear();
  const initMonth = selectedDate ? parseInt(selectedDate.split('-')[1]) - 1 : todayDate.getMonth();

  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const toDateStr = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const isSelected = (day: number | null) => !!day && toDateStr(day) === selectedDate;

  const isToday = (day: number | null) =>
    !!day &&
    day === todayDate.getDate() &&
    viewMonth === todayDate.getMonth() &&
    viewYear === todayDate.getFullYear();

  const isFuture = (day: number | null) => {
    if (!day) return false;
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d > today;
  };

  const handleDayPress = (day: number | null) => {
    if (!day || isFuture(day)) return;
    onSelect(toDateStr(day));
  };

  const goToPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const goToNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onSelect(todayStr());
  };

  const rows = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, (i + 1) * 7));

  return (
    <View style={{ backgroundColor: '#1C1C1E', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 24 }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#2A2A2A',
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Date</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <TouchableOpacity onPress={handleToday}>
            <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Text style={{ color: '#9CA3AF', fontSize: 18, lineHeight: 20 }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Month navigation */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 12,
      }}>
        <TouchableOpacity onPress={goToPrev} style={{ padding: 8 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '600' }}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={goToNext} style={{ padding: 8 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '600' }}>{'›'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 8, marginBottom: 2 }}>
        {DAY_HEADERS.map((d, i) => (
          <Text key={d} style={{
            flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', paddingVertical: 4,
            color: i === 0 ? '#EF4444' : i === 6 ? '#3B82F6' : '#6B7280',
          }}>{d}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', paddingHorizontal: 8, marginBottom: 2 }}>
          {row.map((day, ci) => {
            const sel = isSelected(day);
            const tod = isToday(day);
            const fut = isFuture(day);
            const textColor = !day
              ? 'transparent'
              : fut
              ? '#3A3A3A'
              : sel
              ? '#000000'
              : ci === 0
              ? '#EF444490'
              : ci === 6
              ? '#3B82F690'
              : '#FFFFFF';

            return (
              <TouchableOpacity
                key={ci}
                onPress={() => handleDayPress(day)}
                activeOpacity={day && !fut ? 0.7 : 1}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: sel ? '#FFFFFF' : 'transparent',
                  borderRadius: 4,
                  margin: 2,
                  borderWidth: tod && !sel ? 1 : 0,
                  borderColor: accentColor,
                }}
              >
                <Text style={{ fontSize: 14, color: textColor, fontWeight: sel || tod ? '700' : '400' }}>
                  {day !== null ? String(day) : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

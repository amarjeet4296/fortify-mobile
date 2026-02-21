import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  emoji?: string;
}

function getMoodColor(value: number): string {
  if (value <= 3) return '#EF4444';
  if (value <= 5) return '#F97316';
  if (value <= 7) return '#EAB308';
  return '#22C55E';
}

export function MoodSlider({ label, value, onChange, emoji }: Props) {
  const color = getMoodColor(value);

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {emoji && <Text style={{ fontSize: 18, marginRight: 8 }}>{emoji}</Text>}
          <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: '600' }}>{label}</Text>
        </View>
        <View
          style={{
            backgroundColor: color + '25',
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 14, color, fontWeight: '700' }}>{value}/10</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => {
          const active = score <= value;
          return (
            <TouchableOpacity
              key={score}
              onPress={() => onChange(score)}
              activeOpacity={0.85}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? color : '#2A2A2A',
                borderWidth: 1,
                borderColor: active ? color : '#3A3A3A',
              }}
            >
              <Text style={{ color: active ? '#0F0F0F' : '#9CA3AF', fontSize: 10, fontWeight: '700' }}>
                {score}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 10, color: '#6B7280' }}>Low</Text>
        <Text style={{ fontSize: 10, color: '#6B7280' }}>High</Text>
      </View>
    </View>
  );
}

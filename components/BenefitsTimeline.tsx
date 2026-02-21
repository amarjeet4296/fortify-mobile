import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BENEFITS_TIMELINE } from '../constants/benefits';

interface Props {
  currentDays: number;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export function BenefitsTimeline({ currentDays, isPremium, onUpgrade }: Props) {
  const visible = isPremium ? BENEFITS_TIMELINE : BENEFITS_TIMELINE.slice(0, 5);

  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 }}>
        Benefits Timeline
      </Text>

      {visible.map((benefit) => {
        const unlocked = currentDays >= benefit.day;
        return (
          <View
            key={benefit.day}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              opacity: unlocked ? 1 : 0.45,
            }}
          >
            {/* Day badge */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: unlocked ? '#22C55E20' : '#1A1A1A',
                borderWidth: 1,
                borderColor: unlocked ? '#22C55E60' : '#2A2A2A',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 11, color: unlocked ? '#22C55E' : '#6B7280', fontWeight: '700' }}>
                D{benefit.day}
              </Text>
            </View>

            {/* Icon + text */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Text style={{ fontSize: 16, marginRight: 6 }}>{benefit.icon}</Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: unlocked ? '#FFFFFF' : '#9CA3AF',
                    fontWeight: unlocked ? '500' : '400',
                    flex: 1,
                  }}
                  numberOfLines={2}
                >
                  {benefit.benefit}
                </Text>
              </View>
            </View>

            {/* Status */}
            {unlocked && (
              <Text style={{ fontSize: 16, marginLeft: 8 }}>✓</Text>
            )}
          </View>
        );
      })}

      {!isPremium && (
        <TouchableOpacity
          onPress={onUpgrade}
          style={{
            backgroundColor: '#EC489920',
            borderWidth: 1,
            borderColor: '#EC489960',
            borderRadius: 12,
            padding: 12,
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          <Text style={{ fontSize: 13, color: '#EC4899', fontWeight: '600' }}>
            🔒 Unlock Full Timeline (Premium)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

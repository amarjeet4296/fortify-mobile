import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MILESTONES, Milestone } from '../constants/milestones';
import { BENEFITS_TIMELINE } from '../constants/benefits';

interface Props {
  currentDays: number;
  showBenefits?: boolean;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

function MilestoneItem({
  milestone,
  achieved,
  selected,
  onPress,
}: {
  milestone: Milestone;
  achieved: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: achieved ? '#1A1A1A' : '#111111',
        borderRadius: 12,
        padding: 12,
        marginRight: 10,
        width: 90,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: selected ? milestone.color : achieved ? milestone.color + '60' : '#2A2A2A',
        opacity: achieved ? 1 : 0.5,
      }}
    >
      <Ionicons
        name={milestone.icon}
        size={22}
        color={achieved ? milestone.color : '#6B7280'}
        style={{ marginBottom: 6 }}
      />
      <Text style={{ fontSize: 16, fontWeight: '700', color: achieved ? milestone.color : '#6B7280' }}>
        {milestone.days}
      </Text>
      <Text style={{ fontSize: 9, color: '#9CA3AF', textAlign: 'center', marginTop: 2 }}>
        {milestone.label}
      </Text>
      {achieved && (
        <View
          style={{
            marginTop: 4,
            backgroundColor: milestone.color + '20',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 8, color: milestone.color, fontWeight: '600' }}>DONE</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function MilestoneRail({
  currentDays,
  showBenefits = false,
  isPremium = false,
  onUpgrade,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<number>(MILESTONES[0].days);
  const selectedMilestone = MILESTONES.find((m) => m.days === selectedDay) || MILESTONES[0];
  const visibleTimeline = isPremium ? BENEFITS_TIMELINE : BENEFITS_TIMELINE.slice(0, 5);

  const selectedBenefits = useMemo(() => {
    const idx = MILESTONES.findIndex((m) => m.days === selectedMilestone.days);
    const prevDay = idx > 0 ? MILESTONES[idx - 1].days : 0;
    return visibleTimeline.filter((b) => b.day > prevDay && b.day <= selectedMilestone.days);
  }, [selectedMilestone.days, visibleTimeline]);

  const hasHiddenBenefits = !isPremium && selectedBenefits.length === 0;
  const categoryStyle = (category: string) => {
    if (category === 'physical') return { icon: 'fitness-outline' as const, color: '#3B82F6' };
    if (category === 'social') return { icon: 'people-outline' as const, color: '#A855F7' };
    if (category === 'spiritual') return { icon: 'leaf-outline' as const, color: '#22C55E' };
    return { icon: 'sparkles-outline' as const, color: '#F59E0B' };
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {MILESTONES.map((m) => (
          <MilestoneItem
            key={m.days}
            milestone={m}
            achieved={currentDays >= m.days}
            selected={selectedDay === m.days}
            onPress={() => setSelectedDay(m.days)}
          />
        ))}
      </ScrollView>

      {showBenefits && (
        <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
          <View
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#2A2A2A',
              padding: 12,
            }}
          >
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>
              Benefits at {selectedMilestone.label}
            </Text>
            {selectedBenefits.map((benefit) => (
              <View key={benefit.day} style={{ flexDirection: 'row', marginBottom: 8 }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    marginRight: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: categoryStyle(benefit.category).color + '20',
                  }}
                >
                  <Ionicons
                    name={categoryStyle(benefit.category).icon}
                    size={14}
                    color={categoryStyle(benefit.category).color}
                  />
                </View>
                <Text style={{ color: '#FFFFFF', fontSize: 13, flex: 1 }}>
                  Day {benefit.day}: {benefit.benefit}
                </Text>
              </View>
            ))}
            {hasHiddenBenefits && (
              <View>
                <Text style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>
                  Premium has more benefits in this milestone.
                </Text>
                {onUpgrade && (
                  <TouchableOpacity
                    onPress={onUpgrade}
                    style={{
                      backgroundColor: '#EC489920',
                      borderWidth: 1,
                      borderColor: '#EC489960',
                      borderRadius: 10,
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#EC4899', fontSize: 12, fontWeight: '600' }}>
                      Unlock Full Benefits
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

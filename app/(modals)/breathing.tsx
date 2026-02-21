import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const PHASES: { phase: Phase; duration: number; label: string; instruction: string }[] = [
  { phase: 'inhale', duration: 4000, label: 'Breathe In', instruction: 'Slowly inhale through your nose' },
  { phase: 'hold', duration: 7000, label: 'Hold', instruction: 'Hold your breath gently' },
  { phase: 'exhale', duration: 8000, label: 'Breathe Out', instruction: 'Slowly exhale through your mouth' },
];

const PHASE_COLORS: Record<Phase, string> = {
  idle: '#2A2A2A',
  inhale: '#3B82F6',
  hold: '#8B5CF6',
  exhale: '#22C55E',
};

export default function BreathingModal() {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [phaseLabel, setPhaseLabel] = useState('Tap to Begin');
  const [instruction, setInstruction] = useState('Follow the breathing pattern');
  const [countdown, setCountdown] = useState(0);
  const [cycle, setCycle] = useState(0);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const runCycle = useCallback(() => {
    let phaseIndex = 0;

    const runPhase = () => {
      if (phaseIndex >= PHASES.length) {
        phaseIndex = 0;
        setCycle((c) => c + 1);
      }

      const current = PHASES[phaseIndex];
      setPhase(current.phase);
      setPhaseLabel(current.label);
      setInstruction(current.instruction);
      setCountdown(current.duration / 1000);

      // Animate circle
      if (current.phase === 'inhale') {
        scale.value = withTiming(1.7, { duration: current.duration, easing: Easing.out(Easing.ease) });
        opacity.value = withTiming(1, { duration: current.duration });
      } else if (current.phase === 'hold') {
        // Keep at expanded size
      } else {
        scale.value = withTiming(1, { duration: current.duration, easing: Easing.in(Easing.ease) });
        opacity.value = withTiming(0.6, { duration: current.duration });
      }

      // Countdown timer
      let remaining = current.duration / 1000;
      const interval = setInterval(() => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          phaseIndex += 1;
          if (isRunning) runPhase();
        }
      }, 1000);
    };

    runPhase();
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
    setCycle(0);
  };

  useEffect(() => {
    if (isRunning) {
      runCycle();
    }
  }, [isRunning]);

  const stop = () => {
    setIsRunning(false);
    setPhase('idle');
    setPhaseLabel('Tap to Begin');
    setInstruction('Follow the breathing pattern');
    scale.value = withTiming(1, { duration: 500 });
    opacity.value = withTiming(0.6, { duration: 500 });
    setCycle(0);
  };

  const color = PHASE_COLORS[phase];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050510' }}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>4-7-8 Breathing</Text>
            {cycle > 0 && <Text style={{ fontSize: 13, color: '#9CA3AF' }}>Cycle {cycle} complete</Text>}
          </View>
          <TouchableOpacity onPress={() => { stop(); router.back(); }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#9CA3AF', fontSize: 18 }}>✕</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Breathing Circle */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            style={[
              {
                width: 220,
                height: 220,
                borderRadius: 110,
                backgroundColor: color + '25',
                borderWidth: 2,
                borderColor: color,
                alignItems: 'center',
                justifyContent: 'center',
              },
              animatedCircleStyle,
            ]}
          >
            {/* Inner circle */}
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: color + '15',
                borderWidth: 1,
                borderColor: color + '60',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isRunning ? (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 42, fontWeight: '800', color: '#FFFFFF' }}>{countdown}</Text>
                  <Text style={{ fontSize: 11, color: '#9CA3AF' }}>seconds</Text>
                </View>
              ) : (
                <Text style={{ fontSize: 40 }}>🫁</Text>
              )}
            </View>
          </Animated.View>

          {/* Phase label */}
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#FFFFFF', marginTop: 30, textAlign: 'center' }}>
            {phaseLabel}
          </Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>
            {instruction}
          </Text>
        </View>

        {/* Pattern Guide */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
          {[
            { label: 'Inhale', seconds: 4, color: '#3B82F6' },
            { label: 'Hold', seconds: 7, color: '#8B5CF6' },
            { label: 'Exhale', seconds: 8, color: '#22C55E' },
          ].map((p) => (
            <View key={p.label} style={{ alignItems: 'center', marginHorizontal: 14 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: p.color }}>{p.seconds}s</Text>
              <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{p.label}</Text>
            </View>
          ))}
        </View>

        {/* Control Button */}
        <TouchableOpacity
          onPress={isRunning ? stop : start}
          style={{
            backgroundColor: isRunning ? '#EF4444' : '#EC4899',
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>
            {isRunning ? 'Stop' : 'Start Breathing'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import { formatDuration } from '../../utils/dateUtils';

const DURATION_OPTIONS = [
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
];

const MESSAGES: { threshold: number; message: string }[] = [
  { threshold: 180, message: 'Step in. Feel the cold. Breathe.' },
  { threshold: 120, message: "You're doing great. Don't stop now." },
  { threshold: 60, message: "One more minute. You've got this!" },
  { threshold: 30, message: 'Final 30 seconds. Push through!' },
  { threshold: 10, message: 'Almost there! Finish strong!' },
  { threshold: 0, message: 'DONE! You are a warrior! 🏆' },
];

function getMessage(remaining: number, total: number): string {
  // Adjust thresholds proportionally for non-3min durations
  const ratio = total / 180;
  for (const m of MESSAGES) {
    if (remaining <= Math.round(m.threshold * ratio)) return m.message;
  }
  return MESSAGES[0].message;
}

export default function ColdShowerModal() {
  const [totalSeconds, setTotalSeconds] = useState(180);
  const [remaining, setRemaining] = useState(180);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      soundRef.current?.unloadAsync();
    };
  }, []);

  async function playAlarm() {
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/alarm.wav'),
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.warn('Could not play alarm:', e);
    }
  }

  function selectDuration(seconds: number) {
    if (running) return; // can't change while running
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setDone(false);
  }

  const start = () => {
    if (done) {
      setRemaining(totalSeconds);
      setDone(false);
    }
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          setDone(true);
          playAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    pause();
    setRemaining(totalSeconds);
    setDone(false);
    soundRef.current?.stopAsync();
  };

  const progress = 1 - remaining / totalSeconds;
  const currentMessage = getMessage(remaining, totalSeconds);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#060A1A' }}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>Cold Shower Timer</Text>
          <TouchableOpacity onPress={() => { reset(); router.back(); }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#1A2040', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#9CA3AF', fontSize: 18 }}>✕</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Duration Selector */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          {DURATION_OPTIONS.map((opt) => {
            const active = totalSeconds === opt.seconds;
            return (
              <TouchableOpacity
                key={opt.seconds}
                onPress={() => selectDuration(opt.seconds)}
                disabled={running}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  backgroundColor: active ? '#06B6D430' : '#1A2040',
                  borderWidth: 1,
                  borderColor: active ? '#06B6D4' : '#2A3060',
                  opacity: running ? 0.5 : 1,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: active ? '#06B6D4' : '#6B7280' }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* Timer display */}
          <View
            style={{
              width: 220,
              height: 220,
              borderRadius: 110,
              backgroundColor: done ? '#22C55E20' : '#06B6D420',
              borderWidth: 3,
              borderColor: done ? '#22C55E' : '#06B6D4',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}
          >
            {done ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 64 }}>🏆</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#22C55E' }}>Complete!</Text>
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 52, fontWeight: '800', color: '#FFFFFF', fontVariant: ['tabular-nums'] }}>
                  {formatDuration(remaining)}
                </Text>
                <Text style={{ fontSize: 14, color: '#06B6D4', marginTop: 4 }}>remaining</Text>
              </View>
            )}
          </View>

          {/* Progress bar */}
          <View style={{ width: '80%', height: 6, backgroundColor: '#1A2040', borderRadius: 3, marginBottom: 24 }}>
            <View
              style={{
                width: `${progress * 100}%`,
                height: 6,
                backgroundColor: done ? '#22C55E' : '#06B6D4',
                borderRadius: 3,
              }}
            />
          </View>

          {/* Message */}
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', paddingHorizontal: 20, marginBottom: 40 }}>
            {currentMessage}
          </Text>
        </View>

        {/* Controls */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={reset}
            style={{
              flex: 1,
              backgroundColor: '#1A2040',
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#2A3060',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#9CA3AF' }}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={running ? pause : start}
            style={{
              flex: 2,
              backgroundColor: running ? '#EF4444' : '#06B6D4',
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>
              {done ? 'Start Again' : running ? 'Pause' : 'Start Timer'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
          Cold showers boost willpower, testosterone, and mood ⚡
        </Text>
      </View>
    </SafeAreaView>
  );
}

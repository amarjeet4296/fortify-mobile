import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  currentDays: number;
  nextMilestone: number;
  color?: string;
  size?: number;
}

export function CircularProgress({ currentDays, nextMilestone, color = '#EC4899', size = 160 }: Props) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  const targetProgress = Math.min(currentDays / Math.max(nextMilestone, 1), 1);

  useEffect(() => {
    progress.value = withTiming(targetProgress, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [targetProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2A2A2A"
          strokeWidth={12}
          fill="transparent"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={12}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Center text */}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 36, fontWeight: '800', color: '#FFFFFF' }}>
          {currentDays}
        </Text>
        <Text style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
          {currentDays === 0 ? 'Start today' : `of ${nextMilestone} days`}
        </Text>
      </View>
    </View>
  );
}

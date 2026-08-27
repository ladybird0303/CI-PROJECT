import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import { palette } from '../constants/colors';

type MeterGaugeProps = {
  value: number;
};

export function MeterGauge({ value }: MeterGaugeProps) {
  const radius = 54;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <View style={styles.wrap}>
      <Svg width={140} height={140} viewBox="0 0 140 140">
        <Circle cx="70" cy="70" r={radius} stroke={palette.border} strokeWidth={strokeWidth} fill="transparent" />
        <Circle
          cx="70"
          cy="70"
          r={radius}
          stroke={palette.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 70 70)"
        />
      </Svg>
      <View style={styles.textWrap}>
        <Text variant="headlineMedium" style={styles.value}>
          {value}%
        </Text>
        <Text variant="bodySmall" style={styles.label}>
          Efficiency
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  value: {
    color: palette.text,
    fontWeight: '700',
  },
  label: {
    color: palette.muted,
  },
});

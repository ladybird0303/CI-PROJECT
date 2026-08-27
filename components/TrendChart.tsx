import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { palette } from '../constants/colors';
import { UsagePoint } from '../types/energy';

type TrendChartProps = {
  data: UsagePoint[];
};

export function TrendChart({ data }: TrendChartProps) {
  const width = 300;
  const height = 170;
  const maxValue = Math.max(...data.map((entry) => entry.value)) + 4;
  const minValue = Math.min(...data.map((entry) => entry.value)) - 2;
  const points = data.map((entry, index) => {
    const x = 16 + (index * (width - 32)) / (data.length - 1);
    const y = height - 28 - ((entry.value - minValue) / (maxValue - minValue)) * (height - 56);
    return { x, y, label: entry.label, value: entry.value };
  });

  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <View style={styles.card}>
      <Text variant="titleMedium" style={styles.title}>
        7-day efficiency trend
      </Text>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1="12" y1={height - 24} x2={width - 12} y2={height - 24} stroke={palette.border} />
        <Path d={pathD} fill="none" stroke={palette.primary} strokeWidth="3" strokeLinecap="round" />
        {points.map((point) => (
          <Circle key={point.label} cx={point.x} cy={point.y} r="5" fill={palette.secondary} />
        ))}
      </Svg>
      <View style={styles.labelsRow}>
        {points.map((point) => (
          <Text key={point.label} variant="bodySmall" style={styles.labelText}>
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    color: palette.text,
    marginBottom: 8,
    fontWeight: '700',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  labelText: {
    color: palette.muted,
    fontSize: 10,
  },
});

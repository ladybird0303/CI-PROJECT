import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { palette } from '../constants/colors';

const data = [
  { label: '6AM', value: 1.4 },
  { label: '8AM', value: 2.1 },
  { label: '10AM', value: 1.8 },
  { label: '12PM', value: 2.7 },
  { label: '2PM', value: 2.3 },
  { label: '4PM', value: 3.2 },
  { label: '6PM', value: 2.8 },
  { label: '8PM', value: 2.6 },
];

export function UsageLineChart() {
  const width = 300;
  const height = 170;
  const maxValue = 3.5;
  const minValue = 1.2;
  const points = data.map((point, index) => {
    const x = 16 + (index * (width - 32)) / (data.length - 1);
    const y = height - 24 - ((point.value - minValue) / (maxValue - minValue)) * (height - 48);
    return { ...point, x, y };
  });

  const pathD = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <Card style={styles.card}>
      <Text variant="titleMedium" style={styles.title}>Electricity Usage</Text>
      <Text variant="bodySmall" style={styles.subtitle}>Hourly trend for today</Text>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1="16" y1={height - 24} x2={width - 16} y2={height - 24} stroke={palette.border} />
        <Path d={pathD} fill="none" stroke={palette.primary} strokeWidth="3" strokeLinecap="round" />
        {points.map((point) => (
          <Circle key={point.label} cx={point.x} cy={point.y} r="5" fill={palette.secondary} />
        ))}
      </Svg>
      <View style={styles.labelsRow}>
        {points.map((point) => (
          <Text key={point.label} style={styles.labelText}>{point.label}</Text>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    color: palette.text,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    marginBottom: 8,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  labelText: {
    color: palette.muted,
    fontSize: 10,
  },
});

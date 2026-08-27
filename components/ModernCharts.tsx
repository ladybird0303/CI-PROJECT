import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { palette } from '../constants/colors';

export function PieChartCard() {
  const size = 140;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { value: 38, color: palette.primary },
    { value: 27, color: palette.secondary },
    { value: 20, color: '#F59E0B' },
    { value: 15, color: '#8BC34A' },
  ];

  let offset = 0;
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Usage Mix</Text>
      <View style={styles.chartRow}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={palette.border} strokeWidth="18" fill="none" />
          {segments.map((segment, index) => {
            const dash = (segment.value / 100) * circumference;
            const strokeDasharray = `${dash} ${circumference - dash}`;
            const result = (
              <Circle
                key={segment.color + index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segment.color}
                strokeWidth="18"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
            offset += dash;
            return result;
          })}
        </Svg>
        <View style={styles.legend}>
          {segments.map((segment) => (
            <View key={segment.color} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: segment.color }]} />
              <Text style={styles.legendText}>{Math.round((segment.value / 100) * 100)}%</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

export function BarChartCard() {
  const bars = [42, 60, 54, 72, 66, 78];
  const width = 300;
  const height = 160;
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Weekly Load</Text>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {bars.map((bar, index) => {
          const barWidth = 28;
          const gap = 12;
          const x = 20 + index * (barWidth + gap);
          const y = 140 - bar;
          return <Rect key={index} x={x} y={y} width={barWidth} height={bar} rx={10} fill={index % 2 === 0 ? palette.primary : palette.secondary} />;
        })}
      </Svg>
    </Card>
  );
}

export function LineChartCard() {
  const values = [18, 20, 16, 24, 22, 28, 26];
  const width = 300;
  const height = 160;
  const points = values.map((value, index) => ({
    x: 20 + index * 42,
    y: 140 - value * 4,
  }));
  const pathD = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Trend</Text>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path d={pathD} fill="none" stroke={palette.primary} strokeWidth="3" strokeLinecap="round" />
        {points.map((point) => (
          <Circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="4" fill={palette.secondary} />
        ))}
      </Svg>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 8,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legend: {
    marginLeft: 12,
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    color: palette.muted,
  },
});

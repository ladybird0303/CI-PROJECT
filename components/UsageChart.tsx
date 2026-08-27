import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Line, Rect } from 'react-native-svg';
import { palette } from '../constants/colors';
import { UsagePoint } from '../types/energy';

type UsageChartProps = {
  data: UsagePoint[];
};

export function UsageChart({ data }: UsageChartProps) {
  const width = 300;
  const height = 180;
  const maxValue = Math.max(...data.map((item) => item.value)) + 8;
  const barWidth = 26;
  const gap = 12;
  const chartHeight = 128;

  return (
    <View style={styles.card}>
      <Text variant="titleMedium" style={styles.title}>
        Daily load profile
      </Text>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {data.map((item, index) => {
          const x = 18 + index * (barWidth + gap);
          const barHeight = (item.value / maxValue) * chartHeight;
          const y = height - 34 - barHeight;
          return (
            <React.Fragment key={item.label}>
              <Rect x={x} y={y} width={barWidth} height={barHeight} rx={10} fill={index === data.length - 1 ? palette.primary : palette.secondary} />
              <Line x1={x + barWidth / 2} y1={height - 24} x2={x + barWidth / 2} y2={height - 24} stroke={palette.border} />
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={styles.labelsRow}>
        {data.map((item) => (
          <Text key={item.label} variant="bodySmall" style={styles.labelText}>
            {item.label}
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
    paddingHorizontal: 4,
  },
  labelText: {
    color: palette.muted,
    fontSize: 10,
    width: 26,
    textAlign: 'center',
  },
});

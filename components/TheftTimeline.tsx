import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../constants/colors';

type TimelineItem = {
  time: string;
  title: string;
};

type TheftTimelineProps = {
  items: TimelineItem[];
  alert?: boolean;
};

export function TheftTimeline({ items, alert = false }: TheftTimelineProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Detection Timeline</Text>
      {items.map((item, index) => (
        <View key={item.time} style={styles.row}>
          <View style={[styles.dot, alert ? styles.dotAlert : styles.dotSafe]} />
          <View style={styles.textWrap}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.label}>{item.title}</Text>
          </View>
          {index < items.length - 1 ? <View style={styles.line} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: palette.surface,
    marginBottom: 16,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    color: palette.text,
    fontWeight: '700',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 10,
  },
  dotSafe: {
    backgroundColor: palette.primary,
  },
  dotAlert: {
    backgroundColor: '#D32F2F',
  },
  textWrap: {
    flex: 1,
  },
  time: {
    color: palette.muted,
    fontSize: 12,
  },
  label: {
    color: palette.text,
    fontWeight: '600',
    marginTop: 2,
  },
  line: {
    position: 'absolute',
    left: 5,
    top: 18,
    bottom: -10,
    width: 2,
    backgroundColor: palette.border,
  },
});

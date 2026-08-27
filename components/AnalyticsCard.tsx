import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { palette } from '../constants/colors';

type AnalyticsCardProps = {
  title: string;
  value: string;
  detail: string;
};

export function AnalyticsCard({ title, value, detail }: AnalyticsCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    margin: 4,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    color: palette.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
  },
  detail: {
    color: palette.secondary,
    fontSize: 12,
    marginTop: 4,
  },
});

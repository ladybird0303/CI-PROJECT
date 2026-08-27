import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { palette } from '../constants/colors';

type BillingSummaryCardProps = {
  label: string;
  value: string;
};

export function BillingSummaryCard({ label, value }: BillingSummaryCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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
  label: {
    color: palette.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
  },
});

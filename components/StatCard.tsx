import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../constants/colors';
import { StatItem } from '../types/energy';

type StatCardProps = {
  item: StatItem;
};

export function StatCard({ item }: StatCardProps) {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: item.accent }]}> 
        <MaterialCommunityIcons name={item.icon as never} size={18} color={item.tint} />
      </View>
      <Text variant="bodySmall" style={styles.label}>
        {item.label}
      </Text>
      <Text variant="titleLarge" style={styles.value}>
        {item.value}
      </Text>
      <Text variant="bodySmall" style={styles.detail}>
        {item.detail}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    color: palette.muted,
    marginBottom: 4,
  },
  value: {
    color: palette.text,
    fontWeight: '700',
  },
  detail: {
    color: palette.secondary,
    marginTop: 4,
  },
});

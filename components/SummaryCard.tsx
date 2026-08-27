import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../constants/colors';

type SummaryCardProps = {
  title: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  accent: string;
  badge?: string;
};

export function SummaryCard({ title, value, icon, tint, accent, badge }: SummaryCardProps) {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: accent }]}> 
        <MaterialCommunityIcons name={icon} size={20} color={tint} />
      </View>
      <Text variant="bodySmall" style={styles.title}>{title}</Text>
      <Text variant="titleMedium" style={styles.value}>{value}</Text>
      {badge ? <Text style={[styles.badge, { color: tint }]}>{badge}</Text> : null}
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
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    color: palette.muted,
    marginBottom: 4,
  },
  value: {
    color: palette.text,
    fontWeight: '700',
  },
  badge: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { palette } from '../constants/colors';
import { RecommendationItem } from '../types/energy';

type InsightCardProps = {
  item: RecommendationItem;
};

export function InsightCard({ item }: InsightCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text variant="titleMedium" style={styles.title}>
          {item.title}
        </Text>
        <Chip compact style={styles.chip} textStyle={styles.chipText}>
          {item.chip}
        </Chip>
      </View>
      <Text variant="bodyMedium" style={styles.detail}>
        {item.detail}
      </Text>
      <Text variant="bodySmall" style={styles.impact}>
        {item.impact}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: palette.text,
    flex: 1,
    marginRight: 10,
    fontWeight: '700',
  },
  chip: {
    backgroundColor: palette.accent,
  },
  chipText: {
    color: palette.primary,
  },
  detail: {
    color: palette.muted,
    marginBottom: 8,
    lineHeight: 20,
  },
  impact: {
    color: palette.secondary,
    fontWeight: '600',
  },
});

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Card, Text } from 'react-native-paper';
import { ScreenShell } from '../../components/ScreenShell';
import { InsightCard } from '../../components/InsightCard';
import { palette } from '../../constants/colors';
import { recommendations } from '../../constants/mockData';

export default function InsightsScreen() {
  return (
    <ScreenShell
      title="Insights"
      subtitle="Practical guidance to keep comfort high and costs low."
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600)}>
          <Card style={styles.summaryCard}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Expected savings this month
            </Text>
            <Text variant="headlineSmall" style={styles.savingsValue}>
              $84
            </Text>
            <Text variant="bodyMedium" style={styles.savingsText}>
              Based on the current schedule and three smart recommendations.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(600)}>
          {recommendations.map((item, index) => (
            <InsightCard key={item.title} item={item} />
          ))}
        </Animated.View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: palette.surface,
    marginBottom: 16,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  cardTitle: {
    color: palette.text,
    fontWeight: '700',
    marginBottom: 6,
  },
  savingsValue: {
    color: palette.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  savingsText: {
    color: palette.muted,
  },
});

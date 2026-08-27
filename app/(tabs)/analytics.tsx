import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { AnalyticsCard } from '../../components/AnalyticsCard';
import { BarChartCard, LineChartCard, PieChartCard } from '../../components/ModernCharts';
import { palette } from '../../constants/colors';

export default function AnalyticsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Smart insights and mock performance data.</Text>

      <View style={styles.row}>
        <AnalyticsCard title="Weekly Energy Usage" value="124.8 kWh" detail="+8% vs last week" />
        <AnalyticsCard title="Monthly Usage" value="842.3 kWh" detail="Within target" />
      </View>

      <View style={styles.row}>
        <AnalyticsCard title="Yearly Comparison" value="12.4 MWh" detail="+11% yoy" />
        <AnalyticsCard title="Peak Efficiency" value="96%" detail="Best this quarter" />
      </View>

      <PieChartCard />
      <BarChartCard />
      <LineChartCard />

      <Card style={styles.insightsCard}>
        <Text style={styles.insightTitle}>Consumption Insights</Text>
        <Text style={styles.insightText}>Top Consumption Hours: 6 PM – 9 PM</Text>
        <Text style={styles.insightText}>Highest Daily Consumption: 31.6 kWh</Text>
        <Text style={styles.insightText}>Lowest Daily Consumption: 18.2 kWh</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: palette.background,
  },
  title: {
    color: palette.text,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    marginTop: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  insightsCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  insightTitle: {
    color: palette.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  insightText: {
    color: palette.muted,
    marginBottom: 6,
  },
});

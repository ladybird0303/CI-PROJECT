import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart3, TrendingUp } from 'lucide-react-native';

const hourlyData = [
  { label: '00:00', value: 0.15, cost: 1.28 },
  { label: '04:00', value: 0.10, cost: 0.85 },
  { label: '08:00', value: 0.45, cost: 3.83 },
  { label: '12:00', value: 0.65, cost: 5.53 },
  { label: '16:00', value: 0.50, cost: 4.25 },
  { label: '20:00', value: 0.85, cost: 7.23 },
  { label: 'Now', value: 0.70, cost: 5.95 },
];

const dailyData = [
  { label: 'Mon', value: 4.5, cost: 38.25 },
  { label: 'Tue', value: 5.2, cost: 44.20 },
  { label: 'Wed', value: 4.8, cost: 40.80 },
  { label: 'Thu', value: 6.1, cost: 51.85 },
  { label: 'Fri', value: 5.7, cost: 48.45 },
  { label: 'Sat', value: 7.0, cost: 59.50 },
  { label: 'Sun', value: 6.4, cost: 54.40 },
];

export const UsageChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'hourly' | 'daily'>('hourly');
  const data = timeframe === 'hourly' ? hourlyData : dailyData;
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <BarChart3 size={18} color="#10B981" />
          <Text style={styles.title}>ENERGY CONSUMPTION TRENDS</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, timeframe === 'hourly' && styles.activeTab]}
            onPress={() => setTimeframe('hourly')}
          >
            <Text style={[styles.tabText, timeframe === 'hourly' && styles.activeTabText]}>24h</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, timeframe === 'daily' && styles.activeTab]}
            onPress={() => setTimeframe('daily')}
          >
            <Text style={[styles.tabText, timeframe === 'daily' && styles.activeTabText]}>7 Days</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.unitLegend}>Power Usage ({timeframe === 'hourly' ? 'kW' : 'kWh'})</Text>

      {/* Bar Chart Visualization */}
      <View style={styles.chartArea}>
        {data.map((item, index) => {
          const heightPercent = Math.max(12, Math.round((item.value / maxValue) * 100));
          return (
            <View key={index} style={styles.barColumn}>
              <Text style={styles.barValue}>{item.value}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${heightPercent}%` },
                    index === data.length - 1 && styles.currentBarFill,
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footerSummary}>
        <TrendingUp size={14} color="#3B82F6" />
        <Text style={styles.footerText}>
          Peak usage observed around 20:00 (Evening Grid Pressure). Avg cost ৳4.80/hr.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 6,
    padding: 2,
  },
  tabBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  unitLegend: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 12,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
    paddingBottom: 4,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 100,
    backgroundColor: '#0F172A',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: 7,
  },
  currentBarFill: {
    backgroundColor: '#3B82F6',
  },
  barLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '600',
  },
  footerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 11,
    color: '#93C5FD',
    flex: 1,
  },
});

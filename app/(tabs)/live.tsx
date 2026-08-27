import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { LiveMetricCard } from '../../components/LiveMetricCard';
import { palette } from '../../constants/colors';

const metrics = [
  { label: 'Voltage', value: '230.4', unit: 'V', icon: 'flash', tint: palette.primary },
  { label: 'Current', value: '8.9', unit: 'A', icon: 'current-ac', tint: palette.secondary },
  { label: 'Power', value: '2.43', unit: 'kW', icon: 'lightning-bolt', tint: '#F59E0B' },
  { label: 'Frequency', value: '50.0', unit: 'Hz', icon: 'sine-wave', tint: palette.primary },
  { label: 'Power Factor', value: '0.97', unit: 'PF', icon: 'alpha-p-circle-outline', tint: palette.secondary },
  { label: "Today's Consumption", value: '18.7', unit: 'kWh', icon: 'chart-line', tint: '#2E7D32' },
  { label: 'Monthly Consumption', value: '542.8', unit: 'kWh', icon: 'calendar-month', tint: '#1565C0' },
  { label: 'Estimated Cost', value: '৳1280', unit: 'BDT', icon: 'currency-bdt', tint: '#F59E0B' },
];

export default function LiveMonitoringScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState(metrics);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setItems((current) =>
        current.map((item, index) => {
          if (index === 0) return { ...item, value: (Number(item.value) + 0.1).toFixed(1) };
          if (index === 1) return { ...item, value: (Number(item.value) + 0.1).toFixed(1) };
          if (index === 2) return { ...item, value: (Number(item.value) + 0.02).toFixed(2) };
          return item;
        })
      );
      setRefreshing(false);
    }, 900);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[palette.primary]} tintColor={palette.primary} />}
    >
      <Text variant="headlineSmall" style={styles.title}>Live Monitoring</Text>
      <Text style={styles.subtitle}>Real-time electrical insights with mock updates.</Text>

      {items.map((item, index) => (
        <LiveMetricCard
          key={item.label}
          label={item.label}
          value={item.value}
          unit={item.unit}
          icon={item.icon as never}
          tint={item.tint}
          delay={index * 70}
        />
      ))}

      {refreshing ? (
        <View style={styles.loaderRow}>
          <ActivityIndicator animating color={palette.primary} />
          <Text style={styles.loaderText}>Refreshing live data...</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    color: palette.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: palette.muted,
    marginBottom: 16,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loaderText: {
    color: palette.secondary,
    marginLeft: 8,
  },
});

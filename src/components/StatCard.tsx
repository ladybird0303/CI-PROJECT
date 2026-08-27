import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEnergy } from '../context/EnergyContext';

export const StatCardRow: React.FC = () => {
  const { metrics, settings, relays } = useEnergy();
  const activeRelaysCount = relays.filter((r) => r.isOn && !r.isTrippedByTheft).length;

  return (
    <View style={styles.grid}>
      <View style={styles.card}>
        <Text style={styles.label}>LINE VOLTAGE</Text>
        <Text style={styles.value}>{metrics.voltageV} <Text style={styles.unit}>V</Text></Text>
        <Text style={styles.subtext}>AC 220V Grid</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>LINE CURRENT</Text>
        <Text style={styles.value}>{metrics.currentAmp} <Text style={styles.unit}>A</Text></Text>
        <Text style={styles.subtext}>Ammeter sensor</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>TARIFF RATE</Text>
        <Text style={styles.value}>৳{settings.unitPriceBDT.toFixed(2)}</Text>
        <Text style={styles.subtext}>Per kWh (Tk)</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ACTIVE LOADS</Text>
        <Text style={[styles.value, { color: '#8B5CF6' }]}>
          {activeRelaysCount} / {relays.length}
        </Text>
        <Text style={styles.subtext}>Relay Channels</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  card: {
    backgroundColor: '#1E293B',
    width: '48.5%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 4,
  },
  unit: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  subtext: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});

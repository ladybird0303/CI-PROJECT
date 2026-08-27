import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity, Zap, CreditCard, Clock } from 'lucide-react-native';
import { useEnergy } from '../context/EnergyContext';

export const MeterGauge: React.FC = () => {
  const { metrics, isTheftActive } = useEnergy();

  return (
    <View style={styles.card}>
      {/* Top LCD Simulated Display Banner */}
      <View style={styles.lcdHeader}>
        <View style={styles.lcdDotRow}>
          <View style={[styles.pulseLed, isTheftActive ? styles.pulseLedRed : styles.pulseLedGreen]} />
          <Text style={styles.lcdTitle}>DIGITAL METER READOUT (I2C LCD 16x2)</Text>
        </View>
        <Text style={styles.lcdPulseText}>3200 imp/kWh</Text>
      </View>

      {/* Main Power Reading */}
      <View style={styles.mainReadingContainer}>
        <View style={styles.powerIconCircle}>
          <Zap size={28} color="#3B82F6" />
        </View>
        <View>
          <Text style={styles.label}>LIVE POWER LOAD</Text>
          <View style={styles.valueRow}>
            <Text style={styles.powerValue}>{metrics.currentPowerKw.toFixed(2)}</Text>
            <Text style={styles.powerUnit}>kW</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Secondary Counters (Units kWh and Cost BDT) */}
      <View style={styles.statsRow}>
        <View style={styles.subStat}>
          <View style={styles.subStatHeader}>
            <Activity size={15} color="#10B981" />
            <Text style={styles.subStatLabel}>TOTAL ENERGY</Text>
          </View>
          <Text style={styles.subStatValue}>{metrics.totalConsumptionKWh.toFixed(2)}</Text>
          <Text style={styles.subStatSub}>kWh / Units</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.subStat}>
          <View style={styles.subStatHeader}>
            <CreditCard size={15} color="#F59E0B" />
            <Text style={styles.subStatLabel}>CUMULATIVE COST</Text>
          </View>
          <Text style={[styles.subStatValue, { color: '#F59E0B' }]}>
            ৳{metrics.totalCostBDT.toFixed(2)}
          </Text>
          <Text style={styles.subStatSub}>BDT (Tk)</Text>
        </View>
      </View>

      {/* Footer info */}
      <View style={styles.footerRow}>
        <Clock size={12} color="#64748B" />
        <Text style={styles.footerText}>Last pulse sync: {metrics.lastPulseTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  lcdHeader: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  lcdDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseLed: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pulseLedGreen: {
    backgroundColor: '#10B981',
  },
  pulseLedRed: {
    backgroundColor: '#EF4444',
  },
  lcdTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00F0FF',
    letterSpacing: 0.8,
    fontFamily: 'monospace',
  },
  lcdPulseText: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  mainReadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  powerIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  powerValue: {
    fontSize: 34,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  powerUnit: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  subStat: {
    alignItems: 'center',
    flex: 1,
  },
  subStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  subStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  subStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
  },
  subStatSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    paddingVertical: 6,
    borderRadius: 6,
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wifi, Signal, Cpu, ShieldAlert, ShieldCheck } from 'lucide-react-native';
import { useEnergy } from '../context/EnergyContext';

export const Header: React.FC = () => {
  const { hardware, isTheftActive } = useEnergy();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>PowerShield IoT</Text>
          <Text style={styles.subtitle}>Smart Energy Meter & Theft Security</Text>
        </View>
        <View style={[styles.statusBadge, isTheftActive ? styles.statusAlert : styles.statusOk]}>
          {isTheftActive ? (
            <ShieldAlert size={16} color="#FFFFFF" />
          ) : (
            <ShieldCheck size={16} color="#10B981" />
          )}
          <Text style={[styles.statusText, isTheftActive && styles.statusTextAlert]}>
            {isTheftActive ? 'THEFT ALERT' : 'GRID SECURE'}
          </Text>
        </View>
      </View>

      {/* Hardware Connection Bar */}
      <View style={styles.hardwareBar}>
        <View style={styles.chip}>
          <Wifi size={13} color={hardware.esp8266Connected ? '#10B981' : '#EF4444'} />
          <Text style={styles.chipText}>ESP8266 ({hardware.esp8266Rssi}dBm)</Text>
        </View>

        <View style={styles.chip}>
          <Signal size={13} color={hardware.gsmConnected ? '#3B82F6' : '#EF4444'} />
          <Text style={styles.chipText}>SIM800L ({hardware.gsmSignalPercent}%)</Text>
        </View>

        <View style={styles.chip}>
          <Cpu size={13} color={hardware.optocouplerActive ? '#8B5CF6' : '#EF4444'} />
          <Text style={styles.chipText}>Opto PC817</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusOk: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  statusAlert: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  statusTextAlert: {
    color: '#FFFFFF',
  },
  hardwareBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
});

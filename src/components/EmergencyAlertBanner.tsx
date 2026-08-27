import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertTriangle, Bell, ZapOff, Send, CheckCircle2 } from 'lucide-react-native';
import { useEnergy } from '../context/EnergyContext';

export const EmergencyAlertBanner: React.FC = () => {
  const { isTheftActive, clearTheftAlarm, settings } = useEnergy();

  if (!isTheftActive) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AlertTriangle size={24} color="#FFFFFF" />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>EMERGENCY THEFT DETECTED!</Text>
          <Text style={styles.subtitle}>Line mismatch or unauthorized physical tampering identified.</Text>
        </View>
      </View>

      <View style={styles.actionList}>
        <View style={styles.actionItem}>
          <Bell size={14} color="#FECACA" />
          <Text style={styles.actionText}>Local 5V Buzzer Alarm: ACTIVE</Text>
        </View>
        <View style={styles.actionItem}>
          <ZapOff size={14} color="#FECACA" />
          <Text style={styles.actionText}>4-Channel Relays: POWER CUT OFF</Text>
        </View>
        <View style={styles.actionItem}>
          <Send size={14} color="#FECACA" />
          <Text style={styles.actionText}>GSM SMS Alert sent to {settings.emergencyPhoneNumber}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={clearTheftAlarm} activeOpacity={0.8}>
        <CheckCircle2 size={16} color="#EF4444" />
        <Text style={styles.resetText}>RESET GRID & RESTORE POWER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DC2626',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F87171',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#FEE2E2',
    fontSize: 12,
    marginTop: 2,
  },
  actionList: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    gap: 6,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#FEF2F2',
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  resetText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.3,
  },
});

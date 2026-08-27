import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ShieldAlert, Send, BellRing, Cpu, CheckCircle2, AlertOctagon } from 'lucide-react-native';
import { Header } from '../components/Header';
import { useEnergy } from '../context/EnergyContext';

export const SecurityAlertsScreen: React.FC = () => {
  const { alerts, hardware, resolveAlert, settings, triggerTheftSimulation } = useEnergy();

  const handleTestSms = () => {
    Alert.alert(
      'GSM SIM800L Test Broadcast',
      `Emergency SMS alert queued to ${settings.emergencyPhoneNumber}.\n\nText message: "ALERT: Theft / Line Tampering detected at Smart Energy Meter ID #MTR-2026."`
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Security System Status */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ShieldAlert size={18} color="#EF4444" />
            <Text style={styles.cardTitle}>THEFT DETECTION & SECURITY STATUS</Text>
          </View>

          <View style={styles.sensorGrid}>
            <View style={styles.sensorItem}>
              <Cpu size={16} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.sensorName}>Optocoupler PC817 Isolation</Text>
                <Text style={styles.sensorStatus}>High Voltage Opto Pulse: ACTIVE</Text>
              </View>
            </View>

            <View style={styles.sensorItem}>
              <AlertOctagon size={16} color={hardware.theftSwitchTriggered ? '#EF4444' : '#10B981'} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sensorName}>Meter Box Cover Switch</Text>
                <Text style={[styles.sensorStatus, hardware.theftSwitchTriggered && { color: '#EF4444' }]}>
                  {hardware.theftSwitchTriggered ? 'TAMPERED / OPEN' : 'SECURE (CLOSED)'}
                </Text>
              </View>
            </View>

            <View style={styles.sensorItem}>
              <BellRing size={16} color={hardware.localBuzzerActive ? '#EF4444' : '#64748B'} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sensorName}>Local 5V Buzzer Alarm</Text>
                <Text style={[styles.sensorStatus, hardware.localBuzzerActive && { color: '#EF4444' }]}>
                  {hardware.localBuzzerActive ? 'SOUNDING ALARM' : 'STANDBY'}
                </Text>
              </View>
            </View>
          </View>

          {/* Test SMS Button */}
          <TouchableOpacity style={styles.smsBtn} onPress={handleTestSms} activeOpacity={0.8}>
            <Send size={15} color="#FFFFFF" />
            <Text style={styles.smsBtnText}>TEST GSM SIM800L SMS ALERT BROADCAST</Text>
          </TouchableOpacity>
        </View>

        {/* Security Audit Event Log */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>THEFT INCIDENT AUDIT LOG</Text>
        </View>

        <View style={styles.logList}>
          {alerts.map((alertItem) => (
            <View key={alertItem.id} style={[styles.logCard, !alertItem.resolved && styles.logCardUnresolved]}>
              <View style={styles.logHeader}>
                <View style={styles.logTag}>
                  <AlertOctagon size={14} color={alertItem.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B'} />
                  <Text style={styles.logTypeText}>{alertItem.type.replace('_', ' ')}</Text>
                </View>
                <Text style={styles.logTime}>{alertItem.timestamp}</Text>
              </View>

              <Text style={styles.logLocation}>{alertItem.location}</Text>

              <View style={styles.logDetails}>
                <Text style={styles.logDetailText}>• SMS Dispatch: {alertItem.smsSentTo}</Text>
                <Text style={styles.logDetailText}>
                  • Relay Safety Cutoff: {alertItem.relaysCutoff ? 'EXECUTED' : 'SKIPPED'}
                </Text>
              </View>

              {!alertItem.resolved ? (
                <TouchableOpacity
                  style={styles.resolveBtn}
                  onPress={() => resolveAlert(alertItem.id)}
                >
                  <CheckCircle2 size={14} color="#10B981" />
                  <Text style={styles.resolveBtnText}>MARK RESOLVED</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.resolvedBadge}>
                  <CheckCircle2 size={12} color="#10B981" />
                  <Text style={styles.resolvedBadgeText}>Resolved</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  sensorGrid: {
    gap: 10,
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
  },
  sensorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sensorStatus: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 2,
    fontWeight: '600',
  },
  smsBtn: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    marginTop: 14,
  },
  smsBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  logList: {
    marginHorizontal: 16,
    gap: 10,
  },
  logCard: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  logCardUnresolved: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logTypeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  logTime: {
    fontSize: 10,
    color: '#64748B',
  },
  logLocation: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
  },
  logDetails: {
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    gap: 3,
  },
  logDetailText: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  resolveBtnText: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 11,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  resolvedBadgeText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
});

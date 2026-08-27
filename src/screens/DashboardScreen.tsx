import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldAlert, RefreshCw, Zap } from 'lucide-react-native';
import { Header } from '../components/Header';
import { EmergencyAlertBanner } from '../components/EmergencyAlertBanner';
import { MeterGauge } from '../components/MeterGauge';
import { StatCardRow } from '../components/StatCard';
import { RelayControlSection } from '../components/RelayCard';
import { BudgetProgressBar } from '../components/BudgetProgressBar';
import { useEnergy } from '../context/EnergyContext';

export const DashboardScreen: React.FC = () => {
  const { isTheftActive, triggerTheftSimulation, clearTheftAlarm } = useEnergy();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Emergency Alert Banner if theft triggered */}
        <EmergencyAlertBanner />

        {/* Interactive Theft Simulator Box */}
        <View style={styles.simCard}>
          <View style={styles.simHeader}>
            <Zap size={16} color="#F59E0B" />
            <Text style={styles.simTitle}>THEFT DETECTION HARDWARE SIMULATOR</Text>
          </View>
          <Text style={styles.simDescription}>
            Test the IoT security logic: trigger a simulated wire tamper or cover open event to verify immediate buzzer sound, SMS alert & automatic relay circuit cutoff.
          </Text>

          <View style={styles.simBtnRow}>
            <TouchableOpacity
              style={[styles.simBtn, styles.simBtnRed]}
              onPress={() => triggerTheftSimulation('LINE_MISMATCH')}
              activeOpacity={0.8}
            >
              <ShieldAlert size={14} color="#FFFFFF" />
              <Text style={styles.simBtnText}>SIMULATE THEFT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simBtn, styles.simBtnOrange]}
              onPress={() => triggerTheftSimulation('COVER_OPEN')}
              activeOpacity={0.8}
            >
              <ShieldAlert size={14} color="#FFFFFF" />
              <Text style={styles.simBtnText}>COVER OPEN</Text>
            </TouchableOpacity>

            {isTheftActive && (
              <TouchableOpacity
                style={[styles.simBtn, styles.simBtnGreen]}
                onPress={clearTheftAlarm}
                activeOpacity={0.8}
              >
                <RefreshCw size={14} color="#FFFFFF" />
                <Text style={styles.simBtnText}>CLEAR ALARM</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Live Digital Meter Display */}
        <MeterGauge />

        {/* Key Metrics Cards */}
        <StatCardRow />

        {/* Relay Controls */}
        <RelayControlSection />

        {/* Budget Progress */}
        <BudgetProgressBar />

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
  simCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  simTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  simDescription: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
  simBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  simBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  simBtnRed: {
    backgroundColor: '#DC2626',
  },
  simBtnOrange: {
    backgroundColor: '#D97706',
  },
  simBtnGreen: {
    backgroundColor: '#059669',
  },
  simBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});

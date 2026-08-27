import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldCheck, Zap, AlertTriangle, ShieldAlert } from 'lucide-react-native';
import { Header } from '../components/Header';
import { RelayCard } from '../components/RelayCard';
import { useEnergy } from '../context/EnergyContext';

export const RelayControlScreen: React.FC = () => {
  const { relays, masterPowerToggle, isTheftActive, clearTheftAlarm, settings } = useEnergy();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Relay Circuit Breaker Header */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Zap size={18} color="#3B82F6" />
            <Text style={styles.cardTitle}>4-CHANNEL RELAY CIRCUIT BREAKER CONTROL</Text>
          </View>
          <Text style={styles.cardDesc}>
            Optically isolated 5V relay module driving household dummy loads (Cooling fan, motor, grid lights).
          </Text>

          <View style={styles.masterRow}>
            <TouchableOpacity
              style={[styles.masterBtn, { backgroundColor: '#10B981' }]}
              onPress={() => masterPowerToggle(true)}
            >
              <ShieldCheck size={16} color="#FFFFFF" />
              <Text style={styles.masterBtnText}>RESTORE ALL LINES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.masterBtn, { backgroundColor: '#EF4444' }]}
              onPress={() => masterPowerToggle(false)}
            >
              <Zap size={16} color="#FFFFFF" />
              <Text style={styles.masterBtnText}>EMERGENCY CUTOFF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isTheftActive && (
          <View style={styles.theftBanner}>
            <AlertTriangle size={20} color="#FFFFFF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.theftTitle}>AUTOMATIC RELAY CUTOFF EXECUTED</Text>
              <Text style={styles.theftDesc}>
                Theft switch triggered. Power to all 4 channels automatically disconnected to isolate grid.
              </Text>
            </View>
            <TouchableOpacity style={styles.clearBtn} onPress={clearTheftAlarm}>
              <Text style={styles.clearBtnText}>CLEAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Relay Channel Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>INDIVIDUAL RELAY CHANNELS</Text>
        </View>

        <View style={styles.list}>
          {relays.map((relay) => (
            <RelayCard key={relay.id} relay={relay} />
          ))}
        </View>

        {/* Hardware Pin Specification Table */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ARDUINO INTERFACING PINOUT</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Channel</Text>
              <Text style={styles.tableHeader}>Arduino Pin</Text>
              <Text style={styles.tableHeader}>Load Description</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Relay CH1</Text>
              <Text style={styles.tablePin}>Digital Pin D4</Text>
              <Text style={styles.tableCell}>5V Brushless Fan</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Relay CH2</Text>
              <Text style={styles.tablePin}>Digital Pin D5</Text>
              <Text style={styles.tableCell}>5V DC Toy Motor</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Relay CH3</Text>
              <Text style={styles.tablePin}>Digital Pin D6</Text>
              <Text style={styles.tableCell}>COB LED Strip Grid</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Relay CH4</Text>
              <Text style={styles.tablePin}>Digital Pin D7</Text>
              <Text style={styles.tableCell}>Auxiliary / Spare</Text>
            </View>
          </View>
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
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
  masterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  masterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  masterBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  theftBanner: {
    backgroundColor: '#DC2626',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  theftTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  theftDesc: {
    color: '#FEE2E2',
    fontSize: 11,
    marginTop: 2,
  },
  clearBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearBtnText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 11,
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
  list: {
    marginHorizontal: 16,
    gap: 10,
  },
  table: {
    marginTop: 12,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  tableHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
    flex: 1,
  },
  tableCell: {
    fontSize: 11,
    color: '#CBD5E1',
    flex: 1,
  },
  tablePin: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    flex: 1,
  },
});

import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Fan, Cpu, Lightbulb, Power, AlertTriangle } from 'lucide-react-native';
import { RelayState } from '../types/energy';
import { useEnergy } from '../context/EnergyContext';

export const RelayCard: React.FC<{ relay: RelayState }> = ({ relay }) => {
  const { toggleRelay } = useEnergy();

  const getIcon = () => {
    switch (relay.loadType) {
      case 'fan':
        return <Fan size={20} color={relay.isOn && !relay.isTrippedByTheft ? '#10B981' : '#64748B'} />;
      case 'motor':
        return <Cpu size={20} color={relay.isOn && !relay.isTrippedByTheft ? '#3B82F6' : '#64748B'} />;
      case 'light':
        return <Lightbulb size={20} color={relay.isOn && !relay.isTrippedByTheft ? '#F59E0B' : '#64748B'} />;
      default:
        return <Power size={20} color={relay.isOn && !relay.isTrippedByTheft ? '#8B5CF6' : '#64748B'} />;
    }
  };

  return (
    <View style={[styles.card, relay.isTrippedByTheft && styles.cardTripped]}>
      <View style={styles.leftCol}>
        <View style={[styles.iconCircle, relay.isOn && !relay.isTrippedByTheft && styles.iconCircleActive]}>
          {getIcon()}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{relay.name}</Text>
            {relay.isTrippedByTheft && (
              <View style={styles.trippedBadge}>
                <AlertTriangle size={10} color="#FFFFFF" />
                <Text style={styles.trippedText}>THEFT TRIPPED</Text>
              </View>
            )}
          </View>
          <Text style={styles.pin}>{relay.hardwarePin} • {relay.powerWatts}W Rating</Text>
        </View>
      </View>

      <Switch
        value={relay.isOn && !relay.isTrippedByTheft}
        onValueChange={() => toggleRelay(relay.id)}
        trackColor={{ false: '#334155', true: '#10B981' }}
        thumbColor={relay.isOn && !relay.isTrippedByTheft ? '#FFFFFF' : '#94A3B8'}
        disabled={relay.isTrippedByTheft}
      />
    </View>
  );
};

export const RelayControlSection: React.FC = () => {
  const { relays, masterPowerToggle } = useEnergy();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>4-CHANNEL RELAY CONTROL</Text>
          <Text style={styles.sectionSubtitle}>Automated Circuit Breaker & Appliance Cutoff</Text>
        </View>
        <View style={styles.masterButtonsRow}>
          <TouchableOpacity
            style={[styles.masterBtn, { backgroundColor: '#10B981' }]}
            onPress={() => masterPowerToggle(true)}
          >
            <Text style={styles.masterBtnText}>ALL ON</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.masterBtn, { backgroundColor: '#EF4444' }]}
            onPress={() => masterPowerToggle(false)}
          >
            <Text style={styles.masterBtnText}>OFF</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.list}>
        {relays.map((r) => (
          <RelayCard key={r.id} relay={r} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  masterButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  masterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  masterBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTripped: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  pin: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  trippedBadge: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trippedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});

import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEsp32 } from '../../hooks/useEsp32';
import { getRecentRelayEvents, RelayEvent } from '../../services/firebase';
import { BUZZER, BUTTONS, SENSORS, RELAY_CHANNELS, ESP32_AP } from '../../constants/hardwareConfig';
import { palette } from '../../constants/colors';
import { formatEventTime } from '../../utils/formatters';

export default function TheftScreen() {
  const {
    isConnected,
    power,
    threshold,
    thresholdExceeded,
    buzzerAlert,
    acknowledgeBreach,
  } = useEsp32({ pollIntervalMs: 1500 });

  const [thresholdEvents, setThresholdEvents] = useState<RelayEvent[]>([]);

  const loadEvents = useCallback(async () => {
    try {
      const events = await getRecentRelayEvents(20);
      const filtered = events.filter((e) => e.source === 'threshold');
      setThresholdEvents(filtered);
    } catch {
      /* Firebase optional */
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleAcknowledge = async () => {
    await acknowledgeBreach();
    await loadEvents();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Connection Status Banner */}
        <View style={[styles.banner, isConnected ? styles.bannerOk : styles.bannerBad]}>
          <MaterialCommunityIcons name={isConnected ? 'wifi' : 'wifi-off'} size={18} color="#FFFFFF" />
          <Text style={styles.bannerText}>
            {isConnected ? `ESP32 Connected — Monitoring power breaches` : `ESP32 Disconnected — Connect to "${ESP32_AP.ssid}"`}
          </Text>
        </View>

        <Text variant="headlineSmall" style={styles.title}>Overload & Security Monitor</Text>
        <Text style={styles.subtitle}>
          Hardware power threshold protection via {SENSORS.current.model} & {BUZZER.model}
        </Text>

        {/* Live Security Alarm Status */}
        {thresholdExceeded ? (
          <Card style={styles.dangerCard}>
            <View style={styles.dangerHeader}>
              <MaterialCommunityIcons name="shield-alert" size={32} color="#FFFFFF" />
              <View style={styles.dangerTextContainer}>
                <Text style={styles.dangerTitle}>CRITICAL OVERLOAD BREACH DETECTED</Text>
                <Text style={styles.dangerDetail}>
                  Active Power ({power.toFixed(1)}W) exceeded set threshold ({threshold.toFixed(1)}W).
                </Text>
                <Text style={styles.dangerDetail}>
                  Actions Taken: Relays Cut Off ({RELAY_CHANNELS.length} channels isolated).
                  {buzzerAlert ? ` ${BUZZER.model} sounding via GPIO ${BUZZER.gpio}.` : ''}
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleAcknowledge}
              style={styles.ackBtn}
              buttonColor="#FFFFFF"
              textColor="#D32F2F"
              icon="check-circle"
            >
              ACKNOWLEDGE & RESET CIRCUIT BREAKER
            </Button>
          </Card>
        ) : (
          <Card style={styles.safeCard}>
            <View style={styles.safeHeader}>
              <MaterialCommunityIcons name="shield-check" size={32} color={palette.primary} />
              <View style={styles.safeTextContainer}>
                <Text style={styles.safeTitle}>System Secure & Monitoring</Text>
                <Text style={styles.safeDetail}>
                  Current Load ({power.toFixed(1)}W) is within safe limit ({threshold.toFixed(1)}W). No active breach.
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Security Hardware Topology */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="chip" size={18} color={palette.primary} />
            <Text style={styles.cardTitle}>Protection Circuitry Topology</Text>
          </View>

          <View style={styles.itemRow}>
            <MaterialCommunityIcons name="bullhorn" size={20} color="#F59E0B" />
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{BUZZER.model}</Text>
              <Text style={styles.itemSub}>Driven by {BUZZER.driver} on GPIO {BUZZER.gpio}</Text>
              <Text style={styles.itemDetail}>{BUZZER.wiringNote}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemRow}>
            <MaterialCommunityIcons name="current-ac" size={20} color={palette.secondary} />
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{SENSORS.current.model} Sensor</Text>
              <Text style={styles.itemSub}>GPIO {SENSORS.current.gpio} | Range ±{SENSORS.current.maxRange}A</Text>
              <Text style={styles.itemDetail}>{SENSORS.current.wiringNote}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemRow}>
            <MaterialCommunityIcons name="gesture-tap-button" size={20} color="#9C27B0" />
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>Physical Push Buttons ({BUTTONS.length} Switches)</Text>
              <Text style={styles.itemSub}>
                {BUTTONS.map((b) => `${b.label} (GPIO ${b.gpio})`).join(' • ')}
              </Text>
              <Text style={styles.itemDetail}>Momentary tactile switches for manual hardware input</Text>
            </View>
          </View>
        </Card>

        {/* Threshold Breach Audit History */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="history" size={18} color={palette.primary} />
            <Text style={styles.cardTitle}>Threshold Breach History</Text>
          </View>

          {thresholdEvents.length === 0 ? (
            <Text style={styles.emptyText}>No threshold breach events recorded in database.</Text>
          ) : (
            thresholdEvents.map((ev, index) => (
              <View key={index} style={styles.eventRow}>
                <View style={styles.eventIcon}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color="#D32F2F" />
                </View>
                <View style={styles.eventBody}>
                  <Text style={styles.eventTitle}>Auto Cutoff — {ev.relayName || `Load ${ev.channel}`}</Text>
                  <Text style={styles.eventSub}>
                    Source: {ev.source} • {formatEventTime(ev.timestamp)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: 20, paddingBottom: 32 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8, marginBottom: 16 },
  bannerOk: { backgroundColor: palette.primary },
  bannerBad: { backgroundColor: '#D32F2F' },
  bannerText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', flex: 1 },
  title: { color: palette.text, fontWeight: '700' },
  subtitle: { color: palette.muted, marginTop: 4, marginBottom: 16, fontSize: 12 },
  dangerCard: { borderRadius: 16, padding: 16, backgroundColor: '#D32F2F', marginBottom: 16, elevation: 4 },
  dangerHeader: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  dangerTextContainer: { flex: 1 },
  dangerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  dangerDetail: { color: '#FFCDD2', fontSize: 11, marginTop: 4, lineHeight: 16 },
  ackBtn: { borderRadius: 8 },
  safeCard: { borderRadius: 16, padding: 16, backgroundColor: '#E8F5E9', marginBottom: 16, borderLeftWidth: 4, borderLeftColor: palette.primary },
  safeHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  safeTextContainer: { flex: 1 },
  safeTitle: { color: palette.primary, fontSize: 15, fontWeight: '700' },
  safeDetail: { color: palette.text, fontSize: 11, marginTop: 2 },
  card: { borderRadius: 20, padding: 16, backgroundColor: palette.surface, elevation: 2, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  itemRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  itemText: { flex: 1 },
  itemTitle: { color: palette.text, fontSize: 13, fontWeight: '700' },
  itemSub: { color: palette.secondary, fontSize: 11, marginTop: 1 },
  itemDetail: { color: palette.muted, fontSize: 10, marginTop: 2, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: palette.border, marginVertical: 12 },
  emptyText: { color: palette.muted, fontSize: 12, textAlign: 'center', paddingVertical: 12 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: palette.border },
  eventIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFEBEE', alignItems: 'center', justifyContent: 'center' },
  eventBody: { flex: 1 },
  eventTitle: { color: palette.text, fontSize: 13, fontWeight: '600' },
  eventSub: { color: palette.muted, fontSize: 11, marginTop: 2 },
});

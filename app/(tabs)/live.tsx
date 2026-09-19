import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEsp32 } from '../../hooks/useEsp32';
import { SENSORS, RELAY_CHANNELS, ESP32_AP } from '../../constants/hardwareConfig';
import { palette } from '../../constants/colors';

export default function LiveScreen() {
  const { isConnected, voltage, current, power, relays, uptime, calibrated } = useEsp32({ pollIntervalMs: 1500 });

  const fmtUptime = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m ${s % 60}s`;
  };

  const activeCount = relays.filter(Boolean).length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Connection Banner */}
        <View style={[styles.banner, isConnected ? styles.bannerOk : styles.bannerBad]}>
          <MaterialCommunityIcons name={isConnected ? 'wifi' : 'wifi-off'} size={18} color="#FFF" />
          <Text style={styles.bannerText}>
            {isConnected ? `Connected to "${ESP32_AP.ssid}" — Live data active` : `Disconnected — Connect to "${ESP32_AP.ssid}" WiFi`}
          </Text>
        </View>

        <Text variant="headlineSmall" style={styles.title}>Live Sensor Data</Text>
        <Text style={styles.subtitle}>Real-time readings from {SENSORS.current.model} & {SENSORS.voltage.model}</Text>

        {/* Large Voltage Card */}
        <Card style={styles.metricCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="flash" size={28} color={palette.primary} />
          </View>
          <Text style={styles.metricLabel}>VOLTAGE</Text>
          <Text style={styles.metricValue}>{voltage.toFixed(2)}</Text>
          <Text style={styles.metricUnit}>V</Text>
          <Text style={styles.metricSensor}>{SENSORS.voltage.model} — GPIO {SENSORS.voltage.gpio}</Text>
        </Card>

        {/* Large Current Card */}
        <Card style={styles.metricCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFF8E1' }]}>
            <MaterialCommunityIcons name="current-ac" size={28} color="#F59E0B" />
          </View>
          <Text style={styles.metricLabel}>CURRENT</Text>
          <Text style={styles.metricValue}>{current.toFixed(3)}</Text>
          <Text style={styles.metricUnit}>A</Text>
          <Text style={styles.metricSensor}>{SENSORS.current.model} — GPIO {SENSORS.current.gpio} (max ±{SENSORS.current.maxRange}A)</Text>
        </Card>

        {/* Large Power Card */}
        <Card style={styles.metricCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
            <MaterialCommunityIcons name="lightning-bolt" size={28} color="#D32F2F" />
          </View>
          <Text style={styles.metricLabel}>POWER</Text>
          <Text style={styles.metricValue}>{power.toFixed(2)}</Text>
          <Text style={styles.metricUnit}>W</Text>
          <Text style={styles.metricSensor}>Computed: V × I | Active loads: {activeCount}/{RELAY_CHANNELS.length}</Text>
        </Card>

        {/* Sensor Wiring Info */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information-outline" size={18} color={palette.secondary} />
            <Text style={styles.sectionTitle}>Sensor Wiring Details</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{SENSORS.current.model}</Text>
            <Text style={styles.infoDesc}>{SENSORS.current.description}</Text>
            <Text style={styles.infoWiring}>GPIO {SENSORS.current.gpio} | Range: ±{SENSORS.current.maxRange}{SENSORS.current.unit}</Text>
            <Text style={styles.infoWiring}>{SENSORS.current.wiringNote}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{SENSORS.voltage.model}</Text>
            <Text style={styles.infoDesc}>{SENSORS.voltage.description}</Text>
            <Text style={styles.infoWiring}>GPIO {SENSORS.voltage.gpio} | Range: 0–{SENSORS.voltage.maxRange}{SENSORS.voltage.unit}</Text>
            <Text style={styles.infoWiring}>{SENSORS.voltage.wiringNote}</Text>
          </View>
        </Card>

        {/* ESP32 Status */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="chip" size={18} color={palette.primary} />
            <Text style={styles.sectionTitle}>ESP32 Status</Text>
          </View>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>MCU</Text>
              <Text style={styles.statusValue}>{ESP32_AP.mcu}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Uptime</Text>
              <Text style={styles.statusValue}>{fmtUptime(uptime)}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Calibrated</Text>
              <Text style={[styles.statusValue, { color: calibrated ? palette.primary : '#D32F2F' }]}>
                {calibrated ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>IP Address</Text>
              <Text style={styles.statusValue}>{ESP32_AP.ip}</Text>
            </View>
          </View>
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
  bannerText: { color: '#FFF', fontSize: 12, fontWeight: '600', flex: 1 },
  title: { color: palette.text, fontWeight: '700' },
  subtitle: { color: palette.muted, marginTop: 4, marginBottom: 16, fontSize: 12 },
  metricCard: { borderRadius: 20, padding: 20, backgroundColor: palette.surface, elevation: 2, marginBottom: 12, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  metricLabel: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  metricValue: { color: palette.text, fontSize: 40, fontWeight: '800', marginTop: 4 },
  metricUnit: { color: palette.secondary, fontSize: 16, fontWeight: '600', marginTop: 2 },
  metricSensor: { color: palette.muted, fontSize: 10, marginTop: 8, textAlign: 'center', fontStyle: 'italic' },
  card: { borderRadius: 20, padding: 16, backgroundColor: palette.surface, elevation: 2, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  infoRow: { marginBottom: 8 },
  infoLabel: { color: palette.text, fontSize: 13, fontWeight: '700' },
  infoDesc: { color: palette.muted, fontSize: 11, marginTop: 2 },
  infoWiring: { color: palette.secondary, fontSize: 10, marginTop: 2, fontFamily: 'monospace' },
  divider: { height: 1, backgroundColor: palette.border, marginVertical: 10 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  statusItem: { width: '50%', paddingVertical: 8 },
  statusLabel: { color: palette.muted, fontSize: 10 },
  statusValue: { color: palette.text, fontSize: 13, fontWeight: '700', marginTop: 2 },
});

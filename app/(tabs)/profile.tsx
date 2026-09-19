import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  RELAY_CHANNELS,
  SENSORS,
  BUZZER,
  BUTTONS,
  DISPLAY,
  POWER_SUPPLY,
  ESP32_AP,
  TARIFF_DEFAULTS,
  THRESHOLD_DEFAULTS,
} from '../../constants/hardwareConfig';
import { useEsp32 } from '../../hooks/useEsp32';
import { getDatabaseStats } from '../../services/firebase';
import { palette } from '../../constants/colors';
import { formatUptime } from '../../utils/formatters';

export default function ProfileScreen() {
  const { isConnected, uptime } = useEsp32();
  const [dbStats, setDbStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getDatabaseStats();
        setDbStats(stats);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="headlineSmall" style={styles.title}>System Architecture & Profile</Text>
        <Text style={styles.subtitle}>
          Hardware topology & configuration derived from connections_2.pdf
        </Text>

        {/* ESP32 Controller Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="chip" size={20} color={palette.primary} />
            <Text style={styles.cardTitle}>Microcontroller Board</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>MCU Model:</Text>
            <Text style={styles.value}>{ESP32_AP.mcu}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>WiFi AP SSID:</Text>
            <Text style={styles.value}>{ESP32_AP.ssid}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>AP IP Address:</Text>
            <Text style={styles.value}>{ESP32_AP.ip}:{ESP32_AP.port}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, { color: isConnected ? palette.primary : '#D32F2F' }]}>
              {isConnected ? `Online (${formatUptime(uptime)})` : 'Offline'}
            </Text>
          </View>
        </Card>

        {/* Relay Module Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="power-socket-uk" size={20} color={palette.primary} />
            <Text style={styles.cardTitle}>4-Channel 5V Relay Board ({RELAY_CHANNELS.length} Active)</Text>
          </View>
          {RELAY_CHANNELS.map((ch) => (
            <View key={ch.channel} style={styles.subBlock}>
              <Text style={styles.subTitle}>Channel {ch.channel} ({ch.relayPin}) — GPIO {ch.gpio}</Text>
              <Text style={styles.subText}>Load: {ch.loadName} ({ch.loadSpec})</Text>
              <Text style={styles.subNote}>Contact Used: {ch.contactUsed} (Normally Open)</Text>
            </View>
          ))}
        </Card>

        {/* Sensors Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="gauge" size={20} color={palette.secondary} />
            <Text style={styles.cardTitle}>Sensor Modules</Text>
          </View>
          <View style={styles.subBlock}>
            <Text style={styles.subTitle}>{SENSORS.current.model} (Current Sensor)</Text>
            <Text style={styles.subText}>GPIO {SENSORS.current.gpio} • Max Range: ±{SENSORS.current.maxRange}{SENSORS.current.unit}</Text>
            <Text style={styles.subNote}>{SENSORS.current.wiringNote}</Text>
          </View>
          <View style={styles.subBlock}>
            <Text style={styles.subTitle}>{SENSORS.voltage.model} (Voltage Sensor)</Text>
            <Text style={styles.subText}>GPIO {SENSORS.voltage.gpio} • Max Range: 0–{SENSORS.voltage.maxRange}{SENSORS.voltage.unit}</Text>
            <Text style={styles.subNote}>{SENSORS.voltage.wiringNote}</Text>
          </View>
        </Card>

        {/* Buzzer & Buttons Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="bullhorn" size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>Alarm & Tactile Inputs</Text>
          </View>
          <View style={styles.subBlock}>
            <Text style={styles.subTitle}>{BUZZER.model}</Text>
            <Text style={styles.subText}>GPIO {BUZZER.gpio} via {BUZZER.driver}</Text>
            <Text style={styles.subNote}>{BUZZER.wiringNote}</Text>
          </View>
          <View style={styles.subBlock}>
            <Text style={styles.subTitle}>Tactile Push Buttons ({BUTTONS.length} Switches)</Text>
            <Text style={styles.subText}>
              {BUTTONS.map((b) => `${b.label}: GPIO ${b.gpio}`).join(' | ')}
            </Text>
          </View>
        </Card>

        {/* Display & Power Supply Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="television" size={20} color="#9C27B0" />
            <Text style={styles.cardTitle}>Display & Power Architecture</Text>
          </View>
          <View style={styles.subBlock}>
            <Text style={styles.subTitle}>{DISPLAY.model}</Text>
            <Text style={styles.subText}>I2C Address: {DISPLAY.i2cAddress} ({DISPLAY.columns}×{DISPLAY.rows} chars)</Text>
            <Text style={styles.subNote}>{DISPLAY.wiringNote}</Text>
          </View>
          <View style={styles.subBlock}>
            <Text style={styles.subTitle}>Power Supply</Text>
            <Text style={styles.subText}>{POWER_SUPPLY.adapter}</Text>
            <Text style={styles.subNote}>Buck 1: {POWER_SUPPLY.buckConverter1.model} ({POWER_SUPPLY.buckConverter1.inputV}V → {POWER_SUPPLY.buckConverter1.outputV}V for {POWER_SUPPLY.buckConverter1.purpose})</Text>
            <Text style={styles.subNote}>Buck 2: {POWER_SUPPLY.buckConverter2.model} ({POWER_SUPPLY.buckConverter2.inputV}V → {POWER_SUPPLY.buckConverter2.outputV}V for {POWER_SUPPLY.buckConverter2.purpose})</Text>
          </View>
        </Card>

        {/* Tariff & Threshold Config */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="cog" size={20} color={palette.primary} />
            <Text style={styles.cardTitle}>System Defaults</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tariff Rate:</Text>
            <Text style={styles.value}>{TARIFF_DEFAULTS.currency}{TARIFF_DEFAULTS.unitPriceBDT.toFixed(2)} / kWh ({TARIFF_DEFAULTS.currencyCode})</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Threshold Range:</Text>
            <Text style={styles.value}>{THRESHOLD_DEFAULTS.minWatts}W — {THRESHOLD_DEFAULTS.maxWatts}W (Default {THRESHOLD_DEFAULTS.defaultWatts}W)</Text>
          </View>
        </Card>

        {/* Firestore Database Stats */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="database" size={20} color={palette.secondary} />
            <Text style={styles.cardTitle}>Firebase Firestore Statistics</Text>
          </View>
          {dbStats ? (
            Object.entries(dbStats).map(([col, count]) => (
              <View key={col} style={styles.infoRow}>
                <Text style={styles.label}>{col}:</Text>
                <Text style={styles.value}>{count} documents</Text>
              </View>
            ))
          ) : (
            <Text style={styles.subNote}>Loading collection statistics...</Text>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: 20, paddingBottom: 32 },
  title: { color: palette.text, fontWeight: '700' },
  subtitle: { color: palette.muted, marginTop: 4, marginBottom: 16, fontSize: 12 },
  card: { borderRadius: 20, padding: 16, backgroundColor: palette.surface, elevation: 2, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { color: palette.muted, fontSize: 12 },
  value: { color: palette.text, fontSize: 12, fontWeight: '700' },
  subBlock: { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: palette.border },
  subTitle: { color: palette.text, fontSize: 13, fontWeight: '700' },
  subText: { color: palette.secondary, fontSize: 11, marginTop: 2 },
  subNote: { color: palette.muted, fontSize: 10, marginTop: 2, fontStyle: 'italic' },
});

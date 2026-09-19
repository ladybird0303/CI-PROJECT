import React, { useState, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Snackbar, Switch, Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useDevice } from '../../hooks/useDevice';
import { palette } from '../../constants/colors';

const DEFAULT_RELAY_NAMES = ['Load 1', 'Load 2', 'Load 3'];
const RELAY_ICON = 'power-plug';

export default function RelayControlScreen() {
  const {
    isConnected,
    voltage,
    current,
    power,
    relays,
    threshold,
    thresholdExceeded,
    buzzerAlert,
    deviceRebooted,
    toggleRelay,
    updateThreshold,
    acknowledgeBreach,
  } = useDevice({ pollIntervalMs: 3000 });

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(threshold);
  // Serializes relay commands: the device bridge handles exactly one request
  // at a time (~1-2s per 32/64-sample sensor read), so overlapping POSTs from
  // fast taps or the master toggle would queue, time out, or be dropped.
  const [busyChannel, setBusyChannel] = useState<number | null>(null);
  const [relayNames, setRelayNames] = useState(DEFAULT_RELAY_NAMES);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Belt-and-suspenders: hook guards relays on write, but a stale bundle or a
  // future partial body could still hand us undefined — never crash on it.
  const safeRelays: [boolean, boolean, boolean] = Array.isArray(relays)
    ? [!!relays[0], !!relays[1], !!relays[2]]
    : [false, false, false];
  const safeNum = (v: unknown, fb = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fb;
  };
  const safeVoltage = safeNum(voltage);
  const safeCurrent = safeNum(current);
  const safePower = safeNum(power);
  const safeThreshold = safeNum(threshold, 10);

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const handleToggle = async (channel: number) => {
    if (!isConnected) {
      showSnackbar('Device not connected — check the bridge');
      return;
    }
    if (thresholdExceeded) {
      showSnackbar('Threshold breach! Acknowledge first to control relays.');
      return;
    }
    const label = relayNames[channel - 1];
    const newState = !safeRelays[channel - 1];
    await toggleRelay(channel);
    showSnackbar(`${label} ${newState ? 'ON' : 'OFF'}`);
  };

  const handleMasterToggle = async (turnOn: boolean) => {
    if (!isConnected) {
      showSnackbar('Device not connected — check the bridge');
      return;
    }
    if (thresholdExceeded && turnOn) {
      showSnackbar('Threshold breach! Acknowledge first to enable relays.');
      return;
    }
    if (busyChannel !== null) return; // one command at a time (the link is serial)
    // Sequential: each toggleRelay() already waits out the device's sensor cycle,
    // so commands never overlap and queue on the single-threaded bridge.
    setBusyChannel(0);
    const failures: string[] = [];
    try {
      for (let ch = 1; ch <= 3; ch++) {
        if (safeRelays[ch - 1] !== turnOn) {
          const result = await toggleRelay(ch);
          if (!result.latched) failures.push(`${relayNames[ch - 1]}: ${result.note}`);
        }
      }
    } finally {
      setBusyChannel(null);
    }
    if (failures.length === 0) {
      showSnackbar(turnOn ? 'All relays turned ON' : 'All relays turned OFF');
    } else {
      showSnackbar(failures[0]);
    }
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(Math.round(value * 2) / 2);
  };

  const handleSliderComplete = async (value: number) => {
    const rounded = Math.round(value * 2) / 2;
    setSliderValue(rounded);
    if (!isConnected) return;
    const ok = await updateThreshold(rounded);
    showSnackbar(ok
      ? `Power threshold set to ${rounded.toFixed(1)}W`
      : 'Threshold NOT applied — the meter did not accept it.');
  };

  const handleAcknowledge = async () => {
    const ok = await acknowledgeBreach();
    showSnackbar(ok
      ? 'Threshold acknowledged. Relays re-enabled.'
      : 'Acknowledge NOT delivered — the meter still holds the latch.');
  };

  // Relay controls are level toggles (NOT momentary push buttons).
  // One tap flips the level and stays — identical to the latched HW buttons.
  // toggleRelay() already commands, waits out one sensor cycle, re-reads
  // ground truth, and returns WHY a latch failed (network / threshold /
  // reboot / loose-button re-toggle). Show that verdict verbatim.
  const handleSwitchToggle = async (channel: number) => {
    if (!isConnected) {
      showSnackbar('Device not connected — check the bridge');
      return;
    }
    const currentlyOn = safeRelays[channel - 1];
    if (thresholdExceeded && !currentlyOn) {
      showSnackbar('Threshold breach! Acknowledge first to control relays.');
      return;
    }
    if (busyChannel !== null) return; // one command at a time (ESP is serial)
    const label = relayNames[channel - 1];
    setBusyChannel(channel);
    try {
      const result = await toggleRelay(channel);
      if (result.latched) {
        showSnackbar(`${label} toggled ${!currentlyOn ? 'ON' : 'OFF'}`);
      } else {
        showSnackbar(`${label} did NOT stay on — ${result.note}`);
      }
    } finally {
      setBusyChannel(null);
    }
  };

  const handleStartRename = (index: number) => {
    setEditingIndex(index);
    setEditText(relayNames[index]);
  };

  const handleConfirmRename = () => {
    if (editingIndex !== null && editText.trim().length > 0) {
      setRelayNames((prev) => {
        const next = [...prev];
        next[editingIndex] = editText.trim();
        return next;
      });
    }
    setEditingIndex(null);
    setEditText('');
  };

  const handleCancelRename = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const allOn = safeRelays[0] && safeRelays[1] && safeRelays[2];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Connection Status Banner */}
        <View style={[styles.connectionBanner, isConnected ? styles.connected : styles.disconnected]}>
          <MaterialCommunityIcons
            name={isConnected ? 'wifi' : 'wifi-off'}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.connectionText}>
            {isConnected
              ? `Device Connected — ${voltage.toFixed(1)}V, ${power.toFixed(1)}W`
              : 'Device Disconnected — check the bridge connection'}
          </Text>
        </View>

        {thresholdExceeded && (
          <Card style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FFFFFF" />
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>POWER THRESHOLD EXCEEDED</Text>
                <Text style={styles.alertDetail}>Power ({power.toFixed(1)}W) crossed threshold ({threshold.toFixed(1)}W). All relays cut off.{buzzerAlert ? ' Buzzer active.' : ''}</Text>
              </View>
            </View>
            <Button mode="contained" onPress={handleAcknowledge} style={styles.acknowledgeBtn} buttonColor="#FFFFFF" textColor="#D32F2F" icon="check">ACKNOWLEDGE & RESET</Button>
          </Card>
        )}
        {deviceRebooted && !thresholdExceeded && (
          <Card style={styles.rebootCard}>
            <View style={styles.alertHeader}>
              <MaterialCommunityIcons name="restart-alert" size={28} color="#5D4037" />
              <View style={styles.alertTextContainer}>
                <Text style={styles.rebootTitle}>DEVICE REBOOTED DURING LAST COMMAND</Text>
                <Text style={styles.rebootDetail}>Coil inrush browned the device out — it rebooted and all relays released. Move relay JD-VCC wiring to the other buck rail, then try again.</Text>
              </View>
            </View>
          </Card>
        )}
        <Text variant="headlineSmall" style={styles.title}>Relay Control</Text>
        <Text style={styles.subtitle}>{isConnected ? 'Hardware-connected relay management.' : 'Waiting for device connection...'}</Text>
        <Card style={styles.card}>
          <View style={styles.cardSectionTitle}>
            <MaterialCommunityIcons name="speedometer" size={18} color={palette.primary} />
            <Text style={styles.sectionTitleText}>Power Threshold Limit</Text>
          </View>
          <Text style={styles.sliderDescription}>If power exceeds this value, all relays cut off and buzzer activates.</Text>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderValue}>{sliderValue.toFixed(1)} W</Text>
            <Slider style={styles.slider} minimumValue={0.5} maximumValue={100} step={0.5} value={sliderValue} onValueChange={handleSliderChange} onSlidingComplete={handleSliderComplete} minimumTrackTintColor={palette.primary} maximumTrackTintColor={palette.border} thumbTintColor={palette.primary} disabled={!isConnected} />
          </View>
          <Text style={styles.sliderRange}>Range: 0.5W — 100W (ACS712-5A hardware limit)</Text>
        </Card>
        <Card style={styles.card}>
          <View style={styles.cardSectionTitle}>
            <MaterialCommunityIcons name="power-plug" size={18} color={palette.primary} />
            <Text style={styles.sectionTitleText}>Individual Relays</Text>
          </View>
          <View style={styles.masterRow}>
            <View>
              <Text style={styles.masterLabel}>Master Control</Text>
              <Text style={styles.masterSubLabel}>{allOn ? 'All relays ON' : 'Some or all relays OFF'}</Text>
            </View>
            <View style={styles.masterButtons}>
              <Button mode="outlined" onPress={() => handleMasterToggle(true)} disabled={!isConnected || busyChannel !== null || (thresholdExceeded && !allOn)} compact>ALL ON</Button>
              <Button mode="contained" onPress={() => handleMasterToggle(false)} disabled={!isConnected || busyChannel !== null} buttonColor="#D32F2F" compact>ALL OFF</Button>
            </View>
          </View>
          <View style={styles.divider} />
          {relayNames.map((name, index) => {
            const ch = index + 1;
            const isOn = safeRelays[index];
            const isEditing = editingIndex === index;
            return (
              <View key={ch} style={styles.relayRow}>
                <View style={styles.relayInfo}>
                  <MaterialCommunityIcons name={RELAY_ICON} size={24} color={isOn ? palette.primary : palette.muted} />
                  <View style={styles.relayTextContainer}>
                    {isEditing ? (
                      <TextInput
                        value={editText}
                        onChangeText={setEditText}
                        onSubmitEditing={handleConfirmRename}
                        onBlur={handleConfirmRename}
                        autoFocus
                        dense
                        mode="flat"
                        style={styles.renameInput}
                        contentStyle={styles.renameInputContent}
                      />
                    ) : (
                      <Pressable onLongPress={() => handleStartRename(index)} delayLongPress={400}>
                        <Text style={styles.relayLabel}>{name}</Text>
                        <Text style={styles.renameHint}>Long-press to rename</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
                <View style={styles.relayActions}>
                  {isEditing ? (
                    <View style={styles.renameActions}>
                      <Button mode="text" onPress={handleConfirmRename} compact textColor={palette.primary}>Save</Button>
                      <Button mode="text" onPress={handleCancelRename} compact textColor={palette.muted}>Cancel</Button>
                    </View>
                  ) : (
                    <View style={styles.toggleRow}>
                      <Text style={[styles.toggleState, isOn ? styles.toggleOn : styles.toggleOff]}>{busyChannel === ch ? '...' : isOn ? 'ON' : 'OFF'}</Text>
                      <Switch
                        value={isOn}
                        onValueChange={() => handleSwitchToggle(ch)}
                        disabled={!isConnected || busyChannel !== null || (thresholdExceeded && !isOn)}
                        color={palette.primary}
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </Card>
        <Card style={styles.card}>
          <View style={styles.cardSectionTitle}>
            <MaterialCommunityIcons name="gauge" size={18} color={palette.primary} />
            <Text style={styles.sectionTitleText}>Live Sensor Readings</Text>
          </View>
          <View style={styles.sensorGrid}>
            <View style={styles.sensorItem}>
              <MaterialCommunityIcons name="flash" size={22} color={palette.secondary} />
              <Text style={styles.sensorValue}>{voltage.toFixed(2)} V</Text>
              <Text style={styles.sensorLabel}>Voltage</Text>
            </View>
            <View style={styles.sensorItem}>
              <MaterialCommunityIcons name="current-ac" size={22} color="#F59E0B" />
              <Text style={styles.sensorValue}>{current.toFixed(3)} A</Text>
              <Text style={styles.sensorLabel}>Current</Text>
            </View>
            <View style={styles.sensorItem}>
              <MaterialCommunityIcons name="lightning-bolt" size={22} color="#D32F2F" />
              <Text style={styles.sensorValue}>{power.toFixed(2)} W</Text>
              <Text style={styles.sensorLabel}>Power</Text>
            </View>
          </View>
          <Text style={styles.sensorNote}>Sensor data from ACS712-5A current sensor and voltage divider module.</Text>
        </Card>
      </ScrollView>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={2000} style={styles.snackbar}>{snackbarMessage}</Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: 20, paddingBottom: 32 },
  connectionBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8, marginBottom: 16 },
  connected: { backgroundColor: '#2E7D32' },
  disconnected: { backgroundColor: '#D32F2F' },
  connectionText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', flex: 1 },
  alertCard: { borderRadius: 12, padding: 16, backgroundColor: '#D32F2F', marginBottom: 16, elevation: 4 },
  alertHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  alertTextContainer: { flex: 1 },
  alertTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  alertDetail: { color: '#FFCDD2', fontSize: 12, marginTop: 4, lineHeight: 16 },
  acknowledgeBtn: { borderRadius: 8 },
  rebootCard: { borderRadius: 12, padding: 16, backgroundColor: '#FFF3E0', marginBottom: 16, elevation: 2, borderWidth: 1, borderColor: '#FFB74D' },
  rebootTitle: { color: '#E65100', fontSize: 14, fontWeight: '800' },
  rebootDetail: { color: '#6D4C41', fontSize: 12, marginTop: 4, lineHeight: 16 },
  title: { color: palette.text, fontWeight: '700' },
  subtitle: { color: palette.muted, marginTop: 4, marginBottom: 16 },
  card: { borderRadius: 24, padding: 18, backgroundColor: palette.surface, elevation: 2, shadowColor: palette.shadow, shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, marginBottom: 16 },
  cardSectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitleText: { color: palette.text, fontSize: 14, fontWeight: '700' },
  sliderDescription: { color: palette.muted, fontSize: 11, marginBottom: 8 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sliderValue: { color: palette.primary, fontSize: 18, fontWeight: '800', minWidth: 70, textAlign: 'right' },
  slider: { flex: 1, height: 40 },
  sliderRange: { color: palette.muted, fontSize: 10, marginTop: 4 },
  masterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  masterLabel: { color: palette.text, fontSize: 14, fontWeight: '700' },
  masterSubLabel: { color: palette.muted, fontSize: 11, marginTop: 2 },
  masterButtons: { flexDirection: 'row', gap: 8 },
  divider: { height: 1, backgroundColor: palette.border, marginVertical: 12 },
  relayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: palette.border },
  relayInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  relayTextContainer: { flex: 1 },
  relayLabel: { color: palette.text, fontSize: 14, fontWeight: '600' },
  renameHint: { color: palette.muted, fontSize: 10, marginTop: 2 },
  renameInput: { height: 36, backgroundColor: 'transparent' },
  renameInputContent: { fontSize: 14, fontWeight: '600', color: palette.primary },
  relayActions: { minWidth: 110, alignItems: 'flex-end' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleState: { fontSize: 12, fontWeight: '800', minWidth: 28, textAlign: 'right' },
  toggleOn: { color: palette.primary },
  toggleOff: { color: palette.muted },
  renameActions: { flexDirection: 'row', alignItems: 'center' },
  sensorGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  sensorItem: { alignItems: 'center', gap: 4 },
  sensorValue: { color: palette.text, fontSize: 16, fontWeight: '700' },
  sensorLabel: { color: palette.muted, fontSize: 10 },
  sensorNote: { color: palette.muted, fontSize: 10, textAlign: 'center', fontStyle: 'italic' },
  snackbar: { backgroundColor: palette.primary },
});

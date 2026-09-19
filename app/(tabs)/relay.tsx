import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Snackbar, Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useEsp32 } from '../../hooks/useEsp32';
import { RELAY_CHANNELS, SENSORS, THRESHOLD_DEFAULTS, ESP32_AP } from '../../constants/hardwareConfig';
import { palette } from '../../constants/colors';

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
    toggleRelay,
    updateThreshold,
    acknowledgeBreach,
  } = useEsp32({ pollIntervalMs: 1500 });

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(threshold || THRESHOLD_DEFAULTS.defaultWatts);
  const [customNames, setCustomNames] = useState<Record<number, string>>({});
  const [editingChannel, setEditingChannel] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const getChannelName = (channelNum: number) => {
    return customNames[channelNum] || RELAY_CHANNELS.find((r) => r.channel === channelNum)?.loadName || `Channel ${channelNum}`;
  };

  const handleToggle = async (channelNum: number) => {
    if (!isConnected) {
      showSnackbar('ESP32 not connected — check WiFi connection');
      return;
    }
    if (thresholdExceeded) {
      showSnackbar('Threshold breach! Acknowledge first to control relays.');
      return;
    }
    const label = getChannelName(channelNum);
    const newState = !relays[channelNum - 1];
    await toggleRelay(channelNum);
    showSnackbar(`${label} ${newState ? 'ON' : 'OFF'}`);
  };

  const handleMasterToggle = async (turnOn: boolean) => {
    if (!isConnected) {
      showSnackbar('ESP32 not connected — check WiFi connection');
      return;
    }
    if (thresholdExceeded && turnOn) {
      showSnackbar('Threshold breach! Acknowledge first to enable relays.');
      return;
    }
    for (let ch = 1; ch <= RELAY_CHANNELS.length; ch++) {
      if (relays[ch - 1] !== turnOn) {
        await toggleRelay(ch);
      }
    }
    showSnackbar(turnOn ? 'All relays turned ON' : 'All relays turned OFF');
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(Math.round(value * 2) / 2);
  };

  const handleSliderComplete = async (value: number) => {
    const rounded = Math.round(value * 2) / 2;
    setSliderValue(rounded);
    if (isConnected) {
      await updateThreshold(rounded);
      showSnackbar(`Power threshold limit set to ${rounded.toFixed(1)}W`);
    }
  };

  const handleAcknowledge = async () => {
    await acknowledgeBreach();
    showSnackbar('Threshold breach acknowledged. Relays re-enabled.');
  };

  const handleStartRename = (channelNum: number) => {
    setEditingChannel(channelNum);
    setEditText(getChannelName(channelNum));
  };

  const handleConfirmRename = () => {
    if (editingChannel !== null && editText.trim().length > 0) {
      setCustomNames((prev) => ({
        ...prev,
        [editingChannel]: editText.trim(),
      }));
    }
    setEditingChannel(null);
    setEditText('');
  };

  const handleCancelRename = () => {
    setEditingChannel(null);
    setEditText('');
  };

  const allOn = relays.slice(0, RELAY_CHANNELS.length).every(Boolean);

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
              ? `ESP32 Connected — ${voltage.toFixed(1)}V, ${power.toFixed(1)}W`
              : `ESP32 Disconnected — Connect to "${ESP32_AP.ssid}" WiFi`}
          </Text>
        </View>

        {/* Emergency Breach Alert Card */}
        {thresholdExceeded && (
          <Card style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FFFFFF" />
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>POWER THRESHOLD EXCEEDED</Text>
                <Text style={styles.alertDetail}>
                  Power ({power.toFixed(1)}W) crossed limit ({threshold.toFixed(1)}W). All relays cut off.
                  {buzzerAlert ? ' Active 5V Buzzer alarm sounding.' : ''}
                </Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={handleAcknowledge}
              style={styles.acknowledgeBtn}
              buttonColor="#FFFFFF"
              textColor="#D32F2F"
              icon="check"
            >
              ACKNOWLEDGE & RESET CIRCUIT BREAKER
            </Button>
          </Card>
        )}

        <Text variant="headlineSmall" style={styles.title}>Relay Circuit Breakers</Text>
        <Text style={styles.subtitle}>
          {isConnected
            ? `Hardware relay module (${RELAY_CHANNELS.length} channels configured).`
            : 'Waiting for ESP32 connection...'}
        </Text>

        {/* Threshold Slider Card */}
        <Card style={styles.card}>
          <View style={styles.cardSectionTitle}>
            <MaterialCommunityIcons name="speedometer" size={18} color={palette.primary} />
            <Text style={styles.sectionTitleText}>Power Threshold Limit</Text>
          </View>
          <Text style={styles.sliderDescription}>
            Automated trip limit. If load power exceeds this value, all relays cut off and active buzzer sounds.
          </Text>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderValue}>{sliderValue.toFixed(1)} W</Text>
            <Slider
              style={styles.slider}
              minimumValue={THRESHOLD_DEFAULTS.minWatts}
              maximumValue={THRESHOLD_DEFAULTS.maxWatts}
              step={0.5}
              value={sliderValue}
              onValueChange={handleSliderChange}
              onSlidingComplete={handleSliderComplete}
              minimumTrackTintColor={palette.primary}
              maximumTrackTintColor={palette.border}
              thumbTintColor={palette.primary}
              disabled={!isConnected}
            />
          </View>
          <Text style={styles.sliderRange}>
            Hardware Range: {THRESHOLD_DEFAULTS.minWatts}W — {THRESHOLD_DEFAULTS.maxWatts}W ({SENSORS.current.model} hardware limit)
          </Text>
        </Card>

        {/* Individual Relays Card */}
        <Card style={styles.card}>
          <View style={styles.cardSectionTitle}>
            <MaterialCommunityIcons name="power-plug" size={18} color={palette.primary} />
            <Text style={styles.sectionTitleText}>Relay Channels (Hardware Mapped)</Text>
          </View>

          {/* Master Control */}
          <View style={styles.masterRow}>
            <View>
              <Text style={styles.masterLabel}>Master Control</Text>
              <Text style={styles.masterSubLabel}>{allOn ? 'All active channels ON' : 'Some or all channels OFF'}</Text>
            </View>
            <View style={styles.masterButtons}>
              <Button
                mode="outlined"
                onPress={() => handleMasterToggle(true)}
                disabled={!isConnected || (thresholdExceeded && !allOn)}
                compact
              >
                ALL ON
              </Button>
              <Button
                mode="contained"
                onPress={() => handleMasterToggle(false)}
                disabled={!isConnected}
                buttonColor="#D32F2F"
                compact
              >
                ALL OFF
              </Button>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Relay Channel Rows */}
          {RELAY_CHANNELS.map((chConfig) => {
            const chNum = chConfig.channel;
            const isOn = relays[chNum - 1] ?? false;
            const isEditing = editingChannel === chNum;
            const channelName = getChannelName(chNum);

            const getIcon = () => {
              if (chConfig.loadType === 'fan') return 'fan';
              if (chConfig.loadType === 'motor') return 'engine';
              return 'lightbulb-outline';
            };

            return (
              <View key={chNum} style={styles.relayRow}>
                <View style={styles.relayInfo}>
                  <MaterialCommunityIcons
                    name={getIcon()}
                    size={24}
                    color={isOn ? palette.primary : palette.muted}
                  />
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
                      <View>
                        <Text style={styles.relayLabel} onLongPress={() => handleStartRename(chNum)}>
                          {channelName}
                        </Text>
                        <Text style={styles.relaySubLabel}>
                          GPIO {chConfig.gpio} ({chConfig.relayPin}) • {chConfig.loadSpec}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.relayActions}>
                  {isEditing ? (
                    <View style={styles.renameActions}>
                      <Button mode="text" onPress={handleConfirmRename} compact textColor={palette.primary}>
                        Save
                      </Button>
                      <Button mode="text" onPress={handleCancelRename} compact textColor={palette.muted}>
                        Cancel
                      </Button>
                    </View>
                  ) : (
                    <Button
                      mode={isOn ? 'contained' : 'outlined'}
                      onPress={() => handleToggle(chNum)}
                      disabled={!isConnected || (thresholdExceeded && !isOn)}
                      buttonColor={isOn ? palette.primary : undefined}
                      compact
                    >
                      {isOn ? 'ON' : 'OFF'}
                    </Button>
                  )}
                </View>
              </View>
            );
          })}
        </Card>

        {/* Live Sensor Quick View */}
        <Card style={styles.card}>
          <View style={styles.cardSectionTitle}>
            <MaterialCommunityIcons name="gauge" size={18} color={palette.primary} />
            <Text style={styles.sectionTitleText}>Live Sensor Telemetry</Text>
          </View>
          <View style={styles.sensorGrid}>
            <View style={styles.sensorItem}>
              <MaterialCommunityIcons name="flash" size={22} color={palette.secondary} />
              <Text style={styles.sensorValue}>{voltage.toFixed(2)} V</Text>
              <Text style={styles.sensorLabel}>Voltage ({SENSORS.voltage.model})</Text>
            </View>
            <View style={styles.sensorItem}>
              <MaterialCommunityIcons name="current-ac" size={22} color="#F59E0B" />
              <Text style={styles.sensorValue}>{current.toFixed(3)} A</Text>
              <Text style={styles.sensorLabel}>Current ({SENSORS.current.model})</Text>
            </View>
            <View style={styles.sensorItem}>
              <MaterialCommunityIcons name="lightning-bolt" size={22} color="#D32F2F" />
              <Text style={styles.sensorValue}>{power.toFixed(2)} W</Text>
              <Text style={styles.sensorLabel}>Calculated Power</Text>
            </View>
          </View>
          <Text style={styles.sensorNote}>
            Current measured on GPIO {SENSORS.current.gpio}, Voltage on GPIO {SENSORS.voltage.gpio}.
          </Text>
        </Card>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: 20, paddingBottom: 32 },
  connectionBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8, marginBottom: 16 },
  connected: { backgroundColor: palette.primary },
  disconnected: { backgroundColor: '#D32F2F' },
  connectionText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', flex: 1 },
  alertCard: { borderRadius: 12, padding: 16, backgroundColor: '#D32F2F', marginBottom: 16, elevation: 4 },
  alertHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  alertTextContainer: { flex: 1 },
  alertTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  alertDetail: { color: '#FFCDD2', fontSize: 12, marginTop: 4, lineHeight: 16 },
  acknowledgeBtn: { borderRadius: 8 },
  title: { color: palette.text, fontWeight: '700' },
  subtitle: { color: palette.muted, marginTop: 4, marginBottom: 16 },
  card: { borderRadius: 20, padding: 18, backgroundColor: palette.surface, elevation: 2, marginBottom: 16 },
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
  relaySubLabel: { color: palette.muted, fontSize: 10, marginTop: 2 },
  renameInput: { height: 36, backgroundColor: 'transparent' },
  renameInputContent: { fontSize: 14, fontWeight: '600', color: palette.primary },
  relayActions: { minWidth: 80, alignItems: 'flex-end' },
  renameActions: { flexDirection: 'row', alignItems: 'center' },
  sensorGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  sensorItem: { alignItems: 'center', gap: 4 },
  sensorValue: { color: palette.text, fontSize: 16, fontWeight: '700' },
  sensorLabel: { color: palette.muted, fontSize: 10 },
  sensorNote: { color: palette.muted, fontSize: 10, textAlign: 'center', fontStyle: 'italic' },
  snackbar: { backgroundColor: palette.primary },
});

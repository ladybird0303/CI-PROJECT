import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Snackbar, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RelayControlRow } from '../../components/RelayControlRow';
import { palette } from '../../constants/colors';

export default function RelayControlScreen() {
  const [mainLight, setMainLight] = useState(true);
  const [fan, setFan] = useState(false);
  const [motor, setMotor] = useState(true);
  const [relayStatus, setRelayStatus] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setVisible(true);
  };

  const toggleAll = () => {
    const next = !relayStatus;
    setRelayStatus(next);
    setMainLight(next);
    setFan(next);
    setMotor(next);
    showMessage(next ? 'All relays turned on' : 'All relays turned off');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="headlineSmall" style={styles.title}>Relay Control</Text>
        <Text style={styles.subtitle}>Local UI-only relay management.</Text>

        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.label}>Relay Status</Text>
              <Text style={[styles.statusText, relayStatus ? styles.on : styles.off]}>
                {relayStatus ? 'ON' : 'OFF'}
              </Text>
            </View>
            <MaterialCommunityIcons name="power-plug" size={34} color={relayStatus ? palette.primary : '#D32F2F'} />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Master Relay</Text>
            <Button mode="contained" onPress={toggleAll}>
              {relayStatus ? 'Turn Off' : 'Turn On'}
            </Button>
          </View>

          <RelayControlRow
            label="Main Light"
            value={mainLight}
            onValueChange={(value) => {
              setMainLight(value);
              showMessage(`Main Light ${value ? 'enabled' : 'disabled'}`);
            }}
          />
          <RelayControlRow
            label="Fan"
            value={fan}
            onValueChange={(value) => {
              setFan(value);
              showMessage(`Fan ${value ? 'enabled' : 'disabled'}`);
            }}
          />
          <RelayControlRow
            label="Motor"
            value={motor}
            onValueChange={(value) => {
              setMotor(value);
              showMessage(`Motor ${value ? 'enabled' : 'disabled'}`);
            }}
          />
        </Card>
      </ScrollView>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={1800}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    color: palette.text,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    marginTop: 4,
    marginBottom: 16,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: palette.muted,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
  },
  on: {
    color: palette.primary,
  },
  off: {
    color: '#D32F2F',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleLabel: {
    color: palette.text,
    fontWeight: '600',
  },
  snackbar: {
    backgroundColor: palette.primary,
  },
});

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text, TextInput } from 'react-native-paper';
import { palette } from '../../constants/colors';
import {
  DEFAULT_DEVICE_URL,
  deviceUrlSource,
  getDeviceBaseUrl,
  setDeviceBaseUrl,
} from '../../utils/deviceConfig';

const SOURCE_LABEL = {
  override: 'set on this screen (this session)',
  env: 'from the .env file',
  default: 'the built-in default',
} as const;

export default function ProfileScreen() {
  const [urlInput, setUrlInput] = useState(getDeviceBaseUrl());
  const [appliedUrl, setAppliedUrl] = useState(getDeviceBaseUrl());

  const apply = () => {
    const next = setDeviceBaseUrl(urlInput);
    setUrlInput(next);
    setAppliedUrl(next);
  };

  const reset = () => {
    const next = setDeviceBaseUrl(null);
    setUrlInput(next);
    setAppliedUrl(next);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>Profile</Text>
      <Card style={styles.card}>
        <Avatar.Text size={72} label="S" style={styles.avatar} color={palette.surface} />
        <Text style={styles.name}>Savera</Text>
        <Text style={styles.meta}>Smart Home Owner</Text>
      </Card>

      <Card style={styles.deviceCard}>
        <Text style={styles.cardTitle}>Device Connection</Text>
        <Text style={styles.deviceHint}>
          Where /api/status, /api/relay, /api/threshold and /api/acknowledge are fetched from.
          Currently {SOURCE_LABEL[deviceUrlSource()]}.
        </Text>
        <Text style={styles.deviceUrl} selectable>{appliedUrl}</Text>
        <TextInput
          mode="outlined"
          label="Device URL"
          value={urlInput}
          onChangeText={setUrlInput}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={styles.deviceInput}
          outlineColor={palette.border}
          activeOutlineColor={palette.primary}
        />
        <View style={styles.deviceButtons}>
          <Button mode="contained" onPress={apply} buttonColor={palette.primary} compact>Apply</Button>
          <Button mode="outlined" onPress={reset} textColor={palette.primary} compact>Use default</Button>
        </View>
        <Text style={styles.deviceNote}>
          Laptop bridge on a hotspot: http://192.168.137.1:3000{'\n'}
          adb reverse over USB: http://127.0.0.1:3000{'\n'}
          Built-in default: {DEFAULT_DEVICE_URL}
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 20, backgroundColor: palette.background },
  title: { color: palette.text, fontWeight: '700' },
  card: { borderRadius: 20, padding: 20, alignItems: 'center', backgroundColor: palette.surface, marginTop: 16 },
  avatar: { backgroundColor: palette.primary, marginBottom: 12 },
  name: { color: palette.text, fontWeight: '700', fontSize: 20 },
  meta: { color: palette.muted, marginTop: 4 },
  deviceCard: { borderRadius: 20, padding: 20, backgroundColor: palette.surface, marginTop: 16 },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  deviceHint: { color: palette.muted, fontSize: 12, marginTop: 6, lineHeight: 17 },
  deviceUrl: { color: palette.primary, fontWeight: '700', fontSize: 14, marginTop: 10 },
  deviceInput: { marginTop: 12, backgroundColor: palette.surface },
  deviceButtons: { flexDirection: 'row', gap: 10, marginTop: 14 },
  deviceNote: { color: palette.muted, fontSize: 11, marginTop: 14, lineHeight: 17 },
});

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AlertCard } from '../../components/AlertCard';
import { palette } from '../../constants/colors';

const initialAlerts = [
  { id: 1, title: 'Power Restored', detail: 'Grid connection normalized at 10:15 AM.', accent: palette.primary, icon: 'power-plug' as const, unread: true },
  { id: 2, title: 'Energy Consumption High', detail: 'Usage exceeded the usual range this afternoon.', accent: '#F59E0B', icon: 'alert' as const, unread: true },
  { id: 3, title: 'Possible Tampering', detail: 'An unusual load pattern was detected near the meter.', accent: '#D32F2F', icon: 'shield-alert' as const, unread: false },
  { id: 4, title: 'WiFi Connected', detail: 'The smart meter gateway reconnected successfully.', accent: palette.secondary, icon: 'wifi' as const, unread: false },
  { id: 5, title: 'SMS Sent', detail: 'A notification was sent to the homeowner.', accent: '#8E24AA', icon: 'message-text' as const, unread: true },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const deleteAlert = (id: number) => {
    setAlerts((current) => current.filter((item) => item.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.title}>Alerts</Text>
      <Text style={styles.subtitle}>Live notification feed with mock updates.</Text>

      {alerts.map((item) => (
        <View key={item.id} style={styles.swipeWrap}>
          <AlertCard
            title={item.title}
            detail={item.detail}
            accent={item.accent}
            icon={item.icon}
            unread={item.unread}
          />
          <View style={styles.deleteAction}>
            <Text style={styles.deleteText} onPress={() => deleteAlert(item.id)}>Delete</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: palette.background,
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
  swipeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAction: {
    marginLeft: 8,
    backgroundColor: '#D32F2F',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '700',
  },
});

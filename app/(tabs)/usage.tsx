import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { palette } from '../../constants/colors';

export default function UsageScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>Usage Overview</Text>
      <Text style={styles.subtitle}>This week looks efficient and balanced.</Text>
      <Card style={styles.card}>
        <Text style={styles.metric}>Peak Time: 6:30 PM</Text>
        <Text style={styles.metric}>Average Load: 2.1 kW</Text>
        <Text style={styles.metric}>Savings Goal: 12%</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 20, backgroundColor: palette.background },
  title: { color: palette.text, fontWeight: '700' },
  subtitle: { color: palette.muted, marginTop: 6, marginBottom: 16 },
  card: { borderRadius: 20, padding: 16, backgroundColor: palette.surface },
  metric: { color: palette.text, marginBottom: 8 },
});

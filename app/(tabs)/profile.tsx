import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import { palette } from '../../constants/colors';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>Profile</Text>
      <Card style={styles.card}>
        <Avatar.Text size={72} label="S" style={styles.avatar} color={palette.surface} />
        <Text style={styles.name}>Savera</Text>
        <Text style={styles.meta}>Smart Home Owner</Text>
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
});

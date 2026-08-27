import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../constants/colors';

const activities = [
  { title: 'Power Updated', time: '2 min ago', icon: 'flash' as const, tint: palette.primary },
  { title: 'Relay Activated', time: '18 min ago', icon: 'toggle-switch' as const, tint: palette.secondary },
  { title: 'Theft Scan Completed', time: '1 hr ago', icon: 'shield-check' as const, tint: palette.primary },
  { title: 'WiFi Connected', time: '2 hrs ago', icon: 'wifi' as const, tint: palette.secondary },
];

export function ActivityList() {
  return (
    <Card style={styles.card}>
      <Text variant="titleMedium" style={styles.title}>Recent Activity</Text>
      {activities.map((item) => (
        <View key={item.title} style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: `${item.tint}14` }]}> 
            <MaterialCommunityIcons name={item.icon} size={18} color={item.tint} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    color: palette.text,
    fontWeight: '700',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  activityTitle: {
    color: palette.text,
    fontWeight: '600',
  },
  time: {
    color: palette.muted,
    marginTop: 2,
  },
});

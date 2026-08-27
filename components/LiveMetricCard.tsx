import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../constants/colors';

type LiveMetricCardProps = {
  label: string;
  value: string;
  unit: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  delay?: number;
};

export function LiveMetricCard({ label, value, unit, icon, tint, delay = 0 }: LiveMetricCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)}>
      <Card style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: `${tint}18` }]}> 
          <MaterialCommunityIcons name={icon} size={20} color={tint} />
        </View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 14,
    backgroundColor: palette.surface,
    marginBottom: 12,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    color: palette.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
  },
  unit: {
    color: palette.secondary,
    marginTop: 2,
    fontSize: 12,
  },
});

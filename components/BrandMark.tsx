import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { palette } from '../constants/colors';

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="lightning-bolt" size={compact ? 28 : 40} color={palette.surface} />
      </View>
      <View style={styles.textWrap}>
        <Text variant={compact ? 'titleMedium' : 'headlineSmall'} style={styles.title}>
          Smart Energy Meter
        </Text>
        {!compact && (
          <Text variant="bodyMedium" style={styles.subtitle}>
            IoT Energy Monitoring & Theft Detection
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  textWrap: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    color: palette.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: palette.muted,
    marginTop: 4,
    textAlign: 'center',
  },
});

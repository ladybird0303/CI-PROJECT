import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { palette } from '../constants/colors';

type RelayControlRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function RelayControlRow({ label, value, onValueChange }: RelayControlRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} color={palette.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  label: {
    color: palette.text,
    fontWeight: '600',
  },
});

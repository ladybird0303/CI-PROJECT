import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, Text } from 'react-native-paper';
import { palette } from '../constants/colors';

type DashboardHeaderProps = {
  name: string;
};

export function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.greetingWrap}>
        <Text variant="titleMedium" style={styles.greeting}>Good Morning,</Text>
        <Text variant="headlineSmall" style={styles.name}>{name}</Text>
      </View>

      <View style={styles.actions}>
        <IconButton icon="bell-outline" size={22} mode="contained-tonal" containerColor={palette.surfaceAlt} iconColor={palette.secondary} />
        <Avatar.Text size={44} label="S" style={styles.avatar} color={palette.surface} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingWrap: {
    flex: 1,
  },
  greeting: {
    color: palette.muted,
  },
  name: {
    color: palette.text,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: palette.primary,
    marginLeft: 4,
  },
});

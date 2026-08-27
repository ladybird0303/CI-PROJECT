import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Text } from 'react-native-paper';
import { palette } from '../constants/colors';

type ScreenShellProps = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function ScreenShell({ title, subtitle, action, children }: ScreenShellProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="headlineSmall" style={styles.title}>
            {title}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
        {action}
      </Animated.View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: palette.text,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    marginTop: 4,
  },
});

import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3Theme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { palette } from '../constants/colors';

const theme: MD3Theme = {
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.surfaceAlt,
    onSurface: palette.text,
    onBackground: palette.text,
    outline: palette.border,
    tertiary: palette.secondary,
  },
  roundness: 20,
  dark: false,
  isV3: true,
} as MD3Theme;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

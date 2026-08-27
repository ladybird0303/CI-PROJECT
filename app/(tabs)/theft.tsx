import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Button, Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TheftTimeline } from '../../components/TheftTimeline';
import { palette } from '../../constants/colors';

const safeTimeline = [
  { time: '08:45', title: 'System Started' },
  { time: '09:10', title: 'Normal Reading' },
  { time: '10:20', title: 'Voltage Stable' },
];

const alertTimeline = [
  { time: '08:45', title: 'System Started' },
  { time: '09:10', title: 'Irregular Load Pattern' },
  { time: '10:20', title: 'Tamper Signal Detected' },
];

export default function TheftDetectionScreen() {
  const [alert, setAlert] = useState(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!alert) {
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
      return;
    }

    scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 500 }), withTiming(0.98, { duration: 500 })), -1, true);
    opacity.value = withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.72, { duration: 400 })), -1, true);
  }, [alert, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.title}>Theft Detection</Text>
      <Text style={styles.subtitle}>Security monitoring with mock simulation.</Text>

      <Card style={styles.topCard}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.label}>System Status</Text>
            <Text style={[styles.statusText, alert ? styles.statusAlert : styles.statusSafe]}>
              {alert ? 'THEFT DETECTED' : 'SAFE'}
            </Text>
          </View>
          <MaterialCommunityIcons name={alert ? 'alert-circle' : 'shield-check'} size={34} color={alert ? '#D32F2F' : palette.primary} />
        </View>
      </Card>

      <Animated.View style={[styles.warningCard, animatedStyle]}>
        <MaterialCommunityIcons name="alert-octagon" size={28} color={alert ? '#D32F2F' : palette.primary} />
        <Text style={styles.warningText}>
          {alert ? 'Suspicious activity detected near the meter.' : 'No tampering detected.'}
        </Text>
      </Animated.View>

      <TheftTimeline items={alert ? alertTimeline : safeTimeline} alert={alert} />

      <Button
        mode="contained"
        style={styles.button}
        labelStyle={{ color: '#fff' }}
        onPress={() => setAlert((value) => !value)}
      >
        {alert ? 'Reset Simulation' : 'View Alert History'}
      </Button>
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
    marginBottom: 12,
  },
  topCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: palette.surface,
    marginBottom: 12,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: palette.muted,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 22,
    fontWeight: '700',
  },
  statusSafe: {
    color: palette.primary,
  },
  statusAlert: {
    color: '#D32F2F',
  },
  warningCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: palette.surface,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningText: {
    color: palette.text,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  button: {
    borderRadius: 14,
  },
});

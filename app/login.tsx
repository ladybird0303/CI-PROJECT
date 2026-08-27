import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { BrandMark } from '../components/BrandMark';
import { palette } from '../constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundLayer} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 360 720">
          <Path
            d="M50 120 H120 L150 90 L190 150 L230 110 L290 170"
            stroke={palette.primary}
            strokeOpacity={0.16}
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M40 220 H90 L120 190 H180 L210 250 H270 L315 215"
            stroke={palette.secondary}
            strokeOpacity={0.16}
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M60 330 H140 L170 300 L220 360 L260 330 H320"
            stroke={palette.primary}
            strokeOpacity={0.14}
            strokeWidth="2"
            fill="none"
          />
          <Circle cx="120" cy="120" r="4" fill={palette.primary} fillOpacity={0.2} />
          <Circle cx="290" cy="170" r="4" fill={palette.secondary} fillOpacity={0.2} />
          <Circle cx="180" cy="250" r="4" fill={palette.primary} fillOpacity={0.2} />
          <Line x1="30" y1="500" x2="90" y2="500" stroke={palette.secondary} strokeOpacity={0.16} strokeWidth="2" />
          <Line x1="90" y1="500" x2="120" y2="540" stroke={palette.primary} strokeOpacity={0.16} strokeWidth="2" />
          <Line x1="120" y1="540" x2="200" y2="540" stroke={palette.secondary} strokeOpacity={0.16} strokeWidth="2" />
          <Line x1="200" y1="540" x2="250" y2="480" stroke={palette.primary} strokeOpacity={0.16} strokeWidth="2" />
          <Line x1="250" y1="480" x2="330" y2="480" stroke={palette.secondary} strokeOpacity={0.16} strokeWidth="2" />
        </Svg>
      </View>

      <View style={styles.content}>
        <BrandMark compact />

        <Card style={styles.card}>
          <Text variant="headlineSmall" style={styles.title}>
            Welcome back
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Securely monitor your energy footprint.
          </Text>

          <TextInput
            mode="outlined"
            label="Email"
            placeholder="you@example.com"
            style={styles.input}
            outlineColor={palette.border}
            activeOutlineColor={palette.primary}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            mode="outlined"
            label="Password"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineColor={palette.border}
            activeOutlineColor={palette.primary}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword((value) => !value)}
              />
            }
          />

          <View style={styles.inlineRow}>
            <Text style={styles.linkText}>Forgot Password?</Text>
            <Text style={styles.linkText}>Need help</Text>
          </View>

          <Button
            mode="contained"
            style={styles.button}
            labelStyle={{ color: '#fff' }}
            onPress={() => router.replace('/(tabs)/dashboard')}
          >
            Login
          </Button>

          <Button
            mode="text"
            style={styles.guestButton}
            textColor={palette.secondary}
            onPress={() => router.replace('/(tabs)/dashboard')}
          >
            Continue as Guest
          </Button>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
    justifyContent: 'center',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFill,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    zIndex: 1,
  },
  card: {
    marginTop: 24,
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 3,
    shadowColor: palette.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    color: palette.text,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: palette.muted,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: palette.surface,
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  linkText: {
    color: palette.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    marginTop: 4,
    borderRadius: 14,
  },
  guestButton: {
    marginTop: 6,
  },
});

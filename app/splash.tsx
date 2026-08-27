import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { palette } from '../constants/colors';
import { BrandMark } from '../components/BrandMark';

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 900 });
    scale.value = withTiming(1, { duration: 900 });

    const pulse = setTimeout(() => {
      scale.value = withRepeat(withTiming(1.06, { duration: 700 }), -1, true);
    }, 900);

    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(pulse);
    };
  }, [opacity, router, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <BrandMark />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

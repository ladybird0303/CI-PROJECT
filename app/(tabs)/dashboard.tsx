import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Card, Text } from 'react-native-paper';
import { DashboardHeader } from '../../components/DashboardHeader';
import { SummaryCard } from '../../components/SummaryCard';
import { UsageLineChart } from '../../components/UsageLineChart';
import { ActivityList } from '../../components/ActivityList';
import { palette } from '../../constants/colors';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DashboardHeader name="Savera" />

        <Animated.View entering={FadeInUp.duration(500)}>
          <View style={styles.cardsRow}>
            <SummaryCard title="Current Power" value="2.43 kW" icon="flash" tint={palette.primary} accent="#E8F5E9" />
            <SummaryCard title="Today's Usage" value="18.7 kWh" icon="chart-line" tint={palette.secondary} accent="#E3F2FD" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(500)}>
          <View style={styles.cardsRow}>
            <SummaryCard title="Estimated Bill" value="৳1280" icon="currency-bdt" tint="#F59E0B" accent="#FFF8E1" />
            <SummaryCard title="Theft Status" value="SAFE" icon="shield-check" tint={palette.primary} accent="#E8F5E9" badge="Green" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(220).duration(500)}>
          <UsageLineChart />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(320).duration(500)}>
          <ActivityList />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
});

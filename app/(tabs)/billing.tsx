import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEsp32 } from '../../hooks/useEsp32';
import { getDailySummaries, loadUserSettings, DailySummary, UserSettings } from '../../services/firebase';
import { TARIFF_DEFAULTS, RELAY_CHANNELS } from '../../constants/hardwareConfig';
import { palette } from '../../constants/colors';

export default function BillingScreen() {
  const { power, relays } = useEsp32({ pollIntervalMs: 2000 });
  const [dailyHistory, setDailyHistory] = useState<DailySummary[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const loadBillingData = useCallback(async () => {
    try {
      const [history, config] = await Promise.all([
        getDailySummaries(7),
        loadUserSettings(),
      ]);
      setDailyHistory(history);
      setUserSettings(config);
    } catch {
      /* Firebase optional */
    }
  }, []);

  useEffect(() => {
    loadBillingData();
  }, [loadBillingData]);

  const unitRate = userSettings?.unitPriceBDT ?? TARIFF_DEFAULTS.unitPriceBDT;
  const monthlyBudgetBDT = userSettings?.monthlyBudgetBDT ?? TARIFF_DEFAULTS.monthlyBudgetBDT;
  const monthlyBudgetKWh = userSettings?.monthlyBudgetKWh ?? TARIFF_DEFAULTS.monthlyBudgetKWh;

  const todaySummary = dailyHistory[0];
  const todayKWh = (todaySummary?.totalEnergyWh || 0) / 1000;
  const todayCost = todayKWh * unitRate;

  // Monthly projection based on today's rate
  const estMonthlyKWh = (power * 24 * 30) / 1000;
  const estMonthlyCost = estMonthlyKWh * unitRate;
  const budgetSpentPct = Math.min(100, Math.round((todayCost / monthlyBudgetBDT) * 100));

  const activeRelayCount = relays.filter(Boolean).length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="headlineSmall" style={styles.title}>Billing & Cost Estimation</Text>
        <Text style={styles.subtitle}>
          Electricity Tariff: {TARIFF_DEFAULTS.currency}{unitRate.toFixed(2)} / kWh ({TARIFF_DEFAULTS.currencyCode})
        </Text>

        {/* Current Cost Summary */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="currency-bdt" size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>Today's Electricity Expense</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costValue}>{TARIFF_DEFAULTS.currency}{todayCost.toFixed(2)}</Text>
            <Text style={styles.costKwh}>{todayKWh.toFixed(3)} kWh consumed</Text>
          </View>
          <Text style={styles.costNote}>
            Based on DESCO / DPDC standard rate of {TARIFF_DEFAULTS.currency}{unitRate.toFixed(2)}/kWh
          </Text>
        </Card>

        {/* Monthly Budget Tracker */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="target" size={20} color={palette.primary} />
            <Text style={styles.cardTitle}>Monthly Budget Progress</Text>
          </View>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Target: {TARIFF_DEFAULTS.currency}{monthlyBudgetBDT} ({monthlyBudgetKWh} kWh)</Text>
            <Text style={[styles.budgetPct, { color: budgetSpentPct > 80 ? '#D32F2F' : palette.primary }]}>
              {budgetSpentPct}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${budgetSpentPct}%`,
                  backgroundColor: budgetSpentPct > 80 ? '#D32F2F' : palette.primary,
                },
              ]}
            />
          </View>

          <Text style={styles.budgetSub}>
            Estimated Monthly Spend: {TARIFF_DEFAULTS.currency}{estMonthlyCost.toFixed(0)} ({estMonthlyKWh.toFixed(1)} kWh)
          </Text>
        </Card>

        {/* Per-Relay Load Cost Breakdown */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="chart-pie" size={20} color={palette.secondary} />
            <Text style={styles.cardTitle}>Configured Load Channels ({RELAY_CHANNELS.length})</Text>
          </View>

          {RELAY_CHANNELS.map((ch) => {
            const isOn = relays[ch.channel - 1] ?? false;
            const getIcon = () => {
              if (ch.loadType === 'fan') return 'fan';
              if (ch.loadType === 'motor') return 'engine';
              return 'lightbulb-outline';
            };

            return (
              <View key={ch.channel} style={styles.loadRow}>
                <MaterialCommunityIcons name={getIcon()} size={20} color={isOn ? palette.primary : palette.muted} />
                <View style={styles.loadText}>
                  <Text style={styles.loadName}>{ch.loadName}</Text>
                  <Text style={styles.loadSpec}>GPIO {ch.gpio} • {ch.loadSpec}</Text>
                </View>
                <View style={[styles.statusChip, isOn ? styles.chipOn : styles.chipOff]}>
                  <Text style={[styles.chipText, isOn ? styles.chipTextOn : styles.chipTextOff]}>
                    {isOn ? 'ACTIVE' : 'OFF'}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* 7-Day History */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="calendar-range" size={20} color={palette.primary} />
            <Text style={styles.cardTitle}>Recent Consumption History</Text>
          </View>

          {dailyHistory.length === 0 ? (
            <Text style={styles.emptyText}>No historical daily summaries recorded in Firestore yet.</Text>
          ) : (
            dailyHistory.map((day, idx) => {
              const kWh = (day.totalEnergyWh || 0) / 1000;
              const cost = kWh * unitRate;
              return (
                <View key={idx} style={styles.historyRow}>
                  <Text style={styles.historyDate}>{day.date}</Text>
                  <Text style={styles.historyVal}>{kWh.toFixed(2)} kWh</Text>
                  <Text style={styles.historyCost}>{TARIFF_DEFAULTS.currency}{cost.toFixed(2)}</Text>
                </View>
              );
            })
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: 20, paddingBottom: 32 },
  title: { color: palette.text, fontWeight: '700' },
  subtitle: { color: palette.muted, marginTop: 4, marginBottom: 16, fontSize: 12 },
  card: { borderRadius: 20, padding: 16, backgroundColor: palette.surface, elevation: 2, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  costRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  costValue: { color: '#F59E0B', fontSize: 36, fontWeight: '800' },
  costKwh: { color: palette.secondary, fontSize: 14, fontWeight: '600' },
  costNote: { color: palette.muted, fontSize: 11, marginTop: 4 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  budgetLabel: { color: palette.text, fontSize: 12, fontWeight: '600' },
  budgetPct: { fontSize: 16, fontWeight: '800' },
  progressTrack: { height: 10, backgroundColor: palette.border, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 5 },
  budgetSub: { color: palette.muted, fontSize: 11 },
  loadRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: palette.border },
  loadText: { flex: 1 },
  loadName: { color: palette.text, fontSize: 13, fontWeight: '600' },
  loadSpec: { color: palette.muted, fontSize: 10, marginTop: 1 },
  statusChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  chipOn: { backgroundColor: '#E8F5E9' },
  chipOff: { backgroundColor: '#F5F5F5' },
  chipText: { fontSize: 10, fontWeight: '700' },
  chipTextOn: { color: palette.primary },
  chipTextOff: { color: palette.muted },
  emptyText: { color: palette.muted, fontSize: 12, textAlign: 'center', paddingVertical: 12 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: palette.border },
  historyDate: { color: palette.text, fontSize: 12, fontWeight: '600', flex: 1 },
  historyVal: { color: palette.secondary, fontSize: 12, fontWeight: '600', width: 90, textAlign: 'right' },
  historyCost: { color: '#F59E0B', fontSize: 12, fontWeight: '700', width: 80, textAlign: 'right' },
});

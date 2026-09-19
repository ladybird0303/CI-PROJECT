import React, { useEffect, useState, useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEsp32 } from '../../hooks/useEsp32';
import { getDailySummaries, getRecentRelayEvents, DailySummary, RelayEvent } from '../../services/firebase';
import { RELAY_CHANNELS, SENSORS, ESP32_AP, TARIFF_DEFAULTS } from '../../constants/hardwareConfig';
import { palette } from '../../constants/colors';
import { formatUptime, formatEventTime } from '../../utils/formatters';

export default function DashboardScreen() {
  const { isConnected, voltage, current, power, relays, threshold, uptime } = useEsp32({ pollIntervalMs: 2000 });
  const [dailyData, setDailyData] = useState<DailySummary | null>(null);
  const [recentEvents, setRecentEvents] = useState<RelayEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);

  useEffect(() => {
    if (!isConnected) {
      setConnectionTime(0);
      return;
    }
    const id = setInterval(() => setConnectionTime((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, [isConnected]);

  const loadHistoricalData = useCallback(async () => {
    try {
      const [sums, evs] = await Promise.all([getDailySummaries(1), getRecentRelayEvents(5)]);
      if (sums.length > 0) setDailyData(sums[0]);
      setRecentEvents(evs);
    } catch {
      /* Firebase optional */
    }
  }, []);

  useEffect(() => {
    loadHistoricalData();
  }, [loadHistoricalData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistoricalData();
    setRefreshing(false);
  }, [loadHistoricalData]);

  const activeRelays = relays.filter(Boolean).length;
  const powerPercent = threshold > 0 ? Math.min((power / threshold) * 100, 100) : 0;
  const todayKWh = (dailyData?.totalEnergyWh || 0) / 1000;
  const estCost = todayKWh * TARIFF_DEFAULTS.unitPriceBDT;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[palette.primary]}
            tintColor={palette.primary}
          />
        }
      >
        {/* Connection Banner */}
        <Animated.View entering={FadeInUp.duration(400)}>
          <Card style={[styles.connCard, isConnected ? styles.connOk : styles.connBad]}>
            <View style={styles.connRow}>
              <MaterialCommunityIcons name={isConnected ? 'wifi' : 'wifi-off'} size={20} color="#FFF" />
              <View style={styles.connTxt}>
                <Text style={styles.connTitle}>
                  {isConnected ? `Connected to "${ESP32_AP.ssid}"` : `Disconnected from "${ESP32_AP.ssid}"`}
                </Text>
                <Text style={styles.connSub}>
                  {isConnected
                    ? `ESP32 Uptime: ${formatUptime(uptime)} | Session: ${formatUptime(connectionTime)}`
                    : `Connect your phone to "${ESP32_AP.ssid}" WiFi AP (${ESP32_AP.ip})`}
                </Text>
              </View>
              <View style={[styles.connDot, isConnected ? styles.dotOk : styles.dotBad]} />
            </View>
          </Card>
        </Animated.View>

        {/* Primary Sensor Metric Cards */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <View style={styles.row}>
            <Card style={styles.metric}>
              <View style={[styles.ico, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="flash" size={20} color={palette.primary} />
              </View>
              <Text style={styles.mLbl}>Voltage ({SENSORS.voltage.model})</Text>
              <Text style={styles.mVal}>{voltage.toFixed(1)}</Text>
              <Text style={styles.mUnit}>V</Text>
            </Card>
            <Card style={styles.metric}>
              <View style={[styles.ico, { backgroundColor: '#E3F2FD' }]}>
                <MaterialCommunityIcons name="current-ac" size={20} color={palette.secondary} />
              </View>
              <Text style={styles.mLbl}>Current ({SENSORS.current.model})</Text>
              <Text style={styles.mVal}>{current.toFixed(3)}</Text>
              <Text style={styles.mUnit}>A</Text>
            </Card>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <View style={styles.row}>
            <Card style={styles.metric}>
              <View style={[styles.ico, { backgroundColor: '#FFF8E1' }]}>
                <MaterialCommunityIcons name="lightning-bolt" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.mLbl}>Active Power</Text>
              <Text style={styles.mVal}>{power.toFixed(1)}</Text>
              <Text style={styles.mUnit}>W</Text>
            </Card>
            <Card style={styles.metric}>
              <View style={[styles.ico, { backgroundColor: '#F3E5F5' }]}>
                <MaterialCommunityIcons name="power-plug" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.mLbl}>Active Relays</Text>
              <Text style={styles.mVal}>{activeRelays}/{RELAY_CHANNELS.length}</Text>
              <Text style={styles.mUnit}>channels ON</Text>
            </Card>
          </View>
        </Animated.View>

        {/* Power vs Threshold Gauge */}
        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <Card style={styles.gauge}>
            <Text style={styles.h2}>Power Load vs Trip Threshold</Text>
            <View style={styles.gaugeRow}>
              <View style={styles.gaugeBar}>
                <View
                  style={[
                    styles.gaugeFill,
                    {
                      width: `${powerPercent}%`,
                      backgroundColor: powerPercent > 80 ? '#D32F2F' : palette.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.gaugePct}>{powerPercent.toFixed(0)}%</Text>
            </View>
            <Text style={styles.gaugeLabel}>
              {power.toFixed(1)}W of {threshold.toFixed(1)}W trip limit (set via relay tab)
            </Text>
          </Card>
        </Animated.View>

        {/* Today's Summary */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <Card style={styles.summary}>
            <Text style={styles.h2}>Today's Energy Summary</Text>
            <View style={styles.sumRow}>
              <View style={styles.sumItem}>
                <MaterialCommunityIcons name="chart-line" size={18} color={palette.secondary} />
                <Text style={styles.sumVal}>{todayKWh.toFixed(2)} kWh</Text>
                <Text style={styles.sumLbl}>Energy Consumed</Text>
              </View>
              <View style={styles.sumItem}>
                <MaterialCommunityIcons name="currency-bdt" size={18} color="#F59E0B" />
                <Text style={styles.sumVal}>{TARIFF_DEFAULTS.currency}{estCost.toFixed(0)}</Text>
                <Text style={styles.sumLbl}>Est. Expense</Text>
              </View>
              <View style={styles.sumItem}>
                <MaterialCommunityIcons name="gauge" size={18} color={palette.primary} />
                <Text style={styles.sumVal}>{(dailyData?.peakPower || 0).toFixed(0)}W</Text>
                <Text style={styles.sumLbl}>Peak Load</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Hardware Mapped Relays Status */}
        <Animated.View entering={FadeInUp.delay(500).duration(500)}>
          <Card style={styles.relays}>
            <Text style={styles.h2}>Relay Channel Status</Text>
            {RELAY_CHANNELS.map((ch) => {
              const on = relays[ch.channel - 1] ?? false;
              return (
                <View key={ch.channel} style={styles.relayRow}>
                  <MaterialCommunityIcons
                    name="power-plug"
                    size={18}
                    color={on ? palette.primary : palette.muted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.relayName}>{ch.loadName}</Text>
                    <Text style={styles.relaySub}>GPIO {ch.gpio} • {ch.loadSpec}</Text>
                  </View>
                  <View style={[styles.badge, on ? styles.badgeOn : styles.badgeOff]}>
                    <Text style={[styles.badgeTxt, on ? styles.badgeOnTxt : styles.badgeOffTxt]}>
                      {on ? 'ON' : 'OFF'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </Animated.View>

        {/* Recent Events */}
        <Animated.View entering={FadeInUp.delay(600).duration(500)}>
          <Card style={styles.activity}>
            <Text style={styles.h2}>Recent Hardware Activity</Text>
            {recentEvents.length === 0 ? (
              <Text style={styles.empty}>No recent events logged in database yet.</Text>
            ) : (
              recentEvents.map((ev, i) => (
                <View key={i} style={styles.actRow}>
                  <View
                    style={[
                      styles.actIco,
                      { backgroundColor: ev.state ? '#E8F5E9' : '#FFEBEE' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        ev.source === 'threshold'
                          ? 'alert-circle'
                          : ev.source === 'button'
                          ? 'gesture-tap-button'
                          : 'cellphone'
                      }
                      size={16}
                      color={ev.state ? palette.primary : '#D32F2F'}
                    />
                  </View>
                  <View style={styles.actTxt}>
                    <Text style={styles.actTitle}>
                      {ev.relayName || `Channel ${ev.channel}`} {ev.state ? 'ON' : 'OFF'}
                      {ev.source === 'threshold' ? ' (auto-trip)' : ''}
                    </Text>
                    <Text style={styles.actTime}>
                      via {ev.source} • {formatEventTime(ev.timestamp)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 24 },
  row: { flexDirection: 'row', marginBottom: 8 },
  connCard: { borderRadius: 16, padding: 14, marginBottom: 16, elevation: 2 },
  connOk: { backgroundColor: palette.primary },
  connBad: { backgroundColor: '#D32F2F' },
  connRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  connTxt: { flex: 1 },
  connTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  connSub: { color: '#FFF', fontSize: 11, marginTop: 2, opacity: 0.85 },
  connDot: { width: 10, height: 10, borderRadius: 5 },
  dotOk: { backgroundColor: '#66BB6A' },
  dotBad: { backgroundColor: '#EF5350' },
  metric: { flex: 1, borderRadius: 20, padding: 14, margin: 4, backgroundColor: palette.surface, elevation: 2 },
  ico: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  mLbl: { color: palette.muted, fontSize: 11, marginBottom: 4 },
  mVal: { color: palette.text, fontSize: 22, fontWeight: '700' },
  mUnit: { color: palette.secondary, fontSize: 11, marginTop: 2 },
  gauge: { borderRadius: 20, padding: 16, marginBottom: 12, backgroundColor: palette.surface, elevation: 2 },
  h2: { color: palette.text, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  gaugeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gaugeBar: { flex: 1, height: 12, backgroundColor: palette.border, borderRadius: 6, overflow: 'hidden' },
  gaugeFill: { height: '100%', borderRadius: 6 },
  gaugePct: { color: palette.text, fontSize: 14, fontWeight: '700', minWidth: 36, textAlign: 'right' },
  gaugeLabel: { color: palette.muted, fontSize: 10, marginTop: 6 },
  summary: { borderRadius: 20, padding: 16, marginBottom: 12, backgroundColor: palette.surface, elevation: 2 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-around' },
  sumItem: { alignItems: 'center', gap: 4 },
  sumVal: { color: palette.text, fontSize: 14, fontWeight: '700' },
  sumLbl: { color: palette.muted, fontSize: 10 },
  relays: { borderRadius: 20, padding: 16, marginBottom: 12, backgroundColor: palette.surface, elevation: 2 },
  relayRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: palette.border, gap: 10 },
  relayName: { color: palette.text, fontSize: 13, fontWeight: '600' },
  relaySub: { color: palette.muted, fontSize: 10, marginTop: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  badgeOn: { backgroundColor: '#E8F5E9' },
  badgeOff: { backgroundColor: '#F5F5F5' },
  badgeTxt: { fontSize: 11, fontWeight: '700' },
  badgeOnTxt: { color: palette.primary },
  badgeOffTxt: { color: palette.muted },
  activity: { borderRadius: 20, padding: 16, backgroundColor: palette.surface, elevation: 2 },
  empty: { color: palette.muted, fontSize: 12, textAlign: 'center', paddingVertical: 16 },
  actRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: palette.border, gap: 10 },
  actIco: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actTxt: { flex: 1 },
  actTitle: { color: palette.text, fontSize: 13, fontWeight: '600' },
  actTime: { color: palette.muted, fontSize: 11, marginTop: 2 },
});

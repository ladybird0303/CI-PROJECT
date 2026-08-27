import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { PieChart, Zap, DollarSign, Cpu, Fan, Lightbulb } from 'lucide-react-native';
import { Header } from '../components/Header';
import { UsageChart } from '../components/UsageChart';
import { useEnergy } from '../context/EnergyContext';

export const AnalyticsScreen: React.FC = () => {
  const { metrics, settings, relays } = useEnergy();

  const totalApplianceWatts = relays.reduce((sum, r) => sum + (r.isOn ? r.powerWatts : 0), 0);

  const estimatedMonthlyKWh = ((metrics.currentPowerKw * 24 * 30)).toFixed(1);
  const estimatedMonthlyBDT = (parseFloat(estimatedMonthlyKWh) * settings.unitPriceBDT).toFixed(2);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Usage Trend Chart */}
        <UsageChart />

        {/* Cost Projection Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <DollarSign size={18} color="#F59E0B" />
            <Text style={styles.cardTitle}>MONTHLY COST PROJECTION</Text>
          </View>

          <View style={styles.projectionGrid}>
            <View style={styles.projItem}>
              <Text style={styles.projLabel}>Est. Monthly Units</Text>
              <Text style={styles.projValue}>{estimatedMonthlyKWh} kWh</Text>
            </View>

            <View style={styles.projItem}>
              <Text style={styles.projLabel}>Est. Monthly Bill</Text>
              <Text style={[styles.projValue, { color: '#F59E0B' }]}>৳{estimatedMonthlyBDT}</Text>
            </View>
          </View>
        </View>

        {/* Appliance Power Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <PieChart size={18} color="#3B82F6" />
            <Text style={styles.cardTitle}>APPLIANCE LOAD BREAKDOWN</Text>
          </View>

          <View style={styles.applianceList}>
            {relays.map((relay) => {
              const sharePercent = totalApplianceWatts > 0 && relay.isOn
                ? Math.round((relay.powerWatts / totalApplianceWatts) * 100)
                : 0;

              const getIcon = () => {
                if (relay.loadType === 'fan') return <Fan size={16} color="#10B981" />;
                if (relay.loadType === 'motor') return <Cpu size={16} color="#3B82F6" />;
                if (relay.loadType === 'light') return <Lightbulb size={16} color="#F59E0B" />;
                return <Zap size={16} color="#8B5CF6" />;
              };

              return (
                <View key={relay.id} style={styles.appItem}>
                  <View style={styles.appLeft}>
                    <View style={styles.appIconBox}>{getIcon()}</View>
                    <View>
                      <Text style={styles.appName}>{relay.name}</Text>
                      <Text style={styles.appWatts}>
                        {relay.powerWatts} W {relay.isOn ? '• ACTIVE' : '• OFF'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.appRight}>
                    <Text style={styles.sharePercent}>{sharePercent}%</Text>
                    <Text style={styles.shareLabel}>Load Share</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  projectionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 10,
  },
  projItem: {
    flex: 1,
  },
  projLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  projValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 2,
  },
  applianceList: {
    gap: 10,
  },
  appItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 10,
  },
  appLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  appWatts: {
    fontSize: 10,
    color: '#94A3B8',
  },
  appRight: {
    alignItems: 'flex-end',
  },
  sharePercent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3B82F6',
  },
  shareLabel: {
    fontSize: 9,
    color: '#64748B',
  },
});

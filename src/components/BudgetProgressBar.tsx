import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Target, AlertCircle } from 'lucide-react-native';
import { useEnergy } from '../context/EnergyContext';

export const BudgetProgressBar: React.FC = () => {
  const { metrics, settings } = useEnergy();

  const percentSpent = Math.min(100, Math.round((metrics.totalCostBDT / settings.monthlyBudgetBDT) * 100));
  const percentKWh = Math.min(100, Math.round((metrics.totalConsumptionKWh / settings.monthlyBudgetKWh) * 100));

  const isNearLimit = percentSpent >= 80;
  const isOverBudget = percentSpent >= 100;

  const getBarColor = () => {
    if (isOverBudget) return '#EF4444';
    if (isNearLimit) return '#F59E0B';
    return '#10B981';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Target size={18} color="#3B82F6" />
          <Text style={styles.title}>MONTHLY BUDGET GOAL</Text>
        </View>
        <Text style={[styles.percentBadge, { color: getBarColor() }]}>{percentSpent}%</Text>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentSpent}%`, backgroundColor: getBarColor() }]} />
      </View>

      <View style={styles.detailsRow}>
        <View>
          <Text style={styles.label}>Spent: ৳{metrics.totalCostBDT.toFixed(2)}</Text>
          <Text style={styles.subtext}>Limit: ৳{settings.monthlyBudgetBDT.toFixed(2)}</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>{metrics.totalConsumptionKWh.toFixed(1)} / {settings.monthlyBudgetKWh} kWh</Text>
          <Text style={styles.subtext}>Units Consumed</Text>
        </View>
      </View>

      {isNearLimit && (
        <View style={[styles.warningBox, isOverBudget && styles.dangerBox]}>
          <AlertCircle size={14} color={isOverBudget ? '#EF4444' : '#F59E0B'} />
          <Text style={[styles.warningText, isOverBudget && styles.dangerText]}>
            {isOverBudget
              ? 'Monthly budget limit exceeded! Peak tariff rates may apply.'
              : 'Approaching budget limit (80%+ reached). Consider load shedding.'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  percentBadge: {
    fontSize: 16,
    fontWeight: '900',
  },
  track: {
    height: 10,
    backgroundColor: '#0F172A',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  subtext: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  dangerBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  warningText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
    flex: 1,
  },
  dangerText: {
    color: '#EF4444',
  },
});

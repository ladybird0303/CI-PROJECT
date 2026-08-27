import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { BillingSummaryCard } from '../../components/BillingSummaryCard';
import { palette } from '../../constants/colors';

const history = [
  { month: 'July 2026', amount: '৳1280', status: 'Paid' },
  { month: 'June 2026', amount: '৳1210', status: 'Paid' },
  { month: 'May 2026', amount: '৳1140', status: 'Paid' },
  { month: 'April 2026', amount: '৳1085', status: 'Pending' },
];

export default function BillingScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.title}>Billing</Text>
      <Text style={styles.subtitle}>Mock billing overview with no backend.</Text>

      <Card style={styles.heroCard}>
        <Text style={styles.heroLabel}>Current Bill</Text>
        <Text style={styles.heroValue}>৳1280</Text>
        <Text style={styles.heroDetail}>Due on 15 August 2026</Text>
      </Card>

      <View style={styles.row}>
        <BillingSummaryCard label="Previous Bill" value="৳1210" />
        <BillingSummaryCard label="Energy Cost" value="৳980" />
      </View>

      <View style={styles.row}>
        <BillingSummaryCard label="Service Charge" value="৳120" />
        <BillingSummaryCard label="VAT" value="৳180" />
      </View>

      <Card style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>৳1280</Text>
      </Card>

      <Button mode="contained" style={styles.button}>
        Download PDF
      </Button>

      <Text style={styles.historyTitle}>Bill History</Text>
      {history.map((item) => (
        <Card key={item.month} style={styles.historyCard}>
          <View style={styles.historyRow}>
            <Text style={styles.historyMonth}>{item.month}</Text>
            <Text style={styles.historyAmount}>{item.amount}</Text>
          </View>
          <Text style={styles.historyStatus}>{item.status}</Text>
        </Card>
      ))}
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
  heroCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  heroLabel: {
    color: palette.muted,
  },
  heroValue: {
    color: palette.primary,
    fontSize: 30,
    fontWeight: '700',
    marginVertical: 4,
  },
  heroDetail: {
    color: palette.secondary,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  totalCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  totalLabel: {
    color: palette.muted,
  },
  totalValue: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  button: {
    borderRadius: 14,
    marginBottom: 16,
  },
  historyTitle: {
    color: palette.text,
    fontWeight: '700',
    marginBottom: 10,
  },
  historyCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    backgroundColor: palette.surface,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyMonth: {
    color: palette.text,
    fontWeight: '600',
  },
  historyAmount: {
    color: palette.primary,
    fontWeight: '700',
  },
  historyStatus: {
    color: palette.muted,
    marginTop: 4,
  },
});

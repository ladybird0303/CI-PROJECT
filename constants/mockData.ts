import { DeviceInsight, RecommendationItem, StatItem, UsagePoint } from '../types/energy';

export const summaryStats: StatItem[] = [
  {
    label: 'Household score',
    value: '92%',
    detail: '+7% vs last week',
    icon: 'lightning-bolt',
    tint: '#2E7D32',
    accent: '#E8F5E9',
  },
  {
    label: 'Daily usage',
    value: '18.4 kWh',
    detail: '2.1 kWh below target',
    icon: 'flash',
    tint: '#1565C0',
    accent: '#E3F2FD',
  },
  {
    label: 'Peak window',
    value: '7:30 PM',
    detail: 'Lower demand after 8 PM',
    icon: 'clock-time-eight',
    tint: '#F59E0B',
    accent: '#FFF8E1',
  },
];

export const hourlyUsage: UsagePoint[] = [
  { label: '6 AM', value: 18 },
  { label: '8 AM', value: 24 },
  { label: '10 AM', value: 20 },
  { label: '12 PM', value: 16 },
  { label: '2 PM', value: 22 },
  { label: '4 PM', value: 27 },
  { label: '6 PM', value: 31 },
  { label: '8 PM', value: 19 },
];

export const weeklyTrend: UsagePoint[] = [
  { label: 'Mon', value: 24 },
  { label: 'Tue', value: 22 },
  { label: 'Wed', value: 20 },
  { label: 'Thu', value: 27 },
  { label: 'Fri', value: 23 },
  { label: 'Sat', value: 29 },
  { label: 'Sun', value: 21 },
];

export const deviceInsights: DeviceInsight[] = [
  { name: 'HVAC', load: 72, efficiency: 'Optimal' },
  { name: 'Water heater', load: 64, efficiency: 'Stable' },
  { name: 'Laundry', load: 48, efficiency: 'Improving' },
];

export const recommendations: RecommendationItem[] = [
  {
    title: 'Shift laundry to early afternoon',
    detail: 'Runs are 12% cheaper before the evening peak period.',
    impact: 'Save 1.6 kWh this week',
    chip: 'Best savings',
  },
  {
    title: 'Maintain HVAC schedule',
    detail: 'The current cooling routine stays within the comfort range.',
    impact: 'Keeps comfort above 94%',
    chip: 'Comfort',
  },
  {
    title: 'Use solar charging window',
    detail: 'Plug in EV at noon to take advantage of the best production window.',
    impact: 'Reduce cost by 8%',
    chip: 'Smart timing',
  },
];

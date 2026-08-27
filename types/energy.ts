export interface UsagePoint {
  label: string;
  value: number;
}

export interface StatItem {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tint: string;
  accent: string;
}

export interface RecommendationItem {
  title: string;
  detail: string;
  impact: string;
  chip: string;
}

export interface DeviceInsight {
  name: string;
  load: number;
  efficiency: string;
}

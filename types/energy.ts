// =============================================================================
// Type Definitions — Hardware Topology & Energy Data
// Matches the real wiring from connections_2.pdf
// =============================================================================

// --- Hardware Topology ---

export interface RelayChannel {
  channel: number;         // 1, 2, or 3
  gpio: number;            // ESP32 GPIO pin
  loadName: string;        // Human-readable load name (e.g. "LED Traffic Light")
  loadSpec: string;        // Full component spec
  loadType: 'light' | 'fan' | 'motor';
  relayPin: string;        // Board label (e.g. "IN1")
  contactUsed: 'NO' | 'NC'; // Normally Open or Normally Closed
}

export interface SensorConfig {
  model: string;
  gpio: number;
  unit: string;
  maxRange: number;
  description: string;
  wiringNote: string;
}

export interface BuzzerConfig {
  gpio: number;
  model: string;
  driver: string;          // Transistor used
  wiringNote: string;
}

export interface ButtonConfig {
  index: number;
  gpio: number;
  label: string;
}

export interface DisplayConfig {
  model: string;
  i2cAddress: string;
  columns: number;
  rows: number;
  sdaGpio: number;
  sclGpio: number;
  wiringNote: string;
}

export interface BuckConverterConfig {
  model: string;
  inputV: number;
  outputV: number;
  purpose: string;
}

export interface PowerSupplyConfig {
  adapter: string;
  buckConverter1: BuckConverterConfig;
  buckConverter2: BuckConverterConfig;
  maxCurrentA: number;
}

// --- Firebase / API Data Shapes (from services/firebase.ts) ---

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

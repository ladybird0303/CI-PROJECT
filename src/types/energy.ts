export interface RelayState {
  id: string;
  name: string;
  loadType: 'fan' | 'motor' | 'light' | 'spare';
  hardwarePin: string;
  isOn: boolean;
  powerWatts: number;
  isTrippedByTheft: boolean;
}

export interface TheftAlert {
  id: string;
  timestamp: string;
  type: 'COVER_OPEN' | 'LINE_MISMATCH' | 'OPTICAL_PULSE_ANOMALY' | 'MANUAL_EMERGENCY';
  location: string;
  severity: 'CRITICAL' | 'WARNING';
  smsSentTo: string;
  buzzerActive: boolean;
  relaysCutoff: boolean;
  resolved: boolean;
}

export interface TariffSettings {
  unitPriceBDT: number; // Cost per kWh in BDT (Tk)
  monthlyBudgetBDT: number; // Budget target in BDT
  monthlyBudgetKWh: number; // Budget target in kWh
  autoRelayCutoffOnTheft: boolean;
  smsAlertEnabled: boolean;
  emergencyPhoneNumber: string;
  esp8266IpAddress: string;
}

export interface EnergyMetrics {
  currentPowerKw: number;
  totalConsumptionKWh: number;
  totalCostBDT: number;
  voltageV: number;
  currentAmp: number;
  pulseRateImpKWh: number;
  lastPulseTime: string;
}

export interface HardwareStatus {
  esp8266Connected: boolean;
  esp8266Rssi: number;
  gsmConnected: boolean;
  gsmSignalPercent: number;
  optocouplerActive: boolean;
  lcdI2cStatus: 'OK' | 'DISCONNECTED';
  theftSwitchTriggered: boolean;
  localBuzzerActive: boolean;
}

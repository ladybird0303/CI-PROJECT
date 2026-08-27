import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EnergyMetrics,
  HardwareStatus,
  RelayState,
  TariffSettings,
  TheftAlert,
} from '../types/energy';

interface EnergyContextType {
  metrics: EnergyMetrics;
  hardware: HardwareStatus;
  relays: RelayState[];
  alerts: TheftAlert[];
  settings: TariffSettings;
  isTheftActive: boolean;
  toggleRelay: (id: string) => void;
  masterPowerToggle: (turnOn: boolean) => void;
  triggerTheftSimulation: (type?: TheftAlert['type']) => void;
  clearTheftAlarm: () => void;
  resolveAlert: (alertId: string) => void;
  updateSettings: (newSettings: Partial<TariffSettings>) => void;
}

const initialRelays: RelayState[] = [
  {
    id: 'relay-1',
    name: '5V/12V Brushless Fan',
    loadType: 'fan',
    hardwarePin: 'Relay CH1 (Pin D4)',
    isOn: true,
    powerWatts: 45,
    isTrippedByTheft: false,
  },
  {
    id: 'relay-2',
    name: '5V DC Toy Motor',
    loadType: 'motor',
    hardwarePin: 'Relay CH2 (Pin D5)',
    isOn: true,
    powerWatts: 120,
    isTrippedByTheft: false,
  },
  {
    id: 'relay-3',
    name: '5V COB LED Grid Light',
    loadType: 'light',
    hardwarePin: 'Relay CH3 (Pin D6)',
    isOn: true,
    powerWatts: 85,
    isTrippedByTheft: false,
  },
  {
    id: 'relay-4',
    name: 'Auxiliary Line / Spare',
    loadType: 'spare',
    hardwarePin: 'Relay CH4 (Pin D7)',
    isOn: false,
    powerWatts: 0,
    isTrippedByTheft: false,
  },
];

const initialSettings: TariffSettings = {
  unitPriceBDT: 8.50, // 8.50 BDT per kWh (DESCO / DPDC average rate)
  monthlyBudgetBDT: 2500, // BDT target
  monthlyBudgetKWh: 300, // kWh target
  autoRelayCutoffOnTheft: true,
  smsAlertEnabled: true,
  emergencyPhoneNumber: '+880 1712-345678',
  esp8266IpAddress: '192.168.1.105',
};

const initialAlerts: TheftAlert[] = [
  {
    id: 'alt-101',
    timestamp: '2026-07-28 21:14:02',
    type: 'LINE_MISMATCH',
    location: 'Main Distribution Tap (Line 2)',
    severity: 'CRITICAL',
    smsSentTo: '+880 1712-345678',
    buzzerActive: false,
    relaysCutoff: true,
    resolved: true,
  },
  {
    id: 'alt-100',
    timestamp: '2026-07-25 14:30:11',
    type: 'COVER_OPEN',
    location: 'Physical Meter Enclosure Switch',
    severity: 'WARNING',
    smsSentTo: '+880 1712-345678',
    buzzerActive: false,
    relaysCutoff: false,
    resolved: true,
  },
];

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TariffSettings>(initialSettings);
  const [relays, setRelays] = useState<RelayState[]>(initialRelays);
  const [alerts, setAlerts] = useState<TheftAlert[]>(initialAlerts);
  const [isTheftActive, setIsTheftActive] = useState<boolean>(false);

  const [hardware, setHardware] = useState<HardwareStatus>({
    esp8266Connected: true,
    esp8266Rssi: -62,
    gsmConnected: true,
    gsmSignalPercent: 88,
    optocouplerActive: true,
    lcdI2cStatus: 'OK',
    theftSwitchTriggered: false,
    localBuzzerActive: false,
  });

  const [metrics, setMetrics] = useState<EnergyMetrics>({
    currentPowerKw: 0.25, // 250W
    totalConsumptionKWh: 142.75,
    totalCostBDT: 142.75 * 8.50,
    voltageV: 228.4,
    currentAmp: 1.09,
    pulseRateImpKWh: 3200,
    lastPulseTime: 'Just now',
  });

  // Simulated live telemetry loop
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        // Calculate active power from enabled relays
        const activeWatts = relays.reduce((sum, r) => (r.isOn && !r.isTrippedByTheft ? sum + r.powerWatts : 0), 0);
        const randomFlake = isTheftActive ? (Math.random() * 0.4 + 0.8) : (Math.random() * 0.05 - 0.025);
        const powerKw = Math.max(0, parseFloat(((activeWatts / 1000) + (activeWatts > 0 ? randomFlake : 0)).toFixed(2)));

        const addedKWh = (powerKw / 3600) * 2; // Simulated 2-sec tick accumulation
        const newTotalKWh = parseFloat((prev.totalConsumptionKWh + addedKWh).toFixed(4));
        const newCost = parseFloat((newTotalKWh * settings.unitPriceBDT).toFixed(2));
        const newAmp = powerKw > 0 ? parseFloat(((powerKw * 1000) / prev.voltageV).toFixed(2)) : 0;
        const newVoltage = parseFloat((220 + (Math.random() * 8 - 4)).toFixed(1));

        return {
          ...prev,
          currentPowerKw: powerKw,
          totalConsumptionKWh: newTotalKWh,
          totalCostBDT: newCost,
          voltageV: newVoltage,
          currentAmp: newAmp,
          lastPulseTime: new Date().toLocaleTimeString(),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [relays, isTheftActive, settings.unitPriceBDT]);

  const toggleRelay = (id: string) => {
    setRelays((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isOn: !r.isOn, isTrippedByTheft: false } : r))
    );
  };

  const masterPowerToggle = (turnOn: boolean) => {
    setRelays((prev) =>
      prev.map((r) => ({
        ...r,
        isOn: turnOn,
        isTrippedByTheft: turnOn ? false : r.isTrippedByTheft,
      }))
    );
  };

  const triggerTheftSimulation = (type: TheftAlert['type'] = 'LINE_MISMATCH') => {
    setIsTheftActive(true);
    setHardware((prev) => ({
      ...prev,
      theftSwitchTriggered: true,
      localBuzzerActive: true,
    }));

    if (settings.autoRelayCutoffOnTheft) {
      setRelays((prev) =>
        prev.map((r) => ({ ...r, isOn: false, isTrippedByTheft: true }))
      );
    }

    const newAlert: TheftAlert = {
      id: `alt-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type,
      location: type === 'COVER_OPEN' ? 'Meter Box Tamper Microswitch' : 'Differential Current Transducer (Illegal Wire Tap)',
      severity: 'CRITICAL',
      smsSentTo: settings.smsAlertEnabled ? settings.emergencyPhoneNumber : 'Disabled',
      buzzerActive: true,
      relaysCutoff: settings.autoRelayCutoffOnTheft,
      resolved: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
  };

  const clearTheftAlarm = () => {
    setIsTheftActive(false);
    setHardware((prev) => ({
      ...prev,
      theftSwitchTriggered: false,
      localBuzzerActive: false,
    }));
    setRelays((prev) =>
      prev.map((r) => ({ ...r, isTrippedByTheft: false, isOn: true }))
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true, buzzerActive: false } : a))
    );
  };

  const updateSettings = (newSettings: Partial<TariffSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <EnergyContext.Provider
      value={{
        metrics,
        hardware,
        relays,
        alerts,
        settings,
        isTheftActive,
        toggleRelay,
        masterPowerToggle,
        triggerTheftSimulation,
        clearTheftAlarm,
        resolveAlert,
        updateSettings,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};

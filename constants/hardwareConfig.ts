// =============================================================================
// Hardware Configuration — Single Source of Truth
// Derived from connections_2.pdf wiring diagram
// =============================================================================
//
// Every component name, GPIO pin, sensor spec, and load description in the app
// comes from this file.  Nothing is hardcoded in screens or components.
// =============================================================================

import { RelayChannel, SensorConfig, BuzzerConfig, ButtonConfig, DisplayConfig, PowerSupplyConfig } from '../types/energy';

// ---------------------------------------------------------------------------
// Relay Channels (3 used out of the 4-channel board)
// ---------------------------------------------------------------------------
// Relay front VCC → ESP32 3.3V
// Relay front GND → Buck-2 OUT -
// Relay side JD-VCC → Buck-2 OUT + (separate supply for coil isolation)
// Relay side VCC — unconnected (jumper removed for opto-isolation)
// Relay CH1/CH2/CH3 COM → Current Sensor Terminal 2 → Breadboard Load Rail

export const RELAY_CHANNELS: RelayChannel[] = [
  {
    channel: 1,
    gpio: 25,
    loadName: 'LED Traffic Light',
    loadSpec: '5V LED Traffic Light Module',
    loadType: 'light',
    relayPin: 'IN1',
    contactUsed: 'NO',
  },
  {
    channel: 2,
    gpio: 26,
    loadName: 'Cooling Fan',
    loadSpec: '5V Cooling Fan, 40×40×7 mm',
    loadType: 'fan',
    relayPin: 'IN2',
    contactUsed: 'NO',
  },
  {
    channel: 3,
    gpio: 27,
    loadName: 'DC Motor',
    loadSpec: '3V-9V Short Shaft 130 DC Motor',
    loadType: 'motor',
    relayPin: 'IN3',
    contactUsed: 'NO',
  },
];

export const RELAY_COUNT = RELAY_CHANNELS.length; // 3

// ---------------------------------------------------------------------------
// Sensors
// ---------------------------------------------------------------------------
// ACS712-5A: OUT → 1kΩ → GPIO 34 → 2kΩ → GND  (voltage divider for 3.3V ADC)
//   VCC → Buck-1 OUT +,  GND → Common GND
//   Terminals inline with load rail (T1 ← Buck-2 OUT+, T2 → Relay COMs)
//
// Voltage Sensor Module (25V max):
//   S → GPIO 35,  VCC → Breadboard Load Rail,  GND → Common GND
//   (+) terminal — unconnected

export const SENSORS: { current: SensorConfig; voltage: SensorConfig } = {
  current: {
    model: 'ACS712-5A',
    gpio: 34,
    unit: 'A',
    maxRange: 5,
    description: 'Hall-effect linear current sensor, ±5A range',
    wiringNote: 'OUT → 1kΩ → GPIO 34 → 2kΩ → GND (voltage divider for 3.3V ADC)',
  },
  voltage: {
    model: 'Voltage Sensor 25V',
    gpio: 35,
    unit: 'V',
    maxRange: 25,
    description: 'Resistive voltage divider detection module, 0–25V DC',
    wiringNote: 'S → GPIO 35, VCC → Load Rail, GND → Common GND',
  },
};

// ---------------------------------------------------------------------------
// Buzzer  (driven via NPN transistor for current amplification)
// ---------------------------------------------------------------------------
// GPIO 14 → 1kΩ → BC547 Base
// BC547 Collector → Buzzer -
// BC547 Emitter → GND rail
// Buzzer + → +5V rail

export const BUZZER: BuzzerConfig = {
  gpio: 14,
  model: '5V Active Buzzer',
  driver: 'BC547 NPN Transistor',
  wiringNote: 'GPIO 14 → 1kΩ → BC547 Base → Collector to Buzzer(-), Emitter to GND',
};

// ---------------------------------------------------------------------------
// Physical Buttons (momentary tactile push, active LOW with internal pull-up)
// ---------------------------------------------------------------------------
// Each button has one leg to its GPIO and the other leg to GND rail

export const BUTTONS: ButtonConfig[] = [
  { index: 1, gpio: 18, label: 'Button 1' },
  { index: 2, gpio: 19, label: 'Button 2' },
  { index: 3, gpio: 23, label: 'Button 3' },
];

// ---------------------------------------------------------------------------
// Display
// ---------------------------------------------------------------------------
// LiquidCrystal_I2C lcd(0x27, 16, 2);
// SDA → GPIO 21,  SCL → GPIO 22
// VCC → Buck-1 OUT +,  GND → Common GND

export const DISPLAY: DisplayConfig = {
  model: '16×2 Serial LCD Module (I2C)',
  i2cAddress: '0x27',
  columns: 16,
  rows: 2,
  sdaGpio: 21,
  sclGpio: 22,
  wiringNote: 'SDA → GPIO 21, SCL → GPIO 22, VCC → 5V rail, GND → Common GND',
};

// ---------------------------------------------------------------------------
// Power Supply
// ---------------------------------------------------------------------------
// AC/DC 9V 2A Switching Adapter → Barrel Connector (Female)
// Buck-1 (LM2596): 9V → 5V for logic rail, sensor VCC, display VCC
// Buck-2 (LM2596): 9V → relay coil voltage for JD-VCC + current sensor terminal

export const POWER_SUPPLY: PowerSupplyConfig = {
  adapter: 'AC/DC 9V 2A Switching Power Supply (2.1mm Barrel Jack)',
  buckConverter1: { model: 'HW-411A LM2596', inputV: 9, outputV: 5, purpose: 'Logic rail, sensor VCC, display VCC, buzzer' },
  buckConverter2: { model: 'HW-411A LM2596', inputV: 9, outputV: 5, purpose: 'Relay JD-VCC coil supply, current sensor terminal' },
  maxCurrentA: 3,
};

// ---------------------------------------------------------------------------
// ESP32 WiFi Access Point
// ---------------------------------------------------------------------------

export const ESP32_AP = {
  ssid: 'SmartEnergyMeter',
  ip: '192.168.4.1',
  port: 80,
  mcu: 'ESP32 (Dual-core Xtensa LX6)',
};

// ---------------------------------------------------------------------------
// Tariff / Billing defaults  (BDT = Bangladeshi Taka)
// ---------------------------------------------------------------------------

export const TARIFF_DEFAULTS = {
  unitPriceBDT: 8.50,        // BDT per kWh
  monthlyBudgetBDT: 2500,
  monthlyBudgetKWh: 300,
  currency: '৳',
  currencyCode: 'BDT',
};

// ---------------------------------------------------------------------------
// Threshold defaults (ACS712-5A supports 0–5A ≈ 0–1150W at 230V)
// ---------------------------------------------------------------------------

export const THRESHOLD_DEFAULTS = {
  minWatts: 0.5,
  maxWatts: 100,   // practical limit for demo loads
  defaultWatts: 10,
};

// =============================================================================
// ESP32 REST API Client
// Communicates with the ESP32 Smart Energy Meter over WiFi AP (192.168.4.1)
// =============================================================================

const ESP32_IP = '192.168.4.1';
const ESP32_PORT = '80';
const BASE_URL = `http://${ESP32_IP}:${ESP32_PORT}`;
const REQUEST_TIMEOUT = 3000; // 3 seconds

// --- Type Definitions ---

export interface Esp32Status {
  relays: [boolean, boolean, boolean];
  voltage: number;
  current: number;
  power: number;
  threshold: number;
  thresholdExceeded: boolean;
  buzzerAlert: boolean;
  calibrated: boolean;
  rssi: number;
  uptime: number;
}

export interface Esp32Health {
  status: string;
  device: string;
  uptime: number;
  clients: number;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface RelayResponse extends ApiResponse {
  channel?: number;
  state?: boolean;
}

export interface ThresholdResponse extends ApiResponse {
  threshold?: number;
}

export interface AcknowledgeResponse extends ApiResponse {
  acknowledged?: boolean;
}

// --- Helper: fetch with timeout ---

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = REQUEST_TIMEOUT,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// --- API Functions ---

/**
 * Check if the ESP32 is reachable and get basic health info.
 */
export async function checkHealth(): Promise<Esp32Health | null> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/api/health`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Get full system status: relay states, sensor readings, threshold state.
 */
export async function getStatus(): Promise<Esp32Status | null> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/api/status`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Toggle a relay channel (1, 2, or 3).
 * @param channel - Relay channel number (1-3)
 * @param state - true to turn ON, false to turn OFF
 */
export async function setRelay(channel: number, state: boolean): Promise<RelayResponse> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/api/relay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, state }),
    });
    return await response.json();
  } catch {
    return { success: false, error: 'network_error', message: 'Cannot reach ESP32' };
  }
}

/**
 * Set the power threshold (0.5W - 100W).
 * When power exceeds this value, all relays cut off and buzzer activates.
 */
export async function setThreshold(value: number): Promise<ThresholdResponse> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/api/threshold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return await response.json();
  } catch {
    return { success: false, error: 'network_error', message: 'Cannot reach ESP32' };
  }
}

/**
 * Acknowledge a threshold breach. This:
 * - Stops the buzzer
 * - Clears the thresholdExceeded latch
 * - Re-enables relay control
 */
export async function acknowledgeThreshold(): Promise<AcknowledgeResponse> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/api/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    return await response.json();
  } catch {
    return { success: false, error: 'network_error', message: 'Cannot reach ESP32' };
  }
}

export { BASE_URL, ESP32_IP };

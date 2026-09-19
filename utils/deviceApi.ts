// =============================================================================
// Device REST API Client
// Talks to the meter's REST surface over the LAN — normally the local bridge
// (D:\local-bridge\server.js) on the laptop, optionally the device itself.
// The host comes from utils/deviceConfig so it can be changed without a rebuild.
// =============================================================================

import { getDeviceBaseUrl } from './deviceConfig';

// The bridge is single-threaded: it serves one request at a time and a status
// read can block behind a sensor burst. A single request can take ~1s, so 3s
// left no headroom and look-alike timeouts caused phantom disconnects.
const REQUEST_TIMEOUT = 6000; // 6 seconds

// --- Type Definitions ---

export interface DeviceStatus {
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

export interface DeviceHealth {
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

export async function fetchWithTimeout(
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
 * Check if the device bridge is reachable and get basic health info.
 */
export async function checkHealth(): Promise<DeviceHealth | null> {
  try {
    const response = await fetchWithTimeout(`${getDeviceBaseUrl()}/api/health`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Coerce a parsed JSON body into a fully-shaped DeviceStatus, or null when the
 * payload is not usable. This is the single choke point that guarantees the UI
 * never receives a status object with a missing/partial `relays` array — the
 * device link can drop or truncate bytes mid-response, and `relays[0]` on an
 * undefined array is a hard crash in relay.tsx.
 */
export function normalizeStatus(raw: unknown): DeviceStatus | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;

  const toBool = (v: unknown, fallback = false): boolean => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') return v === 'true' || v === '1';
    return fallback;
  };
  const toNum = (v: unknown, fallback: number): number => {
    const n = typeof v === 'string' ? Number(v) : (v as number);
    return typeof n === 'number' && Number.isFinite(n) ? n : fallback;
  };

  // relays is crash-critical: it must be present as three entries.
  const r = o.relays;
  if (!Array.isArray(r) || r.length < 3) return null;

  return {
    relays: [toBool(r[0]), toBool(r[1]), toBool(r[2])],
    voltage: toNum(o.voltage, 0),
    current: toNum(o.current, 0),
    power: toNum(o.power, 0),
    threshold: toNum(o.threshold, 10),
    thresholdExceeded: toBool(o.thresholdExceeded),
    buzzerAlert: toBool(o.buzzerAlert),
    calibrated: toBool(o.calibrated),
    rssi: toNum(o.rssi, 0),
    uptime: toNum(o.uptime, 0),
  };
}

/**
 * Get full system status: relay states, sensor readings, threshold state.
 * Returns null (never a malformed object) when the device's reply cannot be
 * parsed into a complete status.
 */
export async function getStatus(): Promise<DeviceStatus | null> {
  try {
    const response = await fetchWithTimeout(`${getDeviceBaseUrl()}/api/status`);
    if (!response.ok) return null;
    const text = await response.text();
    // Slice from the first '{' to the last '}' so framing bytes around the
    // JSON body (line echoes, trailing "OK", bridge wrappers) are ignored.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    return normalizeStatus(JSON.parse(text.slice(start, end + 1)));
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
    const response = await fetchWithTimeout(`${getDeviceBaseUrl()}/api/relay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, state }),
    });
    return await response.json();
  } catch {
    return { success: false, error: 'network_error', message: 'Cannot reach device' };
  }
}

/**
 * Set the power threshold (0.5W - 100W).
 * When power exceeds this value, all relays cut off and buzzer activates.
 */
export async function setThreshold(value: number): Promise<ThresholdResponse> {
  try {
    const response = await fetchWithTimeout(`${getDeviceBaseUrl()}/api/threshold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return await response.json();
  } catch {
    return { success: false, error: 'network_error', message: 'Cannot reach device' };
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
    const response = await fetchWithTimeout(`${getDeviceBaseUrl()}/api/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    return await response.json();
  } catch {
    return { success: false, error: 'network_error', message: 'Cannot reach device' };
  }
}

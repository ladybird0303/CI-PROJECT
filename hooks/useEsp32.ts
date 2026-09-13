// =============================================================================
// useEsp32 — React hook for ESP32 connection polling
// Polls the ESP32 status endpoint at a configurable interval.
// Provides connection state, sensor data, and relay control functions.
// =============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import {
  Esp32Status,
  checkHealth,
  getStatus,
  setRelay,
  setThreshold,
  acknowledgeThreshold,
} from '../utils/esp32Api';
import {
  initFirebase,
  saveEnergyReading,
  logRelayEvent,
} from '../services/firebase';

interface UseEsp32Options {
  pollIntervalMs?: number;   // How often to poll status (default 1500ms)
  enablePolling?: boolean;   // Whether to poll at all (default true)
}

interface UseEsp32Return {
  // Connection state
  isConnected: boolean;
  isPolling: boolean;
  lastError: string | null;

  // Sensor data
  voltage: number;
  current: number;
  power: number;

  // Relay state
  relays: [boolean, boolean, boolean];

  // Threshold
  threshold: number;
  thresholdExceeded: boolean;
  buzzerAlert: boolean;

  // Metadata
  uptime: number;
  calibrated: boolean;

  // Actions
  toggleRelay: (channel: number) => Promise<void>;
  updateThreshold: (value: number) => Promise<void>;
  acknowledgeBreach: () => Promise<void>;
  refreshNow: () => Promise<void>;
}

export function useEsp32(options: UseEsp32Options = {}): UseEsp32Return {
  const {
    pollIntervalMs = 1500,
    enablePolling = true,
  } = options;

  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Sensor data
  const [voltage, setVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [power, setPower] = useState(0);

  // Relay state
  const [relays, setRelays] = useState<[boolean, boolean, boolean]>([false, false, false]);

  // Threshold
  const [threshold, setThresholdState] = useState(10.0);
  const [thresholdExceeded, setThresholdExceeded] = useState(false);
  const [buzzerAlert, setBuzzerAlert] = useState(false);

  // Metadata
  const [uptime, setUptime] = useState(0);
  const [calibrated, setCalibrated] = useState(false);

  // Refs for managing polling
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasThresholdExceeded = useRef(false);
  const lastFirebaseSave = useRef(0);
  const prevRelaysForLog = useRef<[boolean, boolean, boolean]>([false, false, false]);
  const isFirebaseReady = useRef(false);

  // --- Initialize Firebase ---
  useEffect(() => {
    try {
      initFirebase();
      isFirebaseReady.current = true;
      console.log('[useEsp32] Firebase initialized');
    } catch (error) {
      console.warn('[useEsp32] Firebase init failed:', error);
    }
  }, []);

  // --- Core polling function (with Firebase logging) ---
  const pollStatus = useCallback(async () => {
    try {
      setIsPolling(true);
      const status = await getStatus();

      if (status) {
        setIsConnected(true);
        setLastError(null);
        setVoltage(status.voltage);
        setCurrent(status.current);
        setPower(status.power);
        setRelays(status.relays);
        setThresholdState(status.threshold);
        setUptime(status.uptime);
        setCalibrated(status.calibrated);

        // Detect threshold breach transition (false → true)
        if (status.thresholdExceeded && !wasThresholdExceeded.current) {
          Vibration.vibrate([0, 200, 100, 200]);
          // Log threshold breach event
          if (isFirebaseReady.current) {
            logRelayEvent(0, false, 'threshold', 'Threshold Breach').catch(() => {});
          }
        }
        wasThresholdExceeded.current = status.thresholdExceeded;
        setThresholdExceeded(status.thresholdExceeded);
        setBuzzerAlert(status.buzzerAlert);

        // Save energy reading to Firebase every 5 seconds
        if (isFirebaseReady.current) {
          const now = Date.now();
          if (now - lastFirebaseSave.current >= 5000) {
            lastFirebaseSave.current = now;
            saveEnergyReading(
              status.voltage, status.current, status.power, status.relays
            ).catch(() => {});
          }
        }

        // Detect relay state changes from physical buttons
        if (isFirebaseReady.current) {
          for (let i = 0; i < 3; i++) {
            if (status.relays[i] !== prevRelaysForLog.current[i]) {
              logRelayEvent(i + 1, status.relays[i], 'button').catch(() => {});
              prevRelaysForLog.current[i] = status.relays[i];
            }
          }
        }
      } else {
        // getStatus returned null — ESP32 unreachable
        const health = await checkHealth();
        if (!health) {
          setIsConnected(false);
          setLastError('ESP32 unreachable — check WiFi connection');
        }
      }
    } catch (error) {
      setIsConnected(false);
      setLastError('Network error polling ESP32');
    } finally {
      setIsPolling(false);
    }
  }, []);

  // --- Start/stop polling ---
  useEffect(() => {
    if (!enablePolling) return;

    // Immediate first poll
    pollStatus();

    // Set up interval
    intervalRef.current = setInterval(pollStatus, pollIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enablePolling, pollIntervalMs, pollStatus]);

  // --- Actions ---

  const toggleRelay = useCallback(async (channel: number) => {
    const currentState = relays[channel - 1];
    const result = await setRelay(channel, !currentState);
    if (result.success) {
      // Optimistic update
      setRelays((prev) => {
        const next = [...prev] as [boolean, boolean, boolean];
        next[channel - 1] = !currentState;
        return next;
      });
      // Log to Firebase
      if (isFirebaseReady.current) {
        logRelayEvent(channel, !currentState, 'app').catch(() => {});
      }
    }
    // Refresh to get authoritative state
    await pollStatus();
  }, [relays, pollStatus]);

  const updateThreshold = useCallback(async (value: number) => {
    const result = await setThreshold(value);
    if (result.success && result.threshold !== undefined) {
      setThresholdState(result.threshold);
    }
  }, []);

  const acknowledgeBreach = useCallback(async () => {
    const result = await acknowledgeThreshold();
    if (result.success) {
      setThresholdExceeded(false);
      setBuzzerAlert(false);
      wasThresholdExceeded.current = false;
    }
    await pollStatus();
  }, [pollStatus]);

  const refreshNow = useCallback(async () => {
    await pollStatus();
  }, [pollStatus]);

  return {
    isConnected,
    isPolling,
    lastError,
    voltage,
    current,
    power,
    relays,
    threshold,
    thresholdExceeded,
    buzzerAlert,
    uptime,
    calibrated,
    toggleRelay,
    updateThreshold,
    acknowledgeBreach,
    refreshNow,
  };
}

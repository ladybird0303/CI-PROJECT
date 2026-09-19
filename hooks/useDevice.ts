// =============================================================================
// useDevice — React hook for device connection polling
// Polls the device status endpoint at a configurable interval.
// Provides connection state, sensor data, and relay control functions.
// =============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import {
  DeviceStatus,
  getStatus,
  setRelay,
  setThreshold,
  acknowledgeThreshold,
} from '../utils/deviceApi';
import {
  initFirebase,
  saveEnergyReading,
  logRelayEvent,
} from '../services/firebase';

interface UseDeviceOptions {
  pollIntervalMs?: number;   // How often to poll status (default 1500ms)
  enablePolling?: boolean;   // Whether to poll at all (default true)
}

interface ToggleResult {
  ok: boolean;
  latched: boolean;
  /** Human-readable diagnosis when the relay did NOT stay on. */
  note: string;
}

// --- Module-level command arbitration ---------------------------------------
// expo-router keeps Dashboard + Relay tabs mounted, so TWO useDevice instances
// poll the SAME single-threaded device bridge. A Dashboard status poll landing
// mid-command queues behind the sensor-blocked server and corrupts the Relay
// page's verify read. These module globals are shared by every instance:
// while nonzero, background (non-forced) polls skip the fetch entirely.
let globalBusyUntil = 0;
let globalLockHeld = false;
// Cross-instance poll arbiter. The device link is half-duplex: while one
// request is in flight the modem cannot service another, so a second tab's
// poll would time out, inflate its miss counter, and flip the banner red.
// Only ONE background poll may be on the wire at any moment.
let globalPollInFlight = false;

const acquireGlobalLock = async (sleep: (ms: number) => void): Promise<void> => {
  while (globalLockHeld) {
    await sleep(150);
  }
  globalLockHeld = true;
  globalBusyUntil = Date.now() + 12000;
};

const releaseGlobalLock = (): void => {
  globalLockHeld = false;
  globalBusyUntil = 0;
};

const backgroundPollAllowed = (): boolean => Date.now() > globalBusyUntil;

interface UseDeviceReturn {
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
  toggleRelay: (channel: number) => Promise<ToggleResult>;
  /** false when the meter/bridge refused the change — do not claim success. */
  updateThreshold: (value: number) => Promise<boolean>;
  /** false when the acknowledge never reached the meter. */
  acknowledgeBreach: () => Promise<boolean>;
  refreshNow: () => Promise<void>;
  /** True when the last verify pass detected a device uptime reset (brownout). */
  deviceRebooted: boolean;
}

export function useDevice(options: UseDeviceOptions = {}): UseDeviceReturn {
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
  const [deviceRebooted, setDeviceRebooted] = useState(false);

  // Refs for managing polling
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasThresholdExceeded = useRef(false);
  const lastFirebaseSave = useRef(0);
  const prevRelaysForLog = useRef<[boolean, boolean, boolean]>([false, false, false]);
  const isFirebaseReady = useRef(false);
  // While nonzero, background polls must NOT overwrite relay UI: any status
  // arriving in this window predates our command — it is not a revert.
  const freezeRelaysUntil = useRef(0);
  // The Uno/AT bridge is half-duplex and can lose a request while answering a
  // previous one, so a single miss is normal. Only report "disconnected" after
  // two consecutive misses — otherwise the banner flaps red/green continuously.
  const missCount = useRef(0);

  // --- Initialize Firebase ---
  useEffect(() => {
    try {
      initFirebase();
      isFirebaseReady.current = true;
      console.log('[useDevice] Firebase initialized');
    } catch (error) {
      console.warn('[useDevice] Firebase init failed:', error);
    }
  }, []);

  // --- Core polling function (with Firebase logging) ---
  // force=true: the caller explicitly asked for ground truth (e.g. command
  // verification) — relays are always applied regardless of the freeze window.
  const pollStatus = useCallback(async (force: boolean = false): Promise<DeviceStatus | null> => {
    // Shared arbiter: while a command holds the global busy window, background
    // (non-forced) polls from ANY mounted instance skip the wire entirely — the
    // single-threaded device must serve only the command + verify.
    if (!force && Date.now() <= globalBusyUntil) return null;
    // Half-duplex guard: if ANY instance already has a request on the wire,
    // skip this poll WITHOUT counting a miss (returning null before the try
    // block keeps missCount untouched), so concurrent tabs can never make each
    // other look disconnected.
    if (!force && globalPollInFlight) return null;
    if (!force) globalPollInFlight = true;
    try {
      setIsPolling(true);
      const status = await getStatus();

      if (status) {
        missCount.current = 0;
        setIsConnected(true);
        setLastError(null);
        // The device link can return truncated/malformed bodies during a
        // reboot — validate before applying, or `relays` becomes undefined
        // and relay.tsx crashes on relays[0].
        if (typeof status.voltage === 'number') setVoltage(status.voltage);
        if (typeof status.current === 'number') setCurrent(status.current);
        if (typeof status.power === 'number') setPower(status.power);
        // Background polls must not stamp over the relay the user just
        // commanded — an in-flight /api/status carries the pre-command state.
        // The command-verify pass (force=true) is the only writer during freeze.
        if (
          Array.isArray(status.relays) &&
          status.relays.length === 3 &&
          (force || Date.now() > freezeRelaysUntil.current)
        ) {
          setRelays(status.relays as [boolean, boolean, boolean]);
        }
        if (typeof status.threshold === 'number') setThresholdState(status.threshold);
        if (typeof status.uptime === 'number') setUptime(status.uptime);
        if (typeof status.calibrated === 'boolean') setCalibrated(status.calibrated);

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
        // getStatus returned null (timeout, or a body that failed validation).
        // Tolerate one miss; two in a row means the link is genuinely down.
        missCount.current += 1;
        if (missCount.current >= 2) {
          setIsConnected(false);
          setLastError('Device unreachable — check the bridge connection');
        }
        return null;
      }
      return status;
    } catch (error) {
      missCount.current += 1;
      if (missCount.current >= 2) {
        setIsConnected(false);
        setLastError('Network error polling device');
      }
      return null;
    } finally {
      if (!force) globalPollInFlight = false;
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

  const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  // The device bridge is single-threaded: ONE request at a time. A fast double-tap
  // or an in-flight 1500ms status poll colliding with the POST used to make
  // the verify read land on a stale/queued response — looking exactly like a
  // latch failure. Serialize EVERYTHING through this mutex.
  const commandLock = useRef(false);
  const runSerialized = async <T,>(fn: () => Promise<T>): Promise<T> => {
    while (commandLock.current) {
      await sleep(150);
    }
    commandLock.current = true;
    try {
      return await fn();
    } finally {
      commandLock.current = false;
    }
  };

  const pollWithTimeout = async (force: boolean, timeoutMs: number): Promise<DeviceStatus | null> => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const timeout = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), timeoutMs);
    });
    const result = await Promise.race([pollStatus(force), timeout]);
    if (timer) clearTimeout(timer);
    return result;
  };

  // Double-fire guard: controlled Switches on Android can emit a second
  // onValueChange right after the first command completes (prop/state mismatch
  // during the gesture) — that second event toggles the relay straight back
  // OFF and looks exactly like a latch failure.
  const lastToggleAt = useRef<number[]>([0, 0, 0]);

  const toggleRelay = useCallback(async (channel: number): Promise<ToggleResult> => {
    if (Date.now() - lastToggleAt.current[channel - 1] < 2000) {
      return {
        ok: false,
        latched: false,
        note: 'Ignored — this channel was toggled <2s ago (double-fire guard).',
      };
    }
    globalBusyUntil = Date.now() + 12000;
    try {
      return await runSerialized(async () => {
      const currentState = relays[channel - 1];
      const desired = !currentState;
      const uptimeBefore = uptime;

      // Freeze background relay overwrite while we command + verify (kills the
      // stale in-flight poll race: an old /api/status arriving now is truth from
      // *before* our command, not a revert).
      freezeRelaysUntil.current = Date.now() + 2500;
      setDeviceRebooted(false);

      const result = await setRelay(channel, desired);
      if (!result.success) {
        freezeRelaysUntil.current = 0;
        await pollStatus(true);
        return {
          ok: false,
          latched: false,
          note: result.error === 'network_error'
            ? 'Command never reached the device (network). Relay unchanged.'
            : (result.message || 'Relay command rejected by the device.'),
        };
      }

      // Mark as app-initiated so the poll loop does not mis-log it as a button press
      prevRelaysForLog.current[channel - 1] = desired;
      // Log to Firebase
      if (isFirebaseReady.current) {
        logRelayEvent(channel, desired, 'app').catch(() => {});
      }

      // The device's sensor loop runs every 500ms and each ADC read blocks the
      // single-threaded bridge for ~1s. Ask for ground truth with a generous
      // timeout; a late arrival is the "revert".
      const status = await pollWithTimeout(true, 8000);
      freezeRelaysUntil.current = Date.now() + 1200;

      if (!status) {
        return { ok: false, latched: false, note: 'Device did not answer the verify read (timed out). Tap once and wait for the indicator to clear.' };
      }
      if (status.relays[channel - 1] === desired) {
        return { ok: true, latched: true, note: '' };
      }
      // Relay released itself — diagnose the cause from observable device signals.
      if (status.thresholdExceeded) {
        return {
          ok: false,
          latched: false,
          note: `Threshold tripped: ${status.power.toFixed(1)}W > ${status.threshold.toFixed(1)}W — the device cut the relay, not the app. Raise the limit or reduce load, then ACK.`,
        };
      }
      if (status.uptime < uptimeBefore - 2) {
        setDeviceRebooted(true);
        return {
          ok: false,
          latched: false,
          note: 'Device rebooted during the command (uptime reset) — coil inrush browned it out. Move relay JD-VCC to the other buck rail.',
        };
      }
      return {
        ok: false,
        latched: false,
        note: 'Relay did not latch — the POST likely queued behind a sensor-blocked server and never applied. Tap once and wait.',
      };
      });
    } finally {
      globalBusyUntil = 0;
      lastToggleAt.current[channel - 1] = Date.now();
    }
  }, [relays, uptime, pollStatus]);

  // Returns false when the bridge refused (400 invalid range / 503 no device
  // link) so the UI never claims a change that did not reach the meter.
  const updateThreshold = useCallback(async (value: number): Promise<boolean> => {
    const result = await setThreshold(value);
    if (result.success && result.threshold !== undefined) {
      setThresholdState(result.threshold);
      return true;
    }
    return false;
  }, []);

  const acknowledgeBreach = useCallback(async (): Promise<boolean> => {
    const result = await acknowledgeThreshold();
    const ok = !!result.success;
    if (ok) {
      setThresholdExceeded(false);
      setBuzzerAlert(false);
      wasThresholdExceeded.current = false;
    }
    freezeRelaysUntil.current = 0;
    await pollStatus(true);
    return ok;
  }, [pollStatus]);

  const refreshNow = useCallback(async () => {
    await pollStatus(true);
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
    deviceRebooted,
  };
}

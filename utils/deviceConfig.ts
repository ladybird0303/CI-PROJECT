// =============================================================================
// Device endpoint configuration
// ONE place to point the app at whichever host serves the /api/* contract:
//   - the local bridge on the laptop   (e.g. http://192.168.137.1:3000)
//   - the meter's own access point     (default http://192.168.4.1)
// Precedence: runtime override (Profile screen) > EXPO_PUBLIC_DEVICE_URL > default
// =============================================================================

const ENV_URL = process.env.EXPO_PUBLIC_DEVICE_URL;

/** Used when neither a runtime override nor an .env value is present. */
export const DEFAULT_DEVICE_URL = 'http://192.168.4.1';

let runtimeOverride: string | null = null;

/**
 * Normalize user input into `http://host[:port]` with no trailing slash:
 *   "192.168.137.1:3000"  -> "http://192.168.137.1:3000"
 *   "http://host:3000/"   -> "http://host:3000"
 */
export function normalizeDeviceUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
}

/** Effective base URL (never has a trailing slash). */
export function getDeviceBaseUrl(): string {
  if (runtimeOverride) return runtimeOverride;
  if (ENV_URL && ENV_URL.trim()) return normalizeDeviceUrl(ENV_URL);
  return DEFAULT_DEVICE_URL;
}

/** Session-only override; pass null to fall back to .env / default. */
export function setDeviceBaseUrl(url: string | null): string {
  runtimeOverride = url && url.trim() ? normalizeDeviceUrl(url) : null;
  return getDeviceBaseUrl();
}

/** Where the current value came from — surfaced on the Profile screen. */
export function deviceUrlSource(): 'override' | 'env' | 'default' {
  if (runtimeOverride) return 'override';
  if (ENV_URL && ENV_URL.trim()) return 'env';
  return 'default';
}
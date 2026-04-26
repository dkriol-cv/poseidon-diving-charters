/**
 * Utility to detect if WebSocket is available and working in the current environment.
 * This helps prevent errors in environments that block WebSockets or have mixed content issues.
 */

export const isWebSocketAvailable = () => {
  if (typeof window === 'undefined') return false; // SSR
  if (typeof WebSocket === 'undefined') return false; // Browser doesn't support WS
  return true;
};

/**
 * Determines if Realtime features should be enabled based on environment.
 */
export const shouldEnableRealtime = () => {
  // Basic check for WebSocket support
  if (!isWebSocketAvailable()) {
    console.warn('[Realtime] WebSockets not available. Realtime features disabled.');
    return false;
  }

  // Additional checks can be added here (e.g., user preferences, low data mode, etc.)
  return true;
};
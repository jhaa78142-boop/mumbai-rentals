type EventPayload = Record<string, any>;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Lightweight analytics hook.
 * - Logs to console in dev
 * - If gtag exists, sends an event
 * - If dataLayer exists, pushes an event
 */
export function track(event: string, payload: EventPayload = {}) {
  try {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[track]", event, payload);
    }
    if (typeof window !== "undefined") {
      window.gtag?.("event", event, payload);
      window.dataLayer?.push({ event, ...payload });
    }
  } catch {
    // no-op
  }
}
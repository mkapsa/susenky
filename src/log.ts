import type { ConsentLogPayload, StoredConsent } from './types';
import { getConfig } from './config';

export function logConsent(stored: StoredConsent): void {
  const config = getConfig();
  if (!config.logEndpoint) return;

  // Strip query params to avoid logging PII (UTM params, etc.)
  const pageUrl = window.location.origin + window.location.pathname;

  const payload: ConsentLogPayload = {
    timestamp: stored.timestamp,
    version: stored.version,
    userId: stored.userId,
    pageUrl,
    choices: stored.choices,
  };

  try {
    fetch(config.logEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Fire-and-forget — do not block consent flow
  }
}

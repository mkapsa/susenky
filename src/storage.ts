import type { ConsentChoices, StoredConsent } from './types';

const STORAGE_KEY = 'cookie_consent';
const USER_ID_KEY = 'cookie_consent_uid';

export function getUserId(): string {
  let uid = localStorage.getItem(USER_ID_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, uid);
  }
  return uid;
}

export function readConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredConsent;
  } catch {
    return null;
  }
}

export function writeConsent(choices: ConsentChoices, version: string): StoredConsent {
  const stored: StoredConsent = {
    version,
    choices,
    timestamp: new Date().toISOString(),
    userId: getUserId(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  return stored;
}

export function clearConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
}

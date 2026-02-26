export type ConsentValue = 'granted' | 'denied';

export interface ConsentChoices {
  functional: true;
  analytics: boolean;
  marketing: boolean;
}

export interface StoredConsent {
  version: string;
  choices: ConsentChoices;
  timestamp: string;
  userId: string;
}

export interface CookieConsentConfig {
  consentVersion: string;
  logEndpoint: string;
  primaryColor: string;
  siteName: string;
  cookiePolicyUrl: string;
  logoUrl?: string;
  categories: {
    analytics: { label: string; description: string };
    marketing: { label: string; description: string };
  };
}

export interface ConsentLogPayload {
  timestamp: string;
  version: string;
  userId: string;
  pageUrl: string;
  choices: ConsentChoices;
}

declare global {
  interface Window {
    CookieConsentConfig?: Partial<CookieConsentConfig>;
    CookieConsent?: {
      showPreferences: () => void;
    };
    dataLayer: Array<unknown>;
    gtag: (...args: unknown[]) => void;
    fbq: ((...args: unknown[]) => void) & {
      queue?: unknown[][];
      callMethod?: (...args: unknown[]) => void;
      loaded?: boolean;
    };
    _fbq?: typeof window.fbq;
  }
}

export {};

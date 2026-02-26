import type { CookieConsentConfig } from './types';

const DEFAULTS: CookieConsentConfig = {
  consentVersion: '1.0',
  logEndpoint: '',
  primaryColor: '#6B1D3A',
  siteName: 'This website',
  cookiePolicyUrl: '/cookie-policy',
  categories: {
    analytics: {
      label: 'Analytické',
      description: 'Pomáhají nám pochopit, jak návštěvníci používají web.',
    },
    marketing: {
      label: 'Marketingové',
      description: 'Slouží k zobrazování relevantních reklam a měření výkonu kampaní.',
    },
  },
};

let _config: CookieConsentConfig | null = null;

export function getConfig(): CookieConsentConfig {
  if (_config) return _config;
  const userConfig = window.CookieConsentConfig ?? {};
  _config = { ...DEFAULTS, ...userConfig, categories: { ...DEFAULTS.categories, ...userConfig.categories } };
  return _config;
}

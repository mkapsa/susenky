import type { CookieConsentConfig } from './types';

const DEFAULTS: CookieConsentConfig = {
  consentVersion: '1.0',
  logEndpoint: '',
  primaryColor: '#1a73e8',
  siteName: 'This website',
  cookiePolicyUrl: '/cookie-policy',
  categories: {
    analytics: {
      label: 'Analytics',
      description: 'These cookies help us understand how visitors interact with our website.',
    },
    marketing: {
      label: 'Marketing',
      description: 'These cookies are used to deliver relevant ads and track campaign performance.',
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

import type { ConsentChoices, ConsentValue } from './types';

function ensureGtag(): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
}

function toConsentValue(val: boolean): ConsentValue {
  return val ? 'granted' : 'denied';
}

export function setConsentDefault(choices: ConsentChoices | null): void {
  ensureGtag();

  const analytics = choices ? toConsentValue(choices.analytics) : 'denied';
  const marketing = choices ? toConsentValue(choices.marketing) : 'denied';

  window.gtag('consent', 'default', {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  });
}

export function updateConsent(choices: ConsentChoices): void {
  ensureGtag();

  const analytics = toConsentValue(choices.analytics);
  const marketing = toConsentValue(choices.marketing);

  window.gtag('consent', 'update', {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
  });
}

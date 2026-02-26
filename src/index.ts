import type { ConsentChoices } from './types';
import { getConfig } from './config';
import { readConsent, writeConsent, clearConsent } from './storage';
import { setConsentDefault, updateConsent } from './consent-mode';
import { initMetaPixelGuard, allowMetaPixel } from './meta-pixel';
import { logConsent } from './log';
import { showBanner, showFloatingButton } from './ui/banner';
import { showModal } from './ui/modal';

function handleConsent(choices: ConsentChoices): void {
  const config = getConfig();
  const stored = writeConsent(choices, config.consentVersion);
  updateConsent(choices);
  if (choices.marketing) allowMetaPixel();
  logConsent(stored);
}

function mountPublicAPI(): void {
  window.CookieConsent = {
    showPreferences() {
      showModal(handleConsent);
    },
  };
}

// --- Main execution ---
(function init() {
  const config = getConfig();
  const stored = readConsent();

  // Returning visitor with matching version
  if (stored && stored.version === config.consentVersion) {
    setConsentDefault(stored.choices);
    if (stored.choices.marketing) allowMetaPixel();
    mountPublicAPI();

    // Show floating button so user can change preferences
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => showFloatingButton(handleConsent));
    } else {
      showFloatingButton(handleConsent);
    }

    return;
  }

  // First visit or version mismatch
  if (stored) clearConsent();

  initMetaPixelGuard();
  setConsentDefault(null);
  mountPublicAPI();

  // Show banner when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => showBanner(handleConsent));
  } else {
    showBanner(handleConsent);
  }
})();

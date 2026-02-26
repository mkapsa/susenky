# Susenky 🍪

Self-hosted GDPR cookie consent library. Manages Google Consent Mode V2 (GA4, Google Ads) and Meta Pixel — deployed as a single script via GTM.

## Features

- Google Consent Mode V2 integration (analytics + marketing signals)
- Meta Pixel proxy — queues `fbq()` calls until marketing consent is granted
- localStorage-based persistence (no cookies set by the library itself)
- Accessible modal with focus trapping and keyboard navigation
- Configurable via GTM Variable — no code changes needed per site
- Single IIFE bundle, ~4.5 KB gzipped

## Quick Start

```bash
npm install
npm run dev       # Dev server at http://localhost:3000
npm run build     # Outputs dist/consent.min.js
```

## GTM Deployment

1. Host `dist/consent.min.js` on your CDN
2. Create a **Custom JavaScript Variable** in GTM with your config:

```javascript
function() {
  return {
    consentVersion: "1.0",
    logEndpoint: "https://your-api.com/consent",
    primaryColor: "#6B1D3A",
    siteName: "Your Site",
    cookiePolicyUrl: "https://yoursite.com/cookie-policy",
    categories: {
      analytics: { label: "Analytické", description: "..." },
      marketing: { label: "Marketingové", description: "..." }
    }
  };
}
```

3. Create a **Custom HTML** tag with trigger **Consent Initialization - All Pages**:

```html
<script>
  window.CookieConsentConfig = {{Your Config Variable}};
</script>
<script src="https://cdn.yoursite.com/consent.min.js" async="false"></script>
```

## Re-open Consent Modal

```html
<a href="#" onclick="window.CookieConsent.showPreferences(); return false;">
  Cookie Settings
</a>
```

A floating cookie button (bottom-left) is also shown automatically after the user makes a choice.

## License

MIT

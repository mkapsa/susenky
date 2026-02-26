# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server with hot reload (serves index.html test page)
npm run build      # Type-check (tsc --noEmit) then Vite build → dist/consent.min.js
npm run preview    # Preview the production build
```

The build produces a single IIFE file (`dist/consent.min.js`). Target is **< 15KB gzipped**.

The `api/` directory is a separate Cloudflare Worker — it is excluded from the main tsconfig and built/deployed independently.

## Architecture

This is a self-hosted GDPR cookie consent library deployed via a single `<script>` tag (typically through GTM's "Consent Initialization" trigger). It manages Google Consent Mode V2 signals and a Meta Pixel proxy — no cookies are set by the library itself; consent state lives in **localStorage**.

### Execution flow

```
index.ts init()
  ├─ Returning visitor (version matches): config → storage.readConsent() → consent-mode.setConsentDefault(stored) → mount public API → floating button
  ├─ First visit: config → meta-pixel.initMetaPixelGuard() → consent-mode.setConsentDefault(null) → show modal
  └─ Version mismatch: storage.clearConsent() → treat as first visit
```

On user choice, `handleConsent()` runs: `storage.writeConsent() → consent-mode.updateConsent() → meta-pixel.allowMetaPixel() → log.logConsent()`.

### Key modules

- **consent-mode.ts** — Bootstraps `window.dataLayer`/`gtag` and pushes `consent default` (with `wait_for_update: 500`) and `consent update` commands. This must run before GTM loads.
- **meta-pixel.ts** — Installs a proxy `fbq()` that queues calls while marketing is denied, then flushes when allowed. Handles the race where Meta's script may load before/after consent.
- **storage.ts** — Keys: `cookie_consent` (choices JSON), `cookie_consent_uid` (stable UUID). Version field enables re-prompting on policy changes.
- **ui/modal.ts** — Two-view modal: main (accept/reject/customize) and preference center (per-category toggles). Focus-trapped, ARIA-annotated.
- **ui/styles.ts** — All CSS injected as a single `<style>` tag at runtime. Themed via CSS custom properties (`--cc-primary`, etc.). z-index: 2147483647.

### Configuration

The host page sets `window.CookieConsentConfig` before loading the script. All customization (colors, labels, consent version, log endpoint) happens there — typically via a GTM Variable. See `gtm/custom-html-tag.html` for the integration pattern.

### Public API

`window.CookieConsent.showPreferences()` — reopens the consent modal. Used by "Cookie Settings" links and the floating cookie button.

## Conventions

- Output format is IIFE — no `import`/`require` in the built file. All modules are bundled by Vite.
- `console.*` calls are stripped by Terser in production. Use them freely during development.
- Privacy: always strip query parameters from URLs before logging (defense-in-depth on both client and server).
- The `functional` consent category is always `true` and non-toggleable.

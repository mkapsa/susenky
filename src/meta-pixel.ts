let queue: unknown[][] = [];
let allowed = false;
let originalFbq: typeof window.fbq | null = null;

function proxyFbq(...args: unknown[]): void {
  if (allowed && originalFbq) {
    originalFbq(...args);
  } else {
    queue.push(args);
  }
}

export function initMetaPixelGuard(): void {
  // Capture any existing fbq (shouldn't exist yet, but be safe)
  if (typeof window.fbq === 'function') {
    originalFbq = window.fbq;
  }

  // Install proxy
  window.fbq = proxyFbq as typeof window.fbq;
  window._fbq = window.fbq;
}

export function allowMetaPixel(): void {
  allowed = true;

  // If the real fbq was loaded in the meantime (by Meta's own script), grab it
  // Meta's snippet replaces window.fbq only if it doesn't already have .loaded
  // So we check dataLayer/globalThis for the real one
  if (!originalFbq && typeof window.fbq === 'function' && window.fbq !== proxyFbq) {
    originalFbq = window.fbq;
  }

  // Flush queued calls
  if (originalFbq) {
    for (const args of queue) {
      originalFbq(...args);
    }
  }
  queue = [];
}

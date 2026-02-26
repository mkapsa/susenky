/**
 * Consent Logging API — Cloudflare Worker with D1 (SQLite)
 *
 * Environment bindings required:
 *   - DB: D1 database binding
 *
 * D1 schema (run once via wrangler d1 execute):
 *   CREATE TABLE IF NOT EXISTS consent_log (
 *     id INTEGER PRIMARY KEY AUTOINCREMENT,
 *     timestamp TEXT NOT NULL,
 *     version TEXT NOT NULL,
 *     user_id TEXT NOT NULL,
 *     page_url TEXT NOT NULL,
 *     functional INTEGER NOT NULL DEFAULT 1,
 *     analytics INTEGER NOT NULL DEFAULT 0,
 *     marketing INTEGER NOT NULL DEFAULT 0,
 *     created_at TEXT NOT NULL DEFAULT (datetime('now'))
 *   );
 *   CREATE INDEX idx_consent_user ON consent_log(user_id);
 *   CREATE INDEX idx_consent_ts ON consent_log(timestamp);
 */

interface Env {
  DB: D1Database;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
}

interface ConsentPayload {
  timestamp: string;
  version: string;
  userId: string;
  pageUrl: string;
  choices: {
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/consent' && request.method === 'POST') {
      return handleConsent(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleConsent(request: Request, env: Env): Promise<Response> {
  let payload: ConsentPayload;

  try {
    payload = await request.json() as ConsentPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  // Validate required fields
  if (!payload.timestamp || !payload.version || !payload.userId || !payload.pageUrl || !payload.choices) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  // Strip query params from pageUrl (defense-in-depth — client should already do this)
  let cleanUrl: string;
  try {
    const parsed = new URL(payload.pageUrl);
    cleanUrl = parsed.origin + parsed.pathname;
  } catch {
    cleanUrl = payload.pageUrl;
  }

  try {
    await env.DB.prepare(
      `INSERT INTO consent_log (timestamp, version, user_id, page_url, functional, analytics, marketing)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        payload.timestamp,
        payload.version,
        payload.userId,
        cleanUrl,
        payload.choices.functional ? 1 : 0,
        payload.choices.analytics ? 1 : 0,
        payload.choices.marketing ? 1 : 0,
      )
      .run();
  } catch {
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

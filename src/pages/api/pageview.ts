import type { APIRoute } from 'astro';
import { isDemoMode } from '../../lib/supabase';
import { supabaseRestInsert } from '../../lib/supabase-rest';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function cleanPath(raw: unknown): string {
  const path = String(raw || '/').trim() || '/';
  if (!path.startsWith('/')) return '/';
  return path.split('?')[0].slice(0, 300);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const path = cleanPath(body.path);
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return json({ ok: true, skipped: true });
    }

    if (isDemoMode()) {
      return json({ ok: true, demo: true });
    }

    const referrer = String(body.referrer || '').trim().slice(0, 500) || null;
    const utm_source = String(body.utm_source || '').trim().slice(0, 100) || null;
    const utm_medium = String(body.utm_medium || '').trim().slice(0, 100) || null;
    const utm_campaign = String(body.utm_campaign || '').trim().slice(0, 100) || null;

    await supabaseRestInsert('events', {
      event_type: 'pageview',
      payload: {
        path,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
      },
    });

    return json({ ok: true });
  } catch (err) {
    console.error('pageview failed', err);
    return json({ ok: false }, 204);
  }
};

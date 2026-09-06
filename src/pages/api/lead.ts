import type { APIRoute } from 'astro';
import { isDemoMode } from '../../lib/supabase';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function env(name: string): string | undefined {
  return (import.meta.env[name] as string | undefined) || process.env[name];
}

async function supabaseRestInsert(table: string, row: Record<string, unknown>) {
  const url = env('PUBLIC_SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) {
    throw new Error('missing_supabase_env');
  }
  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`supabase_${table}_${res.status}:${text.slice(0, 200)}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Ugyldig forespørgsel.' }, 400);
  }

  try {
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const company = String(body.company || '').trim() || null;
    const interest = String(body.interest || '').trim() || null;
    const message = String(body.message || '').trim() || null;
    const course_slug = String(body.course_slug || '').trim() || null;
    const source_page = String(body.source_page || '').trim() || null;

    if (!name || !email || !email.includes('@')) {
      return json({ error: 'Navn og gyldig e-mail er påkrævet.' }, 400);
    }

    if (isDemoMode()) {
      return json({
        ok: true,
        demo: true,
        message: 'Tak! (demo-mode — lead gemt ikke i database, men formularen virker).',
      });
    }

    await supabaseRestInsert('leads', {
      name,
      email,
      company,
      interest,
      message,
      course_slug,
      source_page,
    });

    try {
      await supabaseRestInsert('events', {
        event_type: 'lead_submitted',
        payload: { email, course_slug, source_page },
      });
    } catch (err) {
      console.error('lead event insert failed', err);
    }

    return json({ ok: true, message: 'Tak — vi vender tilbage snarest.' });
  } catch (err) {
    console.error('lead api failed', err);
    return json({ error: 'Kunne ikke sende henvendelsen lige nu.' }, 500);
  }
};

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

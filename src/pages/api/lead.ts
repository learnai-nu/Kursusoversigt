import type { APIRoute } from 'astro';
import { getSupabaseService, isDemoMode } from '../../lib/supabase';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
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

    const supabase = getSupabaseService();
    if (!supabase) {
      return json({ error: 'Supabase er ikke konfigureret korrekt.' }, 500);
    }

    const { error } = await supabase.from('leads').insert({
      name,
      email,
      company,
      interest,
      message,
      course_slug,
      source_page,
    });

    if (error) {
      return json({ error: 'Kunne ikke gemme lead.' }, 500);
    }

    await supabase.from('events').insert({
      event_type: 'lead_submitted',
      payload: { email, course_slug, source_page },
    });

    return json({ ok: true, message: 'Tak — vi vender tilbage snarest.' });
  } catch {
    return json({ error: 'Ugyldig forespørgsel.' }, 400);
  }
};

function env(name: string): string | undefined {
  return (import.meta.env[name] as string | undefined) || process.env[name];
}

export function getSupabaseRestConfig(): { url: string; key: string } | null {
  const url = env('PUBLIC_SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

export async function supabaseRestInsert(table: string, row: Record<string, unknown>) {
  const cfg = getSupabaseRestConfig();
  if (!cfg) throw new Error('missing_supabase_env');
  const res = await fetch(`${cfg.url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
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

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  interest: string | null;
  message: string | null;
  course_slug: string | null;
  source_page: string | null;
  created_at: string;
};

export async function fetchLeads(limit = 100): Promise<{ leads: LeadRow[]; error?: string }> {
  const cfg = getSupabaseRestConfig();
  if (!cfg) return { leads: [], error: 'Supabase er ikke konfigureret.' };
  const qs = new URLSearchParams({
    select: 'id,name,email,company,interest,message,course_slug,source_page,created_at',
    order: 'created_at.desc',
    limit: String(limit),
  });
  const res = await fetch(`${cfg.url}/rest/v1/leads?${qs}`, {
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    return { leads: [], error: `Kunne ikke hente leads (${res.status}).` };
  }
  const leads = (await res.json()) as LeadRow[];
  return { leads };
}

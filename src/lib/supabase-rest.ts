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
    return { leads: [], error: `Kunne ikke hente leads (${res.status}).` };
  }
  return { leads: (await res.json()) as LeadRow[] };
}

export type PageviewEvent = {
  id: string;
  event_type: string;
  payload: {
    path?: string;
    referrer?: string | null;
    source?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
  };
  created_at: string;
};

export type AnalyticsSummary = {
  totalVisits: number;
  visits7d: number;
  visits30d: number;
  sources: { label: string; count: number }[];
  topCourses: { path: string; slug: string; count: number }[];
  topArticles: { path: string; slug: string; count: number }[];
  topPages: { path: string; count: number }[];
  sampleSize: number;
  error?: string;
};

function classifySource(payload: PageviewEvent['payload']): string {
  const utm = (payload.utm_source || '').trim();
  if (utm) return utm.toLowerCase();
  const ref = (payload.referrer || '').trim();
  if (!ref) return 'Direkte / ukendt';
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '');
    if (host.includes('google.')) return 'Google';
    if (host.includes('bing.')) return 'Bing';
    if (host.includes('facebook.') || host === 'fb.com' || host.includes('instagram.')) return 'Meta';
    if (host.includes('linkedin.')) return 'LinkedIn';
    if (host.includes('chatgpt.') || host.includes('openai.') || host.includes('perplexity.') || host.includes('claude.')) {
      return 'AI-søgning';
    }
    if (host.endsWith('kursusoversigten.dk') || host.endsWith('kursusoversigt.vercel.app')) return 'Internt';
    return host;
  } catch {
    return 'Andet';
  }
}

function topN(map: Map<string, number>, n: number) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

export async function fetchAnalyticsSummary(limit = 2000): Promise<AnalyticsSummary> {
  const empty: AnalyticsSummary = {
    totalVisits: 0,
    visits7d: 0,
    visits30d: 0,
    sources: [],
    topCourses: [],
    topArticles: [],
    topPages: [],
    sampleSize: 0,
  };
  const cfg = getSupabaseRestConfig();
  if (!cfg) return { ...empty, error: 'Supabase er ikke konfigureret.' };

  const qs = new URLSearchParams({
    select: 'id,event_type,payload,created_at',
    event_type: 'eq.pageview',
    order: 'created_at.desc',
    limit: String(limit),
  });
  const res = await fetch(`${cfg.url}/rest/v1/events?${qs}`, {
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
    },
  });
  if (!res.ok) {
    return { ...empty, error: `Kunne ikke hente analytics (${res.status}).` };
  }

  const rows = (await res.json()) as PageviewEvent[];
  const now = Date.now();
  const d7 = now - 7 * 24 * 60 * 60 * 1000;
  const d30 = now - 30 * 24 * 60 * 60 * 1000;
  const sources = new Map<string, number>();
  const pages = new Map<string, number>();
  const courses = new Map<string, number>();
  const articles = new Map<string, number>();
  let visits7d = 0;
  let visits30d = 0;

  for (const row of rows) {
    const created = new Date(row.created_at).getTime();
    if (created >= d7) visits7d += 1;
    if (created >= d30) visits30d += 1;
    const path = (row.payload?.path || '/').split('?')[0] || '/';
    pages.set(path, (pages.get(path) || 0) + 1);
    const source = classifySource(row.payload || {});
    sources.set(source, (sources.get(source) || 0) + 1);

    const courseMatch = path.match(/^\/ai-kurser\/([^/]+)\/?$/);
    if (courseMatch) courses.set(courseMatch[1], (courses.get(courseMatch[1]) || 0) + 1);
    const articleMatch = path.match(/^\/artikler\/([^/]+)\/?$/);
    if (articleMatch) articles.set(articleMatch[1], (articles.get(articleMatch[1]) || 0) + 1);
  }

  return {
    totalVisits: rows.length,
    visits7d,
    visits30d,
    sources: topN(sources, 10).map(({ key, count }) => ({ label: key, count })),
    topCourses: topN(courses, 10).map(({ key, count }) => ({
      slug: key,
      path: `/ai-kurser/${key}`,
      count,
    })),
    topArticles: topN(articles, 10).map(({ key, count }) => ({
      slug: key,
      path: `/artikler/${key}`,
      count,
    })),
    topPages: topN(pages, 10).map(({ key, count }) => ({ path: key, count })),
    sampleSize: rows.length,
  };
}

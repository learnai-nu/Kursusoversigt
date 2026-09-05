from pathlib import Path
ROOT = Path("/workspace/Kursusoversigt")
P = ROOT / "src" / "pages"

(P / "artikler" / "index.astro").write_text("""---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import ArticleCard from '../../components/ArticleCard.astro';
import SoftCTA from '../../components/SoftCTA.astro';
import { getCollection } from 'astro:content';
import { breadcrumbJsonLd } from '../../lib/seo';

const articles = (await getCollection('articles')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
const crumbs = breadcrumbJsonLd([
  { name: 'Forside', path: '/' },
  { name: 'Artikler', path: '/artikler' },
]);
---
<BaseLayout
  title="Artikler om AI-kurser"
  description="Guider og analyser om AI-kompetencer, kursusvalg og læring i dansk kontekst."
  jsonLd={[crumbs]}
>
  <div class="container-site py-10">
    <Breadcrumbs items={[{ label: 'Forside', href: '/' }, { label: 'Artikler' }]} />
    <h1 class="text-4xl">Artikler</h1>
    <p class="mt-3 max-w-2xl text-stone-600">Redaktionelle tekster med kilder og interne links — skrevet til folk der vælger AI-kurser i Danmark.</p>
    <div class="mt-8 grid gap-5 md:grid-cols-2">
      {articles.map((a) => (
        <ArticleCard
          href={`/artikler/${a.slug}`}
          title={a.data.title}
          description={a.data.description}
          date={a.data.pubDate}
          author={a.data.author}
        />
      ))}
    </div>
    <div class="mt-14">
      <SoftCTA campaign="articles" />
    </div>
  </div>
</BaseLayout>
""", encoding="utf-8")

(P / "artikler" / "[slug].astro").write_text("""---
export const prerender = true;
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import SoftCTA from '../../components/SoftCTA.astro';
import { getCollection } from 'astro:content';
import { articleJsonLd, breadcrumbJsonLd } from '../../lib/seo';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((a) => ({
    params: { slug: a.slug },
    props: { article: a },
  }));
}

const { article } = Astro.props;
const { Content } = await article.render();
const formatted = article.data.pubDate.toLocaleDateString('da-DK', {
  year: 'numeric', month: 'long', day: 'numeric',
});
const crumbs = breadcrumbJsonLd([
  { name: 'Forside', path: '/' },
  { name: 'Artikler', path: '/artikler' },
  { name: article.data.title, path: `/artikler/${article.slug}` },
]);
---
<BaseLayout
  title={article.data.title}
  description={article.data.description}
  ogType="article"
  jsonLd={[
    crumbs,
    articleJsonLd({
      title: article.data.title,
      description: article.data.description,
      slug: article.slug,
      author: article.data.author,
      pubDate: article.data.pubDate,
      updatedDate: article.data.updatedDate,
    }),
  ]}
>
  <div class="container-site py-10">
    <Breadcrumbs items={[
      { label: 'Forside', href: '/' },
      { label: 'Artikler', href: '/artikler' },
      { label: article.data.title },
    ]} />
    <article class="mx-auto max-w-3xl">
      <p class="text-sm text-stone-500">{formatted} · {article.data.author}</p>
      <h1 class="mt-2 text-4xl sm:text-5xl">{article.data.title}</h1>
      <p class="mt-4 text-lg text-stone-600">{article.data.description}</p>
      <div class="prose-da mt-10">
        <Content />
      </div>
      {article.data.sources?.length > 0 && (
        <section class="mt-12 border-t border-stone-200 pt-6">
          <h2 class="text-xl">Kilder</h2>
          <ul class="mt-3 space-y-2 text-sm text-stone-600">
            {article.data.sources.map((s) => (
              <li>
                <a href={s.url} rel="noopener noreferrer" class="text-sea-700 hover:underline">{s.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div class="mt-12">
        <SoftCTA campaign="article" />
      </div>
    </article>
  </div>
</BaseLayout>
""", encoding="utf-8")

(P / "admin" / "index.astro").write_text("""---
export const prerender = false;
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getAllCourses, getAllProviders } from '../../lib/courses';
import { isDemoMode } from '../../lib/supabase';

const authed = Astro.cookies.get('ko_admin')?.value === '1';
const demo = isDemoMode();
const courses = getAllCourses();
const providers = getAllProviders();
const error = Astro.url.searchParams.get('error');
---
<BaseLayout title="Admin" description="Simpel demo-admin til Kursusoversigt." includeDefaults={false}>
  <div class="container-site py-10 max-w-3xl">
    <h1 class="text-3xl">Admin (demo)</h1>
    <p class="mt-2 text-stone-600">
      {demo
        ? 'Demo-mode: ingen Supabase-env. Data kommer fra lokal JSON.'
        : 'Supabase-env er sat. Lead-API kan skrive til databasen.'}
    </p>

    {!authed ? (
      <form method="POST" action="/api/admin-login" class="card mt-8 space-y-4 p-6">
        <p class="text-sm text-stone-600">Log ind med admin-adgangskode (standard i demo: <code>demo</code>).</p>
        {error && <p class="text-sm text-red-700">Forkert adgangskode.</p>}
        <label class="block text-sm">
          <span class="mb-1 block font-medium">Adgangskode</span>
          <input type="password" name="password" required class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2" />
        </label>
        <button class="btn-primary" type="submit">Log ind</button>
      </form>
    ) : (
      <div class="mt-8 space-y-6">
        <div class="card p-6">
          <h2 class="text-xl">Status</h2>
          <ul class="mt-3 space-y-1 text-sm text-stone-700">
            <li>Kurser i seed: <strong>{courses.length}</strong></li>
            <li>Udbydere: <strong>{providers.length}</strong></li>
            <li>Mode: <strong>{demo ? 'demo/json' : 'supabase'}</strong></li>
          </ul>
          <form method="POST" action="/api/admin-logout" class="mt-4">
            <button class="btn-secondary" type="submit">Log ud</button>
          </form>
        </div>
        <div class="card overflow-hidden">
          <div class="border-b border-stone-200 px-4 py-3">
            <h2 class="font-serif text-lg">Kurser (seed)</h2>
          </div>
          <div class="max-h-96 overflow-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th class="px-4 py-2">Titel</th>
                  <th class="px-4 py-2">Udbyder</th>
                  <th class="px-4 py-2">Verificeret</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr class="border-t border-stone-100">
                    <td class="px-4 py-2"><a href={`/ai-kurser/${c.slug}`} class="text-sea-700 hover:underline">{c.title}</a></td>
                    <td class="px-4 py-2">{c.provider_short}</td>
                    <td class="px-4 py-2">{c.last_verified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </div>
</BaseLayout>
""", encoding="utf-8")

(P / "api" / "lead.ts").write_text("""import type { APIRoute } from 'astro';
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
""", encoding="utf-8")

(P / "api" / "admin-login.ts").write_text("""import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = String(form.get('password') || '');
  const expected = import.meta.env.ADMIN_PASSWORD || 'demo';
  if (password !== expected) {
    return redirect('/admin?error=1', 302);
  }
  cookies.set('ko_admin', '1', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 8,
  });
  return redirect('/admin', 302);
};
""", encoding="utf-8")

(P / "api" / "admin-logout.ts").write_text("""import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('ko_admin', { path: '/' });
  return redirect('/admin', 302);
};
""", encoding="utf-8")

(P / "sitemap.xml.ts").write_text("""import type { APIRoute } from 'astro';
import { getAllCourses, getAllProviders } from '../lib/courses';
import { getCollection } from 'astro:content';
import { absoluteUrl } from '../lib/seo';

export const prerender = true;

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const urls = [
    '/',
    '/ai-kurser',
    '/artikler',
    ...getAllCourses().map((c) => `/ai-kurser/${c.slug}`),
    ...getAllProviders().map((p) => `/udbydere/${p.slug}`),
    ...articles.map((a) => `/artikler/${a.slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${absoluteUrl(u)}</loc>
  </url>`
  )
  .join('\\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
""", encoding="utf-8")

(ROOT / "public" / "robots.txt").write_text("""User-agent: *
Allow: /

Sitemap: https://kursusoversigt.dk/sitemap.xml
""", encoding="utf-8")

(ROOT / "public" / "favicon.svg").write_text("""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#f7f4ef"/>
  <path d="M16 42V22h6.5c4.8 0 7.8 2.6 7.8 6.6 0 2.6-1.3 4.6-3.5 5.7L34 42h-5.2l-6.2-7.2H21V42H16zm5-11.2h1.4c2.2 0 3.5-1.1 3.5-2.9s-1.3-2.8-3.5-2.8H21v5.7zM38 42l7.2-20h5.1L57.5 42h-5.1l-1.3-3.8H44L42.7 42H38zm7.4-7.6h4.7l-2.3-6.7-2.4 6.7z" fill="#314c35"/>
</svg>
""", encoding="utf-8")

(ROOT / "src" / "content" / "config.ts").write_text("""import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Kursusoversigt-redaktionen'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .default([]),
  }),
});

export const collections = { articles };
""", encoding="utf-8")

print("pages2 ok")

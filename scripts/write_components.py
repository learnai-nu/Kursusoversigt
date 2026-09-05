from pathlib import Path
ROOT = Path("/workspace/Kursusoversigt")
C = ROOT / "src" / "components"
L = ROOT / "src" / "layouts"

(L / "BaseLayout.astro").write_text("""---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import JsonLd from '../components/JsonLd.astro';
import { SITE_NAME, DEFAULT_DESCRIPTION, absoluteUrl, organizationJsonLd, websiteJsonLd } from '../lib/seo';

interface Props {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  includeDefaults?: boolean;
}

const {
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = Astro.url.pathname,
  ogType = 'website',
  jsonLd = [],
  includeDefaults = true,
} = Astro.props;

const pageTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — ${DEFAULT_DESCRIPTION.split('—')[0].trim()}`;
const canonical = absoluteUrl(canonicalPath);
const extras = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
const schemas = includeDefaults
  ? [organizationJsonLd(), websiteJsonLd(), ...extras]
  : extras;
---
<!doctype html>
<html lang="da">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#f7f4ef" />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:type" content={ogType} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content="da_DK" />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet" />
    <title>{pageTitle}</title>
    {schemas.map((s) => <JsonLd data={s} />)}
  </head>
  <body class="min-h-screen flex flex-col">
    <a href="#indhold" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-moss-800 focus:px-4 focus:py-2 focus:text-paper">Spring til indhold</a>
    <Header />
    <main id="indhold" class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
""", encoding="utf-8")

(C / "JsonLd.astro").write_text("""---
interface Props {
  data: Record<string, unknown>;
}
const { data } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
""", encoding="utf-8")

(C / "Header.astro").write_text("""---
const path = Astro.url.pathname;
const links = [
  { href: '/ai-kurser', label: 'AI-kurser' },
  { href: '/artikler', label: 'Artikler' },
];
---
<header class="border-b border-stone-200/80 bg-paper/90 backdrop-blur-sm sticky top-0 z-40">
  <div class="container-site flex h-16 items-center justify-between gap-4">
    <a href="/" class="group flex items-baseline gap-2 no-underline">
      <span class="font-serif text-xl font-semibold text-moss-900 group-hover:text-moss-700">Kursusoversigt</span>
      <span class="hidden text-xs uppercase tracking-[0.14em] text-stone-500 sm:inline">AI · Danmark</span>
    </a>
    <nav class="flex items-center gap-1 sm:gap-2" aria-label="Hovednavigation">
      {links.map((l) => (
        <a
          href={l.href}
          class:list={[
            'rounded-full px-3 py-1.5 text-sm font-medium no-underline transition',
            path.startsWith(l.href)
              ? 'bg-moss-100 text-moss-900'
              : 'text-stone-700 hover:bg-stone-100 hover:text-paper-ink',
          ]}
        >
          {l.label}
        </a>
      ))}
      <a href="https://learnai.nu/?utm_source=kursusoversigt&utm_medium=referral&utm_campaign=nav" class="btn-primary ml-1 hidden sm:inline-flex text-xs sm:text-sm" rel="noopener">LearnAI</a>
    </nav>
  </div>
</header>
""", encoding="utf-8")

(C / "Footer.astro").write_text("""---
const year = new Date().getFullYear();
---
<footer class="mt-20 border-t border-stone-200 bg-paper-dark/60">
  <div class="container-site grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
    <div>
      <p class="font-serif text-lg font-semibold text-moss-900">Kursusoversigt</p>
      <p class="mt-2 max-w-sm text-sm leading-relaxed text-stone-600">
        Et roligt overblik over AI-kurser i Danmark. Vi samler offentlige tilbud, markerer usikre priser som <em>Ukendt</em> og peger videre til LearnAI, når du er klar til næste skridt.
      </p>
    </div>
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Udforsk</p>
      <ul class="mt-3 space-y-2 text-sm">
        <li><a href="/ai-kurser" class="text-stone-700 no-underline hover:underline">AI-kurser</a></li>
        <li><a href="/artikler" class="text-stone-700 no-underline hover:underline">Artikler</a></li>
        <li><a href="/admin" class="text-stone-700 no-underline hover:underline">Admin (demo)</a></li>
      </ul>
    </div>
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">LearnAI</p>
      <p class="mt-3 text-sm text-stone-600">Praksisnære forløb for teams og ledere.</p>
      <a class="btn-secondary mt-4 text-xs" href="https://learnai.nu/?utm_source=kursusoversigt&utm_medium=referral&utm_campaign=footer" rel="noopener">Besøg learnai.nu</a>
    </div>
  </div>
  <div class="border-t border-stone-200/80">
    <div class="container-site flex flex-col gap-2 py-4 text-xs text-stone-500 sm:flex-row sm:justify-between">
      <p>© {year} Kursusoversigt. Demo-data — verificér altid hos udbyder.</p>
      <p>Soft leads til LearnAI · ikke et betalt kursuskatalog.</p>
    </div>
  </div>
</footer>
""", encoding="utf-8")

(C / "Breadcrumbs.astro").write_text("""---
interface Crumb {
  label: string;
  href?: string;
}
interface Props {
  items: Crumb[];
}
const { items } = Astro.props;
---
<nav aria-label="Brødkrummer" class="mb-6">
  <ol class="flex flex-wrap items-center gap-2 text-sm text-stone-500">
    {items.map((item, i) => (
      <li class="flex items-center gap-2">
        {i > 0 && <span aria-hidden="true" class="text-stone-300">/</span>}
        {item.href ? (
          <a href={item.href} class="no-underline hover:text-moss-800 hover:underline">{item.label}</a>
        ) : (
          <span class="text-stone-800" aria-current="page">{item.label}</span>
        )}
      </li>
    ))}
  </ol>
</nav>
""", encoding="utf-8")

(C / "CourseCard.astro").write_text("""---
import type { Course } from '../lib/types';
import { formatPrice, formatLabel } from '../lib/courses';
interface Props {
  course: Course;
}
const { course } = Astro.props;
---
<article class="card flex h-full flex-col p-5 transition hover:border-moss-300">
  <div class="flex flex-wrap gap-2">
    <span class="chip">{formatLabel(course.level)}</span>
    <span class="chip">{formatLabel(course.format)}</span>
    <span class="chip">{formatLabel(course.category)}</span>
  </div>
  <h3 class="mt-3 text-xl leading-snug">
    <a href={`/ai-kurser/${course.slug}`} class="text-paper-ink no-underline hover:text-moss-800">{course.title}</a>
  </h3>
  <p class="mt-1 text-sm text-stone-500">
    <a href={`/udbydere/${course.provider_slug}`} class="no-underline hover:underline">{course.provider_name}</a>
    · {course.location}
  </p>
  <p class="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{course.description}</p>
  <div class="mt-4 flex items-end justify-between gap-3 border-t border-stone-100 pt-4 text-sm">
    <div>
      <p class="text-xs uppercase tracking-wide text-stone-400">Pris</p>
      <p class="font-medium text-paper-ink">{formatPrice(course)}</p>
    </div>
    <a href={`/ai-kurser/${course.slug}`} class="text-sea-700 no-underline hover:underline">Se kursus →</a>
  </div>
</article>
""", encoding="utf-8")

(C / "ArticleCard.astro").write_text("""---
interface Props {
  href: string;
  title: string;
  description: string;
  date: Date;
  author: string;
}
const { href, title, description, date, author } = Astro.props;
const formatted = date.toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
---
<article class="card p-5">
  <p class="text-xs uppercase tracking-[0.12em] text-stone-500">{formatted} · {author}</p>
  <h3 class="mt-2 text-xl">
    <a href={href} class="text-paper-ink no-underline hover:text-moss-800">{title}</a>
  </h3>
  <p class="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>
  <a href={href} class="mt-4 inline-block text-sm text-sea-700 no-underline hover:underline">Læs artikel →</a>
</article>
""", encoding="utf-8")

(C / "SoftCTA.astro").write_text("""---
import { learnAiUrl } from '../lib/seo';
interface Props {
  title?: string;
  text?: string;
  campaign?: string;
}
const {
  title = 'Klar til næste skridt?',
  text = 'LearnAI hjælper danske teams og ledere med praksisnære AI-forløb — uden hype.',
  campaign = 'site',
} = Astro.props;
const href = learnAiUrl('/', campaign);
---
<aside class="rounded-3xl border border-moss-200 bg-gradient-to-br from-moss-50 to-paper p-6 sm:p-8 shadow-soft">
  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-moss-700">LearnAI</p>
  <h2 class="mt-2 text-2xl text-moss-950">{title}</h2>
  <p class="mt-2 max-w-2xl text-stone-700">{text}</p>
  <div class="mt-5 flex flex-wrap gap-3">
    <a class="btn-primary" href={href} rel="noopener">Se LearnAI</a>
    <a class="btn-secondary" href="/ai-kurser">Fortsæt med kurseroversigten</a>
  </div>
</aside>
""", encoding="utf-8")

(C / "LeadForm.astro").write_text("""---
interface Props {
  courseSlug?: string;
  sourcePage?: string;
}
const { courseSlug = '', sourcePage = Astro.url.pathname } = Astro.props;
---
<form id="lead-form" class="card space-y-4 p-5 sm:p-6" method="post" action="/api/lead">
  <div>
    <h2 class="text-xl">Få sparring om AI-kurser</h2>
    <p class="mt-1 text-sm text-stone-600">Vi deler din henvendelse med LearnAI. Ingen spam — kun relevant opfølgning.</p>
  </div>
  <input type="hidden" name="course_slug" value={courseSlug} />
  <input type="hidden" name="source_page" value={sourcePage} />
  <div class="grid gap-4 sm:grid-cols-2">
    <label class="block text-sm">
      <span class="mb-1 block font-medium">Navn</span>
      <input required name="name" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-200" />
    </label>
    <label class="block text-sm">
      <span class="mb-1 block font-medium">E-mail</span>
      <input required type="email" name="email" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-200" />
    </label>
  </div>
  <label class="block text-sm">
    <span class="mb-1 block font-medium">Virksomhed (valgfri)</span>
    <input name="company" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-200" />
  </label>
  <label class="block text-sm">
    <span class="mb-1 block font-medium">Hvad interesserer dig?</span>
    <select name="interest" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-200">
      <option value="overblik">Overblik over kurser</option>
      <option value="team">Kursus til mit team</option>
      <option value="leder">AI for ledere</option>
      <option value="andet">Andet</option>
    </select>
  </label>
  <label class="block text-sm">
    <span class="mb-1 block font-medium">Besked (valgfri)</span>
    <textarea name="message" rows="3" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-200"></textarea>
  </label>
  <button type="submit" class="btn-primary w-full sm:w-auto">Send henvendelse</button>
  <p id="lead-status" class="text-sm text-stone-600" aria-live="polite"></p>
</form>
<script>
  const form = document.getElementById('lead-form');
  const status = document.getElementById('lead-status');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!status) return;
    status.textContent = 'Sender…';
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Noget gik galt');
      status.textContent = data.message || 'Tak — vi vender tilbage.';
      form.reset();
    } catch (err) {
      status.textContent = err instanceof Error ? err.message : 'Noget gik galt';
    }
  });
</script>
""", encoding="utf-8")

(C / "FilterBar.astro").write_text("""---
interface Props {
  categories: string[];
  providers: { slug: string; name: string }[];
  values: {
    q?: string;
    category?: string;
    level?: string;
    format?: string;
    provider?: string;
  };
}
const { categories, providers, values } = Astro.props;
---
<form method="get" action="/ai-kurser" class="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
  <label class="lg:col-span-2 text-sm">
    <span class="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">Søg</span>
    <input name="q" value={values.q || ''} placeholder="Fx prompting, ledelse, ITU…" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-200" />
  </label>
  <label class="text-sm">
    <span class="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">Kategori</span>
    <select name="category" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2">
      <option value="">Alle</option>
      {categories.map((c) => <option value={c} selected={values.category === c}>{c}</option>)}
    </select>
  </label>
  <label class="text-sm">
    <span class="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">Niveau</span>
    <select name="level" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2">
      <option value="">Alle</option>
      <option value="begynder" selected={values.level === 'begynder'}>Begynder</option>
      <option value="mellemniveau" selected={values.level === 'mellemniveau'}>Mellemniveau</option>
      <option value="avanceret" selected={values.level === 'avanceret'}>Avanceret</option>
    </select>
  </label>
  <label class="text-sm">
    <span class="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">Format</span>
    <select name="format" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2">
      <option value="">Alle</option>
      <option value="online" selected={values.format === 'online'}>Online</option>
      <option value="onsite" selected={values.format === 'onsite'}>Fremmøde</option>
      <option value="hybrid" selected={values.format === 'hybrid'}>Hybrid</option>
    </select>
  </label>
  <label class="text-sm">
    <span class="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">Udbyder</span>
    <select name="provider" class="w-full rounded-xl border border-stone-300 bg-white px-3 py-2">
      <option value="">Alle</option>
      {providers.map((p) => <option value={p.slug} selected={values.provider === p.slug}>{p.name}</option>)}
    </select>
  </label>
  <div class="flex items-end gap-2 sm:col-span-2 lg:col-span-6">
    <button class="btn-primary" type="submit">Filtrer</button>
    <a class="btn-secondary" href="/ai-kurser">Nulstil</a>
  </div>
</form>
""", encoding="utf-8")

print("components ok")

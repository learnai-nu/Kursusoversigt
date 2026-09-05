from pathlib import Path
ROOT = Path("/workspace/Kursusoversigt")

(ROOT / "src" / "styles" / "global.css").write_text("""@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth antialiased;
  }
  body {
    @apply bg-paper text-paper-ink font-sans;
  }
  h1, h2, h3, h4 {
    @apply font-serif tracking-tight text-balance;
  }
  a {
    @apply underline-offset-4;
  }
  ::selection {
    @apply bg-moss-200 text-paper-ink;
  }
}

@layer components {
  .container-site {
    @apply mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8;
  }
  .prose-da {
    @apply max-w-prose text-[1.05rem] leading-relaxed text-stone-800;
  }
  .prose-da h2 {
    @apply mt-10 mb-3 text-2xl text-paper-ink;
  }
  .prose-da h3 {
    @apply mt-8 mb-2 text-xl text-paper-ink;
  }
  .prose-da p {
    @apply mb-4;
  }
  .prose-da ul {
    @apply mb-4 list-disc pl-5 space-y-1;
  }
  .prose-da a {
    @apply text-sea-700 underline decoration-moss-300 hover:decoration-sea-700;
  }
  .prose-da strong {
    @apply font-semibold text-paper-ink;
  }
  .chip {
    @apply inline-flex items-center rounded-full border border-stone-300/80 bg-white/70 px-2.5 py-0.5 text-xs font-medium text-stone-700;
  }
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-full bg-moss-800 px-5 py-2.5 text-sm font-semibold text-paper shadow-soft transition hover:bg-moss-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper;
  }
  .btn-secondary {
    @apply inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-paper-ink transition hover:border-moss-400 hover:bg-moss-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper;
  }
  .card {
    @apply rounded-2xl border border-stone-200/80 bg-white/80 shadow-soft;
  }
}
""", encoding="utf-8")

(ROOT / "src" / "lib" / "types.ts").write_text("""export type CourseFormat = 'online' | 'onsite' | 'hybrid';
export type CourseLevel = 'begynder' | 'mellemniveau' | 'avanceret';

export interface Provider {
  slug: string;
  name: string;
  short: string;
  website: string;
  city: string;
  description: string;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  provider_slug: string;
  provider_name: string;
  provider_short: string;
  category: string;
  level: CourseLevel;
  format: CourseFormat;
  location: string;
  price_dkk: number | null;
  price_note: string | null;
  duration: string;
  start_date: string | null;
  language: string;
  tags: string[];
  source_url: string;
  last_verified: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  company?: string;
  interest?: string;
  message?: string;
  course_slug?: string;
  source_page?: string;
}
""", encoding="utf-8")

(ROOT / "src" / "lib" / "supabase.ts").write_text("""import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function hasSupabaseEnv(): boolean {
  return Boolean(
    import.meta.env.PUBLIC_SUPABASE_URL &&
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!hasSupabaseEnv()) return null;
  return createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function getSupabaseService(): SupabaseClient | null {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isDemoMode(): boolean {
  return !hasSupabaseEnv();
}
""", encoding="utf-8")

(ROOT / "src" / "lib" / "courses.ts").write_text("""import coursesJson from '../data/courses.json';
import providersJson from '../data/providers.json';
import type { Course, Provider } from './types';

const courses = coursesJson as Course[];
const providers = providersJson as Provider[];

export function getAllCourses(): Course[] {
  return [...courses].sort((a, b) => a.title.localeCompare(b.title, 'da'));
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesByProvider(providerSlug: string): Course[] {
  return getAllCourses().filter((c) => c.provider_slug === providerSlug);
}

export function getAllProviders(): Provider[] {
  return [...providers].sort((a, b) => a.name.localeCompare(b.name, 'da'));
}

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find((p) => p.slug === slug);
}

export interface CourseFilters {
  q?: string;
  category?: string;
  level?: string;
  format?: string;
  provider?: string;
}

export function filterCourses(filters: CourseFilters): Course[] {
  const q = (filters.q || '').trim().toLowerCase();
  return getAllCourses().filter((c) => {
    if (filters.category && c.category !== filters.category) return false;
    if (filters.level && c.level !== filters.level) return false;
    if (filters.format && c.format !== filters.format) return false;
    if (filters.provider && c.provider_slug !== filters.provider) return false;
    if (!q) return true;
    const hay = [
      c.title,
      c.description,
      c.provider_name,
      c.category,
      c.location,
      ...c.tags,
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getCategories(): string[] {
  return [...new Set(courses.map((c) => c.category))].sort((a, b) =>
    a.localeCompare(b, 'da')
  );
}

export function formatPrice(course: Course): string {
  if (course.price_dkk == null) {
    return course.price_note || 'Ukendt';
  }
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: 0,
  }).format(course.price_dkk);
}

export function formatLabel(value: string): string {
  const map: Record<string, string> = {
    begynder: 'Begynder',
    mellemniveau: 'Mellemniveau',
    avanceret: 'Avanceret',
    online: 'Online',
    onsite: 'Fremmøde',
    hybrid: 'Hybrid',
    ledelse: 'Ledelse',
    teknisk: 'Teknisk',
    praktisk: 'Praktisk',
    etik: 'Etik & ansvar',
    jura: 'Jura',
    data: 'Data',
    marketing: 'Marketing',
    brancher: 'Branche',
    produkt: 'Produkt',
  };
  return map[value] || value.charAt(0).toUpperCase() + value.slice(1);
}
""", encoding="utf-8")

(ROOT / "src" / "lib" / "seo.ts").write_text("""export const SITE_NAME = 'Kursusoversigt';
export const SITE_TAGLINE = 'AI-kurser i Danmark — overblik uden støj';
export const DEFAULT_DESCRIPTION =
  'Uafhængigt overblik over AI-kurser i Danmark. Filtrer efter niveau, format og udbyder — og find det næste skridt med LearnAI.';

export function siteUrl(): string {
  return (import.meta.env.PUBLIC_SITE_URL || 'https://kursusoversigt.dk').replace(/\\/$/, '');
}

export function learnAiUrl(path = '/', campaign = 'site'): string {
  const base = (import.meta.env.PUBLIC_LEARNAI_URL || 'https://learnai.nu').replace(/\\/$/, '');
  const url = new URL(path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`);
  url.searchParams.set('utm_source', 'kursusoversigt');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl()}${p}`;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl(),
    description: DEFAULT_DESCRIPTION,
    sameAs: ['https://learnai.nu'],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl(),
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'da-DK',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl()}/ai-kurser?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function courseJsonLd(course: {
  title: string;
  description: string;
  slug: string;
  provider_name: string;
  source_url: string;
  language: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: absoluteUrl(`/ai-kurser/${course.slug}`),
    provider: {
      '@type': 'Organization',
      name: course.provider_name,
      sameAs: course.source_url,
    },
    inLanguage: course.language === 'da' ? 'da-DK' : 'en',
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  author: string;
  pubDate: Date;
  updatedDate?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: absoluteUrl(`/artikler/${article.slug}`),
    datePublished: article.pubDate.toISOString(),
    dateModified: (article.updatedDate || article.pubDate).toISOString(),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl(),
    },
    inLanguage: 'da-DK',
  };
}
""", encoding="utf-8")

print("lib ok")

export const SITE_NAME = 'Kursusoversigt';
export const SITE_TAGLINE = 'AI-kurser i Danmark — overblik uden støj';
export const DEFAULT_DESCRIPTION =
  'Uafhængigt overblik over AI-kurser i Danmark. Filtrer efter niveau, format og udbyder — og find det næste skridt med LearnAI.';

export function siteUrl(): string {
  return (import.meta.env.PUBLIC_SITE_URL || 'https://kursusoversigt.dk').replace(/\/$/, '');
}

export function learnAiUrl(path = '/', campaign = 'site'): string {
  const base = (import.meta.env.PUBLIC_LEARNAI_URL || 'https://learnai.nu').replace(/\/$/, '');
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

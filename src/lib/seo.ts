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
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl(),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl()}/ai-kurser?q={search_term_string}`,
      },
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

function courseMode(format: string): string {
  if (format === 'online') return 'Online';
  if (format === 'hybrid') return 'Blended';
  return 'Onsite';
}

function levelLabel(level: string): string {
  if (level === 'begynder') return 'Beginner';
  if (level === 'avanceret') return 'Advanced';
  return 'Intermediate';
}

export function courseJsonLd(course: {
  title: string;
  description: string;
  slug: string;
  provider_name: string;
  provider_slug: string;
  source_url: string;
  language: string;
  format?: string;
  level?: string;
  location?: string | null;
  duration?: string | null;
  start_date?: string | null;
  price_dkk?: number | null;
  price_note?: string | null;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': absoluteUrl(`/ai-kurser/${course.slug}`),
    name: course.title,
    description: course.description,
    url: absoluteUrl(`/ai-kurser/${course.slug}`),
    provider: {
      '@type': 'EducationalOrganization',
      name: course.provider_name,
      url: absoluteUrl(`/udbydere/${course.provider_slug}`),
      sameAs: course.source_url,
    },
    inLanguage: course.language === 'da' ? 'da-DK' : 'en',
    isAccessibleForFree: false,
    educationalLevel: course.level ? levelLabel(course.level) : undefined,
    timeRequired: course.duration || undefined,
    about: {
      '@type': 'Thing',
      name: 'Kunstig intelligens',
    },
  };

  if (course.price_dkk != null) {
    data.offers = {
      '@type': 'Offer',
      category: 'Paid',
      price: course.price_dkk,
      priceCurrency: 'DKK',
      url: course.source_url,
      availability: 'https://schema.org/InStock',
    };
  } else {
    data.offers = {
      '@type': 'Offer',
      category: 'Paid',
      url: course.source_url,
      availability: 'https://schema.org/InStock',
      description: course.price_note || 'Pris ukendt — se udbyder',
    };
  }

  const instance: Record<string, unknown> = {
    '@type': 'CourseInstance',
    name: course.title,
    courseMode: course.format ? courseMode(course.format) : undefined,
    url: absoluteUrl(`/ai-kurser/${course.slug}`),
  };
  if (course.location) {
    instance.location = {
      '@type': 'Place',
      name: course.location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'DK',
        addressLocality: course.location,
      },
    };
  }
  if (course.start_date) {
    instance.startDate = course.start_date;
  }
  data.hasCourseInstance = instance;

  return data;
}

export function providerJsonLd(provider: {
  name: string;
  slug: string;
  description: string;
  website: string;
  city?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': absoluteUrl(`/udbydere/${provider.slug}`),
    name: provider.name,
    description: provider.description,
    url: absoluteUrl(`/udbydere/${provider.slug}`),
    sameAs: [provider.website],
    address: provider.city
      ? {
          '@type': 'PostalAddress',
          addressLocality: provider.city,
          addressCountry: 'DK',
        }
      : undefined,
  };
}

export function itemListJsonLd(
  name: string,
  path: string,
  items: { name: string; path: string; description?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
      description: item.description,
    })),
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
    mainEntityOfPage: absoluteUrl(`/artikler/${article.slug}`),
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

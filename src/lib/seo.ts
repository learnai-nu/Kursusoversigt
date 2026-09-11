export const SITE_NAME = 'Kursusoversigt';
export const SITE_TAGLINE = 'AI-kurser i Danmark — overblik uden gætterier';
export const DEFAULT_DESCRIPTION =
  'Uafhængigt overblik over AI-kurser i Danmark. Filtrer efter niveau, format og udbyder — og find det næste skridt med LearnAI.';

export function siteUrl(): string {
  return (import.meta.env.PUBLIC_SITE_URL || 'https://kursusoversigten.dk').replace(/\/$/, '');
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
  let p = path.startsWith('/') ? path : `/${path}`;
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return `${siteUrl()}${p}`;
}

export function defaultOgImage(): string {
  return absoluteUrl('/og-default.png');
}

/** Stable entity ids for linked JSON-LD @graph */
export function orgId(): string {
  return `${siteUrl()}/#organization`;
}

export function websiteId(): string {
  return `${siteUrl()}/#website`;
}

export function logoId(): string {
  return `${siteUrl()}/#logo`;
}

/** Ascii kebab slug for Person @id (e.g. "Mette Ravn" → mette-ravn) */
export function authorSlug(name: string): string {
  return name
    .replace(/æ/gi, 'ae')
    .replace(/ø/gi, 'oe')
    .replace(/å/gi, 'aa')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function authorId(name: string): string {
  return `${siteUrl()}/#author-${authorSlug(name)}`;
}

export function organizationJsonLd() {
  return {
    '@type': 'Organization',
    '@id': orgId(),
    name: SITE_NAME,
    url: siteUrl(),
    description: DEFAULT_DESCRIPTION,
    logo: {
      '@type': 'ImageObject',
      '@id': logoId(),
      url: defaultOgImage(),
    },
    sameAs: ['https://learnai.nu', 'https://jesperschneider.dk'],
    inLanguage: 'da-DK',
    areaServed: {
      '@type': 'Country',
      name: 'Denmark',
    },
  };
}

export function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    name: SITE_NAME,
    url: siteUrl(),
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'da-DK',
    publisher: { '@id': orgId() },
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

export const JESPER_AUTHOR_NAME = 'Jesper Gunris Schneider';
export const JESPER_AUTHOR_PATH = '/forfattere/jesper-gunris-schneider';

/** Canonical Person node for Jesper — reuse on articles + author page */
export function jesperPersonJsonLd() {
  return {
    '@type': 'Person',
    '@id': authorId(JESPER_AUTHOR_NAME),
    name: JESPER_AUTHOR_NAME,
    url: absoluteUrl(JESPER_AUTHOR_PATH),
    jobTitle: 'Chef for digital forretningsudvikling',
    worksFor: {
      '@type': 'Organization',
      name: 'TEKNIQ',
    },
    sameAs: ['https://jesperschneider.dk', 'https://learnai.nu'],
    knowsAbout: [
      'AI-adoption',
      'AI-kurser',
      'digital ledelse',
      'digital forretningsudvikling',
      'kompetenceudvikling',
    ],
  };
}

export function personJsonLd(name: string) {
  if (authorSlug(name) === 'jesper-gunris-schneider' || name === JESPER_AUTHOR_NAME) {
    return jesperPersonJsonLd();
  }
  const data: Record<string, unknown> = {
    '@type': 'Person',
    '@id': authorId(name),
    name,
  };
  if (authorSlug(name) === 'kursusoversigt-redaktionen') {
    data.url = absoluteUrl('/om');
  }
  return data;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
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
  const courseUrl = absoluteUrl(`/ai-kurser/${course.slug}`);
  const providerUrl = absoluteUrl(`/udbydere/${course.provider_slug}`);
  const data: Record<string, unknown> = {
    '@type': 'Course',
    '@id': courseUrl,
    name: course.title,
    description: course.description,
    url: courseUrl,
    provider: {
      '@type': 'EducationalOrganization',
      '@id': providerUrl,
      name: course.provider_name,
      url: providerUrl,
      sameAs: course.source_url,
    },
    isPartOf: { '@id': websiteId() },
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
    url: courseUrl,
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
  const articleUrl = absoluteUrl(`/artikler/${article.slug}`);
  return {
    '@type': 'Article',
    '@id': articleUrl,
    headline: article.title,
    description: article.description,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    datePublished: article.pubDate.toISOString(),
    dateModified: (article.updatedDate || article.pubDate).toISOString(),
    author: { '@id': authorId(article.author) },
    publisher: { '@id': orgId() },
    isPartOf: { '@id': websiteId() },
    inLanguage: 'da-DK',
  };
}

/**
 * Build a single schema.org @graph document.
 * Strips per-node @context and dedupes nodes that share an @id (first wins).
 */
export function buildJsonLdGraph(nodes: Record<string, unknown>[]) {
  const seen = new Set<string>();
  const graph: Record<string, unknown>[] = [];

  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue;
    const cleaned: Record<string, unknown> = { ...node };
    delete cleaned['@context'];

    const id = cleaned['@id'];
    if (typeof id === 'string' && id.length > 0) {
      if (seen.has(id)) continue;
      seen.add(id);
    }

    graph.push(cleaned);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

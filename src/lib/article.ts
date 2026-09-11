/** Danish-friendly slug helpers and article meta (reading time, dates). */

const WORDS_PER_MINUTE = 210;

export function danishSlug(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Estimate reading time from markdown/plain body (~210 Danish words/min). */
export function readingTimeMinutes(body: string): number {
  const plain = body
    .replace(/^---[\s\S]*?---\n?/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plain ? plain.split(' ').filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatArticleDate(date: Date): string {
  return date.toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** True when updatedDate is present and not the same calendar day as pubDate. */
export function hasDistinctUpdatedDate(pubDate: Date, updatedDate?: Date): boolean {
  if (!updatedDate) return false;
  return pubDate.toDateString() !== updatedDate.toDateString();
}

export type TocHeading = {
  depth: number;
  slug: string;
  text: string;
};

/** Build TOC from Astro render() headings — show when ≥2 H2s; include nested H3s. */
export function buildToc(headings: TocHeading[]): TocHeading[] {
  const h2Count = headings.filter((h) => h.depth === 2).length;
  if (h2Count < 2) return [];
  return headings
    .filter((h) => h.depth === 2 || h.depth === 3)
    .map((h) => ({ ...h, text: h.text.trim() }));
}

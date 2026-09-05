import coursesJson from '../data/courses.json';
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

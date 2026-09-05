export type CourseFormat = 'online' | 'onsite' | 'hybrid';
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

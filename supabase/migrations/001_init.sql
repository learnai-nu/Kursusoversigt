-- Kursusoversigt initial schema
-- courses, leads, events + RLS

create extension if not exists "pgcrypto";

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  provider_slug text not null,
  provider_name text not null,
  category text not null,
  level text not null check (level in ('begynder', 'mellemniveau', 'avanceret')),
  format text not null check (format in ('online', 'onsite', 'hybrid')),
  location text,
  price_dkk integer,
  price_note text,
  duration text,
  start_date date,
  language text default 'da',
  tags text[] default '{}',
  source_url text not null,
  last_verified date,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_provider_idx on public.courses (provider_slug);
create index if not exists courses_category_idx on public.courses (category);
create index if not exists courses_published_idx on public.courses (published);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  interest text,
  message text,
  course_slug text,
  source_page text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_type_idx on public.events (event_type);
create index if not exists events_created_idx on public.events (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

alter table public.courses enable row level security;
alter table public.leads enable row level security;
alter table public.events enable row level security;

drop policy if exists "Public read published courses" on public.courses;
create policy "Public read published courses"
  on public.courses for select to anon, authenticated
  using (published = true);

drop policy if exists "Anon insert leads" on public.leads;
create policy "Anon insert leads"
  on public.leads for insert to anon, authenticated
  with check (true);

drop policy if exists "Anon insert events" on public.events;
create policy "Anon insert events"
  on public.events for insert to anon, authenticated
  with check (true);

comment on table public.courses is 'AI courses catalog; seed can live in repo JSON for demo mode';
comment on table public.leads is 'Soft leads forwarded conceptually to LearnAI';
comment on table public.events is 'Product/analytics events e.g. lead_submitted';

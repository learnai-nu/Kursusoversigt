from pathlib import Path
ROOT = Path("/workspace/Kursusoversigt")
P = ROOT / "src" / "pages"

(P / "index.astro").write_text("""---
import BaseLayout from '../layouts/BaseLayout.astro';
import CourseCard from '../components/CourseCard.astro';
import SoftCTA from '../components/SoftCTA.astro';
import ArticleCard from '../components/ArticleCard.astro';
import { getAllCourses, getAllProviders } from '../lib/courses';
import { getCollection } from 'astro:content';

const courses = getAllCourses().slice(0, 6);
const providers = getAllProviders();
const articles = (await getCollection('articles'))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);
---
<BaseLayout>
  <section class="border-b border-stone-200/80 bg-[radial-gradient(ellipse_at_top,_#e3ebe3_0%,_#f7f4ef_55%)]">
    <div class="container-site grid gap-10 py-16 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-moss-700">Dansk AI-kursusoversigt</p>
        <h1 class="mt-3 max-w-2xl text-4xl leading-tight text-paper-ink sm:text-5xl">Find AI-kurser i Danmark — uden støj og uden opdigtede priser.</h1>
        <p class="mt-5 max-w-xl text-lg leading-relaxed text-stone-700">
          Vi samler offentlige forløb fra universiteter, teknologiske institutter og erhvervsakademier. Ukendte priser og datoer står som <strong>Ukendt</strong>. Klar til handling? LearnAI er næste skridt.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a class="btn-primary" href="/ai-kurser">Gå til kurser</a>
          <a class="btn-secondary" href="/artikler">Læs artikler</a>
        </div>
      </div>
      <div class="card p-6">
        <p class="text-sm text-stone-500">Lige nu i oversigten</p>
        <dl class="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <dt class="text-xs uppercase tracking-wide text-stone-400">Kurser</dt>
            <dd class="font-serif text-3xl text-moss-900">{getAllCourses().length}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-stone-400">Udbydere</dt>
            <dd class="font-serif text-3xl text-moss-900">{providers.length}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-stone-400">Artikler</dt>
            <dd class="font-serif text-3xl text-moss-900">{articles.length > 0 ? (await getCollection('articles')).length : 7}</dd>
          </div>
        </dl>
        <p class="mt-5 text-xs leading-relaxed text-stone-500">Demo-mode kører på lokal JSON, når Supabase ikke er konfigureret.</p>
      </div>
    </div>
  </section>

  <section class="container-site py-14">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-3xl">Udvalgte kurser</h2>
        <p class="mt-1 text-stone-600">Et udsnit — brug filtrene for det fulde katalog.</p>
      </div>
      <a href="/ai-kurser" class="text-sm text-sea-700 no-underline hover:underline">Se alle →</a>
    </div>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => <CourseCard course={course} />)}
    </div>
  </section>

  <section class="container-site pb-14">
    <h2 class="text-3xl">Udbydere</h2>
    <p class="mt-1 text-stone-600">Universiteter, institutter og praktiske udbydere i Danmark.</p>
    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((p) => (
        <a href={`/udbydere/${p.slug}`} class="card block p-4 no-underline transition hover:border-moss-300">
          <p class="font-serif text-lg text-paper-ink">{p.name}</p>
          <p class="mt-1 text-sm text-stone-500">{p.city}</p>
        </a>
      ))}
    </div>
  </section>

  <section class="container-site pb-14">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-3xl">Seneste artikler</h2>
        <p class="mt-1 text-stone-600">Redaktionelle guider til AI-kompetencer i dansk kontekst.</p>
      </div>
      <a href="/artikler" class="text-sm text-sea-700 no-underline hover:underline">Alle artikler →</a>
    </div>
    <div class="grid gap-5 md:grid-cols-3">
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
  </section>

  <section class="container-site pb-16">
    <SoftCTA campaign="home" />
  </section>
</BaseLayout>
""", encoding="utf-8")

(P / "ai-kurser" / "index.astro").write_text("""---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import FilterBar from '../../components/FilterBar.astro';
import CourseCard from '../../components/CourseCard.astro';
import SoftCTA from '../../components/SoftCTA.astro';
import { filterCourses, getCategories, getAllProviders, formatLabel } from '../../lib/courses';
import { breadcrumbJsonLd } from '../../lib/seo';

const url = Astro.url;
const values = {
  q: url.searchParams.get('q') || undefined,
  category: url.searchParams.get('category') || undefined,
  level: url.searchParams.get('level') || undefined,
  format: url.searchParams.get('format') || undefined,
  provider: url.searchParams.get('provider') || undefined,
};
const courses = filterCourses(values);
const categories = getCategories();
const providers = getAllProviders().map((p) => ({ slug: p.slug, name: p.name }));
const crumbs = breadcrumbJsonLd([
  { name: 'Forside', path: '/' },
  { name: 'AI-kurser', path: '/ai-kurser' },
]);
---
<BaseLayout
  title="AI-kurser i Danmark"
  description="Filtrer AI-kurser efter niveau, format, kategori og udbyder. Priser og datoer markeres som Ukendt, når de ikke er verificeret."
  jsonLd={[crumbs]}
>
  <div class="container-site py-10">
    <Breadcrumbs items={[{ label: 'Forside', href: '/' }, { label: 'AI-kurser' }]} />
    <h1 class="text-4xl">AI-kurser i Danmark</h1>
    <p class="mt-3 max-w-2xl text-stone-650 text-stone-600">
      {courses.length} kurser matcher dine filtre. Klik ind på et kursus for kilde-URL og sidst verificeret dato.
    </p>
    <div class="mt-8">
      <FilterBar categories={categories} providers={providers} values={values} />
    </div>
    {Object.values(values).some(Boolean) && (
      <p class="mt-4 text-sm text-stone-500">
        Aktive filtre:
        {[values.q && `søg="${values.q}"`, values.category && formatLabel(values.category), values.level && formatLabel(values.level), values.format && formatLabel(values.format), values.provider && providers.find(p => p.slug === values.provider)?.name]
          .filter(Boolean)
          .join(' · ')}
      </p>
    )}
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => <CourseCard course={course} />)}
    </div>
    {courses.length === 0 && (
      <div class="card mt-8 p-8 text-center">
        <p class="font-serif text-xl">Ingen kurser matchede.</p>
        <p class="mt-2 text-stone-600">Prøv at fjerne et filter, eller se <a href="/ai-kurser">alle kurser</a>.</p>
      </div>
    )}
    <div class="mt-14">
      <SoftCTA campaign="course-list" title="Brug for hjælp til at vælge?" text="LearnAI kan hjælpe dig med at matche kursusniveau til dit teams behov." />
    </div>
  </div>
</BaseLayout>
""", encoding="utf-8")

(P / "ai-kurser" / "[slug].astro").write_text("""---
export const prerender = true;
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import LeadForm from '../../components/LeadForm.astro';
import SoftCTA from '../../components/SoftCTA.astro';
import { getAllCourses, getCourseBySlug, formatPrice, formatLabel } from '../../lib/courses';
import { breadcrumbJsonLd, courseJsonLd } from '../../lib/seo';

export function getStaticPaths() {
  return getAllCourses().map((c) => ({ params: { slug: c.slug } }));
}

const { slug } = Astro.params;
const course = getCourseBySlug(slug!);
if (!course) {
  return Astro.redirect('/ai-kurser');
}

const crumbs = breadcrumbJsonLd([
  { name: 'Forside', path: '/' },
  { name: 'AI-kurser', path: '/ai-kurser' },
  { name: course.title, path: `/ai-kurser/${course.slug}` },
]);
---
<BaseLayout
  title={course.title}
  description={course.description}
  ogType="article"
  jsonLd={[crumbs, courseJsonLd(course)]}
>
  <div class="container-site py-10">
    <Breadcrumbs items={[
      { label: 'Forside', href: '/' },
      { label: 'AI-kurser', href: '/ai-kurser' },
      { label: course.title },
    ]} />
    <div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <article>
        <div class="flex flex-wrap gap-2">
          <span class="chip">{formatLabel(course.level)}</span>
          <span class="chip">{formatLabel(course.format)}</span>
          <span class="chip">{formatLabel(course.category)}</span>
          <span class="chip">{course.language === 'da' ? 'Dansk' : 'Engelsk'}</span>
        </div>
        <h1 class="mt-4 text-4xl">{course.title}</h1>
        <p class="mt-2 text-stone-600">
          <a href={`/udbydere/${course.provider_slug}`} class="text-sea-700 hover:underline">{course.provider_name}</a>
          · {course.location}
        </p>
        <p class="mt-6 text-lg leading-relaxed text-stone-700">{course.description}</p>

        <dl class="mt-8 grid gap-4 sm:grid-cols-2">
          <div class="card p-4">
            <dt class="text-xs uppercase tracking-wide text-stone-400">Pris</dt>
            <dd class="mt-1 font-medium">{formatPrice(course)}</dd>
          </div>
          <div class="card p-4">
            <dt class="text-xs uppercase tracking-wide text-stone-400">Varighed</dt>
            <dd class="mt-1 font-medium">{course.duration}</dd>
          </div>
          <div class="card p-4">
            <dt class="text-xs uppercase tracking-wide text-stone-400">Startdato</dt>
            <dd class="mt-1 font-medium">{course.start_date || 'Ukendt'}</dd>
          </div>
          <div class="card p-4">
            <dt class="text-xs uppercase tracking-wide text-stone-400">Sidst verificeret</dt>
            <dd class="mt-1 font-medium">{course.last_verified}</dd>
          </div>
        </dl>

        <div class="mt-8">
          <h2 class="text-2xl">Emner</h2>
          <div class="mt-3 flex flex-wrap gap-2">
            {course.tags.map((t) => <span class="chip">{t}</span>)}
          </div>
        </div>

        <div class="mt-8 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-950">
          <p><strong>Kilde:</strong> <a href={course.source_url} rel="noopener noreferrer" class="underline">{course.source_url}</a></p>
          <p class="mt-2">Priser og datoer kan ændre sig. Verificér altid direkte hos udbyderen før tilmelding.</p>
        </div>
      </article>

      <aside class="space-y-6">
        <LeadForm courseSlug={course.slug} />
        <SoftCTA campaign="course-detail" title="Vil du have sparring?" text="LearnAI hjælper dig med at vurdere, om dette kursus matcher dit behov — eller om et teamforløb er bedre." />
      </aside>
    </div>
  </div>
</BaseLayout>
""", encoding="utf-8")

(P / "udbydere" / "[slug].astro").write_text("""---
export const prerender = true;
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import CourseCard from '../../components/CourseCard.astro';
import SoftCTA from '../../components/SoftCTA.astro';
import { getAllProviders, getProviderBySlug, getCoursesByProvider } from '../../lib/courses';
import { breadcrumbJsonLd } from '../../lib/seo';

export function getStaticPaths() {
  return getAllProviders().map((p) => ({ params: { slug: p.slug } }));
}

const { slug } = Astro.params;
const provider = getProviderBySlug(slug!);
if (!provider) {
  return Astro.redirect('/ai-kurser');
}
const courses = getCoursesByProvider(provider.slug);
const crumbs = breadcrumbJsonLd([
  { name: 'Forside', path: '/' },
  { name: 'AI-kurser', path: '/ai-kurser' },
  { name: provider.name, path: `/udbydere/${provider.slug}` },
]);
---
<BaseLayout
  title={provider.name}
  description={provider.description}
  jsonLd={[crumbs]}
>
  <div class="container-site py-10">
    <Breadcrumbs items={[
      { label: 'Forside', href: '/' },
      { label: 'AI-kurser', href: '/ai-kurser' },
      { label: provider.name },
    ]} />
    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-moss-700">Udbyder</p>
    <h1 class="mt-2 text-4xl">{provider.name}</h1>
    <p class="mt-2 text-stone-600">{provider.city} · <a href={provider.website} rel="noopener noreferrer" class="text-sea-700 hover:underline">{provider.website.replace('https://','')}</a></p>
    <p class="mt-5 max-w-2xl text-lg text-stone-700">{provider.description}</p>

    <h2 class="mt-12 text-2xl">Kurser ({courses.length})</h2>
    <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => <CourseCard course={course} />)}
    </div>
    {courses.length === 0 && <p class="mt-4 text-stone-600">Ingen kurser i demo-data for denne udbyder endnu.</p>}

    <div class="mt-14">
      <SoftCTA campaign="provider" />
    </div>
  </div>
</BaseLayout>
""", encoding="utf-8")

print("pages part1 ok")

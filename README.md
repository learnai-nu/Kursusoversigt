# Kursusoversigt

Dansk SEO-lead site for AI-kurser i Danmark. Soft leads til https://learnai.nu

## Stack

- Astro 4 + TypeScript + Tailwind
- Content Collections + @supabase/supabase-js
- @astrojs/vercel hybrid

## Demo-mode

Uden Supabase-env: JSON seed, demo lead API, admin password demo.

## Setup

bun install
bun run dev
bun run build

Use bun/bunx only.

## Content

- 30 courses in src/data/courses.json
- 12 providers in src/data/providers.json
- 7 articles in src/content/articles/

Unknown price/date shown as Ukendt.

## Routes

/ /ai-kurser /ai-kurser/[slug] /udbydere/[slug] /artikler /artikler/[slug] /admin POST /api/lead /sitemap.xml /robots.txt

## JSON-LD

Organization WebSite Article Course BreadcrumbList. No FAQPage/HowTo.

## Supabase

supabase/migrations/001_init.sql

## UTM

utm_source=kursusoversigt&utm_medium=referral&utm_campaign=...

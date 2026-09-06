from pathlib import Path
ROOT = Path("/workspace/Kursusoversigt")

(ROOT / "package.json").write_text("""{
  "name": "kursusoversigt",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/tailwind": "^5.1.4",
    "@astrojs/vercel": "^7.8.2",
    "@supabase/supabase-js": "^2.47.10",
    "astro": "^4.16.18",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2"
  },
  "devDependencies": {
    "@types/node": "^22.10.2"
  }
}
""", encoding="utf-8")

(ROOT / "astro.config.mjs").write_text("""import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://kursusoversigten.dk',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [tailwind({ applyBaseStyles: false })],
  i18n: {
    defaultLocale: 'da',
    locales: ['da'],
  },
});
""", encoding="utf-8")

(ROOT / "tsconfig.json").write_text("""{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "jsx": "preserve"
  },
  "include": ["src/**/*", ".astro/types.d.ts"]
}
""", encoding="utf-8")

(ROOT / "tailwind.config.mjs").write_text("""/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f7f4ef',
          dark: '#ebe6dc',
          ink: '#1c1917',
        },
        moss: {
          50: '#f3f6f3',
          100: '#e3ebe3',
          200: '#c5d6c6',
          300: '#9bb89e',
          400: '#6f9473',
          500: '#4f7754',
          600: '#3c5e41',
          700: '#314c35',
          800: '#293e2c',
          900: '#223425',
        },
        clay: {
          400: '#c4a484',
          500: '#a67c52',
          600: '#8b6340',
        },
        sea: {
          600: '#2f5d6e',
          700: '#254a58',
          800: '#1e3c47',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28, 25, 23, 0.04), 0 8px 24px rgba(28, 25, 23, 0.06)',
      },
    },
  },
  plugins: [],
};
""", encoding="utf-8")

(ROOT / ".gitignore").write_text("""node_modules/
dist/
.astro/
.vercel/
.env
.env.local
.DS_Store
*.log
.bun/
""", encoding="utf-8")

(ROOT / ".env.example").write_text("""# Public (safe for browser)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-only
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=change-me

# Site
PUBLIC_SITE_URL=https://kursusoversigten.dk
PUBLIC_LEARNAI_URL=https://learnai.nu
""", encoding="utf-8")

(ROOT / "src" / "env.d.ts").write_text("""/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL?: string;
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  readonly ADMIN_PASSWORD?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_LEARNAI_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
""", encoding="utf-8")

print("config ok")

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function env(name: string): string | undefined {
  return (import.meta.env[name] as string | undefined) || process.env[name];
}

export function hasSupabaseEnv(): boolean {
  return Boolean(env('PUBLIC_SUPABASE_URL') && env('PUBLIC_SUPABASE_ANON_KEY'));
}

export function getSupabaseBrowser(): SupabaseClient | null {
  const url = env('PUBLIC_SUPABASE_URL');
  const key = env('PUBLIC_SUPABASE_ANON_KEY');
  if (!url || !key) return null;
  return createClient(url, key);
}

export function getSupabaseService(): SupabaseClient | null {
  const url = env('PUBLIC_SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isDemoMode(): boolean {
  return !hasSupabaseEnv();
}

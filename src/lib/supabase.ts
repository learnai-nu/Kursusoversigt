import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function hasSupabaseEnv(): boolean {
  return Boolean(
    import.meta.env.PUBLIC_SUPABASE_URL &&
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!hasSupabaseEnv()) return null;
  return createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function getSupabaseService(): SupabaseClient | null {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isDemoMode(): boolean {
  return !hasSupabaseEnv();
}

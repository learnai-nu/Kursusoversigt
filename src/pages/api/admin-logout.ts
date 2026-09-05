import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('ko_admin', { path: '/' });
  return redirect('/admin', 302);
};

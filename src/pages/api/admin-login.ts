import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = String(form.get('password') || '');
  const expected = import.meta.env.ADMIN_PASSWORD || 'demo';
  if (password !== expected) {
    return redirect('/admin?error=1', 302);
  }
  cookies.set('ko_admin', '1', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 8,
  });
  return redirect('/admin', 302);
};

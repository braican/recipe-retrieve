// src/routes/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals: { supabase, session } }) => {
  const code = url.searchParams.get('code');

  if (!session && code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      console.error('Invalid auth code.', e);
    }

    redirect(303, '/');
  }

  return {
    session,
    url: url.origin,
  };
};

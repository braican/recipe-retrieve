// src/routes/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals: { supabase, getSession } }) => {
  const code = url.searchParams.get('code');
  const session = await getSession();

  if (!session && code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      console.log(e);
      console.log('Invalid auth code.');
    }

    redirect(303, '/');
  }

  return {
    session,
    url: url.origin,
  };
};

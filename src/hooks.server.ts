// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// https://www.youtube.com/watch?v=lSm0GNnh-0I

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: key => event.cookies.get(key),
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' });
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' });
      },
    },
  });

  // Using `getUser()` here guarantees that the stored session is valid, and
  // calling getSession immediately after leaves no room for anyone to modify the
  // stored session.
  const { data: getUserData } = await event.locals.supabase.auth.getUser();
  const {
    data: { session },
  } = await event.locals.supabase.auth.getSession();

  // Handle the case of the user not being found in the database while the browser
  // still has a valid session. +layout.server.js will delete the cookie if the
  // session is null
  event.locals.session = getUserData.user == null ? null : session;

  const isProtectedRoute = event.route.id?.startsWith('/(protected)/');
  if (isProtectedRoute && !event.locals.session) {
    redirect(303, '/');
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    },
  });
};

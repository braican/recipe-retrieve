// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { getUser } }) => {
  const user = await getUser();

  // if the user is already logged in return them to the account page
  if (user) {
    throw redirect(303, '/account');
  }

  return { url: url.origin };
};

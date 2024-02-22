import { redirect } from '@sveltejs/kit';

export const GET = () => {
  redirect(303, '/');
};

export const POST = async ({ locals }) => {
  const session = await locals.getSession();

  if (session) {
    await locals.supabase.auth.signOut();
  }

  redirect(303, '/');
};

import { error, redirect } from '@sveltejs/kit';

export const GET = () => {
  redirect(303, '/');
};

export const POST = async ({ locals }) => {
  const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (err) {
    console.error('Error logging in with Google:', error);
    error(400, {
      message: 'Error logging in with Google',
    });
  }

  redirect(303, data.url);
};

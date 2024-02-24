import { redirect } from '@sveltejs/kit';

export const GET = () => {
  redirect(303, '/');
};

export const POST = async ({ locals: { supabase, session } }) => {
  if (session) {
    await supabase.auth.signOut();
  }

  redirect(303, '/');
};

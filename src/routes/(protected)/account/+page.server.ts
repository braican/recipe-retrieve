import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  update: async ({ request, locals: { supabase, session } }) => {
    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const username = formData.get('username') as string;
    const website = formData.get('website') as string;
    const avatarUrl = formData.get('avatarUrl') as string;

    const { error } = await supabase.from('profiles').upsert({
      id: session?.user.id,
      full_name: fullName,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    });

    if (error) {
      return fail(500, {
        fullName,
        username,
        website,
        avatarUrl,
      });
    }

    return {
      fullName,
      username,
      website,
      avatarUrl,
    };
  },
  signout: async ({ locals: { supabase, session } }) => {
    if (session) {
      await supabase.auth.signOut();
      redirect(303, '/');
    }
  },
};

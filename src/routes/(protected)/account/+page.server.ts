// import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  update: async ({ request, locals: { supabase, session } }) => {
    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;

    console.log(fullName);

    // const { error } = await supabase.from('profiles').upsert({
    //   id: session?.user.id,
    //   full_name: fullName,
    //   username,
    //   website,
    //   avatar_url: avatarUrl,
    //   updated_at: new Date(),
    // });

    // if (error) {
    //   return fail(500, {
    //     fullName,
    //     username,
    //     website,
    //     avatarUrl,
    //   });
    // }

    return {
      test: 'one',
    };
  },
};

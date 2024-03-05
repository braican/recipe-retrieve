import { error } from '@sveltejs/kit';
import type { Recipe } from '$userTypes';

export const load = async ({ params, locals: { supabase } }) => {
  const { data } = await supabase.from('recipes').select().eq('id', params.id).single();

  if (!data) {
    error(404, 'Recipe not found.');
  }

  return { recipe: data as Recipe };
};

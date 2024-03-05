import type { Recipe } from '$userTypes';

export const load = async ({ locals: { supabase } }) => {
  const { data: recipes, error } = await supabase.from('recipes').select().returns<Recipe[]>();

  if (error) {
    console.error('There was a problem fetching the recipes: ', error);
  }

  return {
    pageTitle: 'The Kitchen',
    recipes: recipes || [],
  };
};

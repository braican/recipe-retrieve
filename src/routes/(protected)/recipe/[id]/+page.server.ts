import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { updateRecipeRelations } from '$lib/utils';
import type { Recipe } from '$userTypes';

export const load = async ({ params, locals: { supabase } }) => {
  const { data: recipe } = await supabase
    .from('recipes')
    .select(
      `id, user_id, title, source_url, image_url, ingredients, steps,
      featuredIngredients:ingredients(id, title),
      tags(id, title)`,
    )
    .eq('id', params.id)
    .returns<Recipe>()
    .single();

  if (!recipe) {
    error(404, 'Recipe not found.');
  }

  return { recipe: recipe as Recipe };
};

export const actions = {
  updateTags: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const recipeId = formData.get('recipeId') as string;
    const featuredIngredients = formData.getAll('featuredIngredients[]') as string[];
    const tags = formData.getAll('tags[]') as string[];

    if (!recipeId) {
      return fail(400, { error: 'You must provide a recipe ID.' });
    }

    await updateRecipeRelations(
      supabase,
      recipeId,
      featuredIngredients,
      'ingredients',
      'recipes_ingredients',
      'ingredient_id',
    );

    await updateRecipeRelations(supabase, recipeId, tags, 'tags', 'recipes_tags', 'tag_id');
  },
  updateIngredients: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const recipeId = formData.get('recipeId') as string;
    const ingredients = formData.getAll('ingredients[]') as string[];

    if (!recipeId) {
      return fail(400, { error: 'You must provide a recipe ID.' });
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ ingredients })
      .eq('id', recipeId);

    if (updateError) {
      return fail(500, { error: updateError.message });
    }
  },
};

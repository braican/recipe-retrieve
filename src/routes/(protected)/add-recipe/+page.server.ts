import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_AI_KEY } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { prompt, getRowByTitle } from '$lib/utils';

const parseRecipe = async (recipe: string): Promise<string> => {
  const ai = new GoogleGenerativeAI(GEMINI_AI_KEY);
  const model = ai.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(`${prompt}\n${recipe}`);
  const response = await result.response;
  return response.text();
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals: { supabase } }) => {
  const ingredients = await supabase.from('ingredients').select('title');
  const tags = await supabase.from('tags').select('title');

  return {
    pageTitle: 'Add New Recipe',
    ingredients: ingredients?.data?.map(ingredient => ingredient.title) ?? [],
    tags: tags?.data?.map(tag => tag.title) ?? [],
  };
};

/** @type {import('./$types').Actions} */
export const actions = {
  parse: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title') as string;
    const source = data.get('source') as string;
    const image = data.get('image') as string;
    const recipe = data.get('recipe') as string;
    const recipeData = { title, source, image };

    if (!recipe) {
      return fail(400, { error: 'No recipe was provided.' });
    }

    try {
      const parsedRecipe = await parseRecipe(recipe);
      if (parsedRecipe === '0') {
        return {
          action: 'parse',
          error: 'There was a problem parsing your recipe. You can still add it manually.',
          recipe: recipeData,
        };
      }

      const recipeJson = JSON.parse(parsedRecipe);
      return {
        action: 'parse',
        recipe: {
          ...recipeData,
          ...recipeJson,
        },
      };
    } catch (e) {
      console.log(e);
      if (e instanceof SyntaxError) {
        return fail(500, {
          error:
            'There was a problem parsing the return value. You can still add your recipe manually.',
        });
      }

      if (e instanceof Error) {
        return fail(500, { error: `${e.message} Try adding your recipe manually.` });
      }

      return fail(500, {
        error: 'Something went wrong parsing your recipe. You can still add it manually.',
      });
    }
  },

  submit: async ({ request, locals: { supabase, session } }) => {
    if (!session) {
      redirect(303, '/');
    }
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const source = formData.get('source') as string;
    const image = formData.get('image') as string;
    const ingredients = formData.getAll('ingredients[]') as string[];
    const steps = formData.getAll('steps[]') as string[];
    const featuredIngredients = formData.getAll('featuredIngredients[]') as string[];
    const tags = formData.getAll('tags[]') as string[];

    if (!title) {
      return fail(400, { error: 'You must provide a recipe title.' });
    }

    if (ingredients.length < 1 || steps.length < 1) {
      return fail(400, { error: 'Your recipe must include at least one ingredient and one step.' });
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert({
        user_id: session.user.id,
        title,
        source_url: source,
        image_url: image,
        ingredients,
        steps,
      })
      .select()
      .single();

    if (error) {
      return fail(500, { error: error.message });
    }

    if (featuredIngredients.length > 0) {
      featuredIngredients.forEach(async ingredient => {
        const ingredientId = await getRowByTitle(supabase, 'ingredients', ingredient);
        if (ingredientId) {
          await supabase.from('recipes_ingredients').insert({
            recipe_id: data.id,
            ingredient_id: ingredientId,
          });
        }
      });
    }

    if (tags.length > 0) {
      tags.forEach(async tag => {
        const tagId = await getRowByTitle(supabase, 'tags', tag);
        if (tagId) {
          await supabase.from('recipes_tags').insert({
            recipe_id: data.id,
            tag_id: tagId,
          });
        }
      });
    }

    redirect(303, `/recipe/${data.id}`);
  },
};

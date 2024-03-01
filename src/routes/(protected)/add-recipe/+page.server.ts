import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_AI_KEY } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

const prompt = `
You are a helpful tool that can parse recipes from text and identify the ingredients and the steps present in the recipe. When presented with a recipe, you should return JSON consisting of three properties. The first should be of key "ingredients", which should be an array of strings representing the ingredients in the recipe along with their amounts. You should take this directly from the recipe input. The second should be key "steps", and this should be an array of strings representing the steps in the recipe. This should be taken directly from the recipe input with no changes.

Here's an example:

RECIPE:

1.5 lbs. baby yellow potatoes (or petite gold)
Extra-virgin olive oil
1 1/2 tsp. dried oregano
1 tsp. garlic powder
Kosher salt and black pepper
1 small lemon (or 1/2 large), sliced into 1/4-inch thick rounds
4 to 5 oz. feta cheese, cut or crumbled into chunks
1/3 cup roughly chopped fresh dill

Boil potatoes in a pot of generously salted water until fork-tender, about 10 to 15 minutes. Drain, and let cool slightly. Preheat oven to 450ºF.
In a small bowl, combine 3 Tbsp. extra-virgin olive oil, oregano, garlic powder, 1/2 tsp. salt, and 1/2 tsp. black pepper; mix well.
Transfer potatoes to a large rimmed baking sheet covered with parchment paper. Drizzle with half of the oil mixture and toss to coat. Using the bottom of a jar or glass, smash the potatoes until they are crushed. Nestle lemon slices in among the potatoes, and brush remaining oil mixture over lemons and potatoes. Roast for 30 minutes, until golden and crisp.
Remove lemon slices from the pan, and let cool on a cutting board for just a few minutes. Use a sharp chefs knife to very finely mince the lemon, and add to a small bowl. Drizzle with 2 to 3 Tbsp. extra-virgin olive oil and a pinch of salt; mix well.
Pour lemon dressing over potatoes and add feta; toss well. Transfer to a bowl, add fresh dill, and give it one more toss before serving warm. (I also like to garnish with extra cracked black pepper.)

EXPECTED OUTPUT:

{
  "ingredients": [
    "1.5 lbs. baby yellow potatoes (or petite gold)",
    "Extra-virgin olive oil",
    "1 1/2 tsp. dried oregano",
    "1 tsp. garlic powder",
    "Kosher salt and black pepper",
    "1 small lemon (or 1/2 large), sliced into 1/4-inch thick rounds",
    "4 to 5 oz. feta cheese, cut or crumbled into chunks",
    "1/3 cup roughly chopped fresh dill"
  ],
  "steps": [
    "Boil potatoes in a pot of generously salted water until fork-tender, about 10 to 15 minutes. Drain, and let cool slightly. Preheat oven to 450ºF.",
    "In a small bowl, combine 3 Tbsp. extra-virgin olive oil, oregano, garlic powder, 1/2 tsp. salt, and 1/2 tsp. black pepper; mix well.",
    "Transfer potatoes to a large rimmed baking sheet covered with parchment paper. Drizzle with half of the oil mixture and toss to coat. Using the bottom of a jar or glass, smash the potatoes until they are crushed. Nestle lemon slices in among the potatoes, and brush remaining oil mixture over lemons and potatoes. Roast for 30 minutes, until golden and crisp.",
    "Remove lemon slices from the pan, and let cool on a cutting board for just a few minutes. Use a sharp chefs knife to very finely mince the lemon, and add to a small bowl. Drizzle with 2 to 3 Tbsp. extra-virgin olive oil and a pinch of salt; mix well.",
    "Pour lemon dressing over potatoes and add feta; toss well. Transfer to a bowl, add fresh dill, and give it one more toss before serving warm. (I also like to garnish with extra cracked black pepper.)"
  ]
}

Following these instructions, parse the ingredients from the recipe below:

RECIPE:
`;

const parseRecipe = async (recipe: string): Promise<string> => {
  const ai = new GoogleGenerativeAI(GEMINI_AI_KEY);
  const model = ai.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(`${prompt}\n${recipe}`);
  const response = await result.response;
  return response.text();
};

/** @type {import('./$types').Actions} */
export const actions = {
  parse: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title') as string;
    const source = data.get('source') as string;
    const image = data.get('image') as string;
    const recipe = data.get('recipe') as string;

    if (!recipe) {
      return fail(400, { error: 'No recipe was provided.' });
    }

    try {
      const parsedRecipe = await parseRecipe(recipe);
      const recipeJson = JSON.parse(parsedRecipe);
      return {
        action: 'parse',
        recipe: {
          title,
          source,
          image,
          ...recipeJson,
        },
      };
    } catch (e) {
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

  submit: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title') as string;
    const source = data.get('source') as string;
    const image = data.get('image') as string;
    const ingredients = data.getAll('ingredients[]') as string[];
    const steps = data.getAll('steps[]') as string[];

    console.log('submit to supabase');

    // console.log(title, source, image, ingredients, steps);

    redirect(303, '/kitchen');
  },
};

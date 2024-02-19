import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_KEY);

async function runGemini() {

	// For text-only input, use the gemini-pro model
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });

	const prompt = `
  You are a helpful tool that can parse recipes from text and identify the ingredients present in the recipe. When presented with a recipe, you should return JSON contianing an array of ingredients and their amounts. Each object representing an ingredient should have two properties: the full text of the ingredient as it appears in the recipe and the name of the ingredient. Both of these properties should be strings. The name of the ingredient should not include any descriptive adjectives (i.e. omitting "small" from "1 small potato"). Exclude any ingredients that are not food items (i.e. "parchment paper" or "rimmed baking sheet"). Exclude salt and peppper.

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
  Transfer potatoes to a large rimmed baking sheet covered with parchment paper. Drizzle with half of the oil mixture and toss to coat. Using the bottom of a jar or glass, smash the potatoes until they’re crushed. Nestle lemon slices in among the potatoes, and brush remaining oil mixture over lemons and potatoes. Roast for 30 minutes, until golden and crisp.
  Remove lemon slices from the pan, and let cool on a cutting board for just a few minutes. Use a sharp chef’s knife to very finely mince the lemon, and add to a small bowl. Drizzle with 2 to 3 Tbsp. extra-virgin olive oil and a pinch of salt; mix well.
  Pour lemon dressing over potatoes and add feta; toss well. Transfer to a bowl, add fresh dill, and give it one more toss before serving warm. (I also like to garnish with extra cracked black pepper.)

  EXPECTED OUTPUT:

  [
    {
      "fullText": "1.5 lbs. baby yellow potatoes (or petite gold)",
      "name": "yellow potatoes"
    },
    {
      "fullText": "Extra-virgin olive oil",
      "name": "Extra-virgin olive oil"
    },
    {
      "fullText": "1 1/2 tsp. dried oregano",
      "name": "dried oregano"
    },
    {
      "fullText": "1 tsp. garlic powder",
      "name": "garlic powder"
    },
    {
      "fullText": "1 tsp. garlic powder",
      "name": "garlic powder"
    },
    {
      "fullText": "1 small lemon (or 1/2 large), sliced into 1/4-inch thick rounds",
      "name": "lemon"
    },
    {
      "fullText": "4 to 5 oz. feta cheese, cut or crumbled into chunks",
      "name": "feta cheese"
    },
    {
      "fullText": "1/3 cup roughly chopped fresh dill",
      "name": "fresh dill"
    },
  ]

  Following these instructions, parse the ingredients from the recipe below:

  1 pound flank steak, sliced into thin, bite-sized pieces
  ¼ cup cornstarch, divided
  1 tablespoon oil
  ½ teaspoon ginger, minced
  3 cloves garlic, minced
  ½ cup low sodium soy sauce
  ½ cup water
  ½ cup dark brown sugar
  ¼ teaspoon crushed red pepper flakes (optional)
  1 bunch green onions, sliced into 1-2" sections
  Rice or rice noodles, to serve.

  In a large, sealable freezer bag, combine the sliced flank steak and cornstarch. Seal, shake, and toss until the flank steak pieces are evenly coated in the cornstarch.

  Heat 1 tablespoon of oil in a large, heavy bottomed skillet over medium high heat. Once hot, add in the beef pieces and stir-fry until browned, about 2-3 minutes. Remove the beef from the skillet and set aside.
  In the same skillet, add in the ginger and garlic. Cook until fragrant, about 30 seconds. Pour in the soy sauce, water, and dark brown sugar, and stir until well combined and the sugar has evaporated. Cook until the sauce slightly thickens, about 3 minutes, add in the crushed red pepper flakes, and then add back in the beef. Bring the mixture to a boil, stir, and add in the green onions. Cook for an additional minute and then serve over rice or rice noodles.
`;

	const result = await model.generateContent(prompt);
	const response = await result.response;
	const text = response.text();
	console.log(text);
}

runGemini();

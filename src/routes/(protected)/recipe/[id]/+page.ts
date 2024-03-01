import { error } from '@sveltejs/kit';

export async function load({ params }) {
  try {
    const recipeId = params.id;
    return {
      recipeId,
    };
  } catch (e) {
    error(500, 'An error occurred. Please try again.');
  }
}

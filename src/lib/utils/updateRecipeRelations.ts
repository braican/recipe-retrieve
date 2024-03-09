import type { SupabaseClient } from '@supabase/supabase-js';
import type { RecipeTermJoin } from '$userTypes';

export const updateRecipeRelations = async (
  supabase: SupabaseClient,
  recipeId: number | string,
  formValues: {
    taxonomy: number;
    term: string;
  }[],
) => {
  const { data: dbRels } = await supabase
    .from('recipes_terms')
    .select('term_id')
    .eq('recipe_id', recipeId)
    .returns<RecipeTermJoin[]>();

  const oldRels = dbRels?.map(rel => rel.term_id) ?? [];
  const newRels = await Promise.all(
    formValues
      .map(async ({ taxonomy, term }) => {
        if (/^-?\d+$/.test(term)) {
          return parseInt(term);
        }

        const { data: newTerm } = await supabase
          .from('terms')
          .insert({ title: term, taxonomy })
          .select()
          .single();

        if (newTerm?.id) {
          return newTerm.id;
        }

        return null;
      })
      .filter(x => x),
  );

  const toRemove = oldRels.filter(id => !newRels.includes(id));
  const toAdd = newRels.filter(id => !oldRels.includes(id));

  if (toRemove.length > 0) {
    await supabase.from('recipes_terms').delete().in('term_id', toRemove);
  }

  if (toAdd.length > 0) {
    await supabase
      .from('recipes_terms')
      .insert(toAdd.map(itemId => ({ recipe_id: recipeId, term_id: itemId })));
  }
};

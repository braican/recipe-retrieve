import type { SupabaseClient } from '@supabase/supabase-js';
import type { Term } from '$userTypes';

export const updateRecipeRelations = async (
  supabase: SupabaseClient,
  recipeId: number | string,
  formValues: string[],
  termTable: string,
  joinTable: string,
  columnName: string,
) => {
  const { data: dbRels } = await supabase
    .from(joinTable)
    .select(columnName)
    .eq('recipe_id', recipeId)
    .returns<Term[]>();

  const oldRels = dbRels?.map(rel => rel[columnName]) ?? [];
  const newRels = await Promise.all(
    formValues
      .map(async itemId => {
        if (/^-?\d+$/.test(itemId)) {
          return parseInt(itemId);
        }

        const { data: newItem } = await supabase
          .from(termTable)
          .insert({ title: itemId })
          .select()
          .single();

        if (newItem?.id) {
          return newItem.id;
        }

        return null;
      })
      .filter(x => x),
  );

  const toRemove = oldRels.filter(id => !newRels.includes(id));
  const toAdd = newRels.filter(id => !oldRels.includes(id));

  if (toRemove.length > 0) {
    await supabase.from(joinTable).delete().in(columnName, toRemove);
  }

  if (toAdd.length > 0) {
    await supabase
      .from(joinTable)
      .insert(toAdd.map(itemId => ({ recipe_id: recipeId, [columnName]: itemId })));
  }
};

import type { SupabaseClient } from '@supabase/supabase-js';

export const getRowByTitle = async (
  supabase: SupabaseClient,
  table: string,
  title: string,
): Promise<number> => {
  const { data: ingredientData } = await supabase
    .from(table)
    .select('id')
    .eq('title', title)
    .single();

  if (ingredientData) {
    return ingredientData.id;
  }

  const { data: newIngredientData } = await supabase
    .from(table)
    .insert({ title: title })
    .select()
    .single();

  return newIngredientData?.id;
};

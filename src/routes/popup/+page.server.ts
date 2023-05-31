// ../popup/+page.server.ts

export let recipeId; // Annahme: Der Parameter für die Rezept-ID heißt "recipeId"

export async function load({ locale }) {
  const { supabase, session } = locals;

  // Rezeptdaten abrufen
  const { data: popUpRecipeData, error:popUpRecipeError } = await supabase
    .from('recipe')
    .select(`
      *,
      kitchen:kitchen_id (name),
      diet:diet_id (name),
      book:book_id (name)
    `)
    .eq('id', recipeId)
    .single();

  if (error) {
    throw new Error('Failed to fetch recipe data from the database.');
  }

  return {
    popUpRecipeData
  }
}

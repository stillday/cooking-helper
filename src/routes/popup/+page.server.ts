// ../popup/+page.server.ts

export let recipeId; // Annahme: Der Parameter für die Rezept-ID heißt "recipeId"
export let recipeData;

export async function load({ locale }) {
  const { supabase, session } = locals;

  // Rezeptdaten abrufen
  const { data, error } = await supabase
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

  recipeData = data;
}

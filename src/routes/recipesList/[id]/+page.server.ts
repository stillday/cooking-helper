// ../recipesList/[id]/+page.server.ts

export const load = async ({ locals, params: {id} }) => {
  const { supabase, session } = locals;
  console.log('popup server.ts load', id)
  const { data: popUpRecipeData, error: popUpRecipeError } = await supabase
    .from('recipe')
    .select(`
      name,
      description,
      rank (
        name
      ),
      popularity (
        name
      ),
      page,
      note,
      imageUrl,
      kitchen (
        name
      ),
      diet (
        name
      ),
      book (
        name
      ),
      recipe-ingredients (
        amount,
        ingredients (
          name
        ),
        units (
          name
        )
      )
    `)
    .eq('id', id);


  if (popUpRecipeError) {
    console.log('Error', popUpRecipeError)
    throw new Error('Failed to fetch data from the database.');
  }

  return {
    popUpRecipeData: popUpRecipeData?.[0]
  };
};
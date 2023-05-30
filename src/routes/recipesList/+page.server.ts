// ../recipesList/+page.server.ts

export const load = async ({ locals }) => {
  const { supabase, session } = locals;

  const { data: recipeData, error: recipeError } = await supabase.from('recipe').select('*');


  if (recipeError) {
    throw new Error('Failed to fetch data from the database.');
  }

  return {
    recipeData
  };
};
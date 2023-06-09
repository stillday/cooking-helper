// ../recipesList/+layout.server.ts

export const load = async ({ locals }) => {
  console.log('hello from layout.server.ts')
  const { supabase, session } = locals;

  const { data: recipeData, error: recipeError } = await supabase
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
      imageUrl
    `);


  if (recipeError) {
    throw new Error('Failed to fetch data from the database.');
  }

  return {
    recipeData
  };
};

export const load =async ({locals}) => {
  const { supabase, session } = locals;
  const { data: planRecipeData, error: planRecipeError } = await supabase
  .from('plan')
  .select(`
    id,
    recipe (
      id,
      name,
      page,
      book (
        name
      )
    ),
    date
  `);

    if (planRecipeError) {
      console.log('Plan loading Error', planRecipeError);
      throw new Error('Failed to fetch data from the database.');
    }

    return {
      planRecipeData
    };
};
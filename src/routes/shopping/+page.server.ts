export const load = async ({ locals }) => {
  const { supabase } = locals;
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

  const { data: ingredientData, error: ingredientError } = await supabase
    .from('recipe-ingredients')
    .select(`
      id,
      amount,
      "ingredients-id",
      "units-id",
      "recipe-id"
    `);

  if (planRecipeError || ingredientError) {
    console.log('Error fetching data', planRecipeError || ingredientError);
    throw new Error('Failed to fetch data from the database.');
  }

  return {
    planRecipes: planRecipeData,
    ingredients: ingredientData,
  };
};

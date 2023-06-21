let start:string;
let end:string;


export const load = async ({ locals }) => {
  const { supabase } = locals;
  
  if (start && end) {
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
    `)
    .lte('date', end)
    .gte('date', start);

    const recipeIds = planRecipeData.map(entry => entry.recipe.id);
  
    const { data: ingredientData, error: ingredientError } = await supabase
      .from('recipe-ingredients')
      .select(`
        id,
        amount,
        ingredients (
          name
        ),
        units (
          name
        ),
        "recipe-id"
      `)
      .in('recipe-id', recipeIds);
  
    if (planRecipeError || ingredientError) {
      console.log('Error fetching data', planRecipeError || ingredientError);
      throw new Error('Failed to fetch data from the database.');
    }

    
    start = ''
    end = ''

    let ingredients = ingredientData.reduce((acc, ingredient) => {
      const id = ingredient.ingredients.name + ingredient.units.name;
      // acc[id] = (acc[id] || 0) + ingredient.amount; 
      const accIndex = acc.findIndex(i => i.id === id)
      if (accIndex > -1) {
        acc[accIndex].amount += ingredient.amount;
      } else {
        acc.push({
          id,
          name: ingredient.ingredients.name,
          unit: ingredient.units.name,
          amount: ingredient.amount,
        })
      }
      return acc
    }, [] as { id: string, name: string, unit: string, amount: number}[]);
  
    return {
      planRecipes: planRecipeData,
      ingredients,
    };
  }
  return {
    planRecipes: [],
    ingredients: [],
  };
};

export const actions = {
  shoppingList: async ({ request, locals }) => {
    const { supabase } = locals;
    const data = await request.formData();

    start = data.get('startet') as string;
    end = data.get('ending') as string;

    return {success:true};
  },

  cleanShoppingList: async ({request, locals}) => {
    console.log('request', request);
    const { supabase } = locals;
    const data = await request.formData();

    const ingredName = data.get('ingredient') as string;

    console.log('clean', data)
    console.log('ingre', ingredName)
  }
}
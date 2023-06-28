let start:string;
let end:string;


export const load = async ({ locals }) => {
  const { supabase } = locals;
  
  if (start && end) {
    const { data: planRecipeData, error: planRecipeError } = await supabase
    .from('shopping-list')
    .select(`
      id,
      date,
      ingredients (
        id,
        name
      ),
      units (
        id,
        name
      ),
      amount,
      checked
    `)
    .lte('date', end)
    .gte('date', start); 
  
    if (planRecipeError) {
      console.log('Error fetching data', planRecipeError);
      throw new Error('Failed to fetch data from the database.');
    }
    
    start = ''
    end = ''

    let ingredients = planRecipeData.reduce((acc, ingredient) => {
      const id = ingredient.ingredients.name + ingredient.units.name;
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

    const ingredName = data.getAll('ingredient');

    console.log('clean', data)
    console.log('ingre', ingredName)
  },

  ingredCheck: async ({request, locals}) => {
    const {supabase} = locals;
    const data = await request.formData();
    console.log('DATA', data);
    const unitId = data.getAll('unit-id');
    const ingredient = data.getAll('ingredient');
    const start = data.getAll('startTime');
    const end = data.getAll('endTime');
    console.log('id', unitId);
    console.log('ingre', ingredient);
    console.log('start', start);
    console.log('end', end);
    
    // try {
    //   const { data: ingredCheckData, error: ingredCheckError} = await supabase
    //     .from('shopping-list')
    //     .select();
    // }
    const { data: ingredCheckData, error: ingredCheckError } = await supabase
    .from('shopping-list')
    .select(`
      id,
      date,
      ingredients (
        id,
        name
      ),
      units (
        id,
        name
      ),
      amount,
      checked
    `)
    .lte('date', end)
    .gte('date', start); 
  },
}
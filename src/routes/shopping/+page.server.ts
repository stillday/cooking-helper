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
    const unitId = data.get('unit-id');
    const ingredient = data.get('ingredient');
    const start = data.get('startTime');
    const end = data.get('endTime');
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
    .gte('date', start)
    .eq('ingredients.name', ingredient)
    .eq('units.name', unitId);

    if (ingredCheckError) {
      console.log('Error', ingredCheckError)
      throw new Error('Failed to fetch data from the database.');
    }

    const uncheckedEntries = ingredCheckData.filter(
      entry => !entry.checked && entry.date >= start && entry.date <= end
    );
    
    const uncheckedIds = uncheckedEntries.map(entry => entry.id);
    console.log(uncheckedIds);

    if (uncheckedIds.length > 0) {
      const { data: updateData, error: updateError } = await supabase
        .from('shopping-list')
        .update({ checked: true })
        .in('id', uncheckedIds)
        .eq('ingredients.name', ingredient)
        .eq('units.name', unitId)
        .gte('date', start)
        .lte('date', end)
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
        `);
    
      if (updateError) {
        console.error('Failed to update checked status:', updateError.message);
        throw new Error('Failed to update checked status in the database.');
      }
    
      console.log('Checked status updated successfully:', updateData);
    } else {
      console.log('No entries to update.');
    }
    console.log('check it', ingredCheckData)
  
    return {
      ingredCheckData
    };
  },
}
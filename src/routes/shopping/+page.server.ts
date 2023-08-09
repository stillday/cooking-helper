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
          checked: ingredient.checked,
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

async function reloadShoppingList(supabase) {
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

  const ingredients = planRecipeData.reduce((acc, ingredient) => {
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
        checked: ingredient.checked,
      })
    }
    return acc
  }, [] as { id: string, name: string, unit: string, amount: number, checked: boolean }[]);

  return {
    planRecipes: planRecipeData,
    ingredients,
  };
}


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
    // console.log('DATA', data);
    const unitId = data.get('unit-id');
    const ingredient = data.get('ingredient');
    const start = data.get('startTime');
    const end = data.get('endTime');
   
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

    if (ingredCheckError) {
      console.log('Error', ingredCheckError)
      throw new Error('Failed to fetch data from the database.');
    }


    
    const uncheckedIds = ingredCheckData.map(entry => entry.id);

    
    let updateChecked = [];

    uncheckedIds.forEach((value) => {
      const matchingEntry = ingredCheckData.find(entry => entry.id === value && entry.ingredients.name === ingredient && entry.units.name === unitId);
    
      if (matchingEntry) {
        updateChecked.push({
          id: value,
          checked: true
        });
      }
    });

    if (uncheckedIds.length > 0) {
      const { data: updateData, error: updateError } = await supabase
        .from('shopping-list')
        .upsert(updateChecked)
        .in('id', uncheckedIds)
        .eq('ingredients.name', ingredient)
        .eq('units.name', unitId)
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

      // Lade die Einkaufsliste neu
      const updatedData = await reloadShoppingList(supabase);

      return {
        ingredCheckData: updatedData,  // Oder wie auch immer die aktualisierten Daten heißen
      };
    } else {
      console.log('No entries to update.');
    }

    return {
      ingredCheckData
    };
  },
}
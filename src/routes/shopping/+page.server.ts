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

async function reloadShoppingList(supabase, start, end) {
  const { data: reloadShoppingData, error: reloadShoppingError } = await supabase
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

  if (reloadShoppingError) {
    console.log('Error fetching data', reloadShoppingError);
    throw new Error('Failed to fetch data from the database.');
  }

  const ingredients = reloadShoppingData.reduce((acc, ingredient) => {
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

  let data = reloadShoppingData;
  return {
    reloadShoppings: reloadShoppingData,
    ingredients,
    success:true
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
    const { supabase } = locals;
    const data = await request.formData();
    start = data.get('startTime');
    end = data.get('endTime');

    if (start && end) {
      // Zuerst holen Sie sich die überprüften Elemente aus der Datenbank, die im angegebenen Zeitraum liegen
      const { data: checkedItemsData, error: checkedItemsError } = await supabase
        .from('shopping-list')
        .select('id')
        .eq('checked', true)
        .lte('date', end)
        .gte('date', start);
  
      if (checkedItemsError) {
        console.log('Error fetching checked items data', checkedItemsError);
        throw new Error('Failed to fetch checked items data from the database.');
      }

      console.log('check', checkedItemsData);
      
          // Extrahieren Sie die IDs der überprüften Elemente
      const checkedItemIds = checkedItemsData.map(item => item.id);

      // Jetzt können Sie die überprüften Elemente aus der Datenbank löschen
      if (checkedItemIds.length > 0) {
        const { data: deleteData, error: deleteDataError } = await supabase
          .from('shopping-list')
          .delete()
          .in('id', checkedItemIds);

        if (deleteDataError) {
          console.log('Error deleting data', deleteDataError);
          throw new Error('Failed to delete data from the database.');
        }

        console.log('Deleted items:', deleteData);
      }
    }
  },

  ingredCheck: async ({request, locals}) => {
    const {supabase} = locals;
    let data = await request.formData();
    const unitId = data.get('unit-id');
    const ingredient = data.get('ingredient');
    start = data.get('startTime');
    end = data.get('endTime');
   
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

      
    } else {
      console.log('No entries to update.');
    }
    
    // Lade die Einkaufsliste neu
    data = await reloadShoppingList(supabase, start, end);
    // data = {...data, ...updatedData};
    return {
      ingredCheckData: data,
    };
  },
}
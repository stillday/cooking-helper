// src/lib/server/supabase.ts

export async function addRecepy(recipyData, supabase){
  try {
    const { data, error } = await supabase.from('recipe').insert(recipyData).select('id');
  
    if (error) {
      console.error('Failed to save recipe:', error.message);
      return {
        status: 500,
        body: JSON.stringify({ message: 'Failed to save recipe' })
      };
    }
  
    console.log('Recipe saved successfully:', data);
  
    return data[0].id;

  } catch (error) {
    console.error('Failed to save recipe:', error);
    return {
      status: 500,
      body: JSON.stringify({ message: 'Failed to save recipe' })
    };
  }
}  

export async function addIngredients(ingedientsData, supabase) {
  try {
    const { data, error } = await supabase.from('recipe-ingredients').insert(ingedientsData);
  
    if (error) {
      console.error('Failed to save recipe:', error.message);
      return {
        status: 500,
        body: JSON.stringify({ message: 'Failed to save recipe' })
      };
    }
  
    console.log('Recipe saved successfully:', data);
  

  } catch (error) {
    console.error('Failed to save recipe:', error);
    return {
      status: 500,
      body: JSON.stringify({ message: 'Failed to save recipe' })
    };
  }
}

export async function addPlan(planData, supabase){
  try {
    const { data, error } = await supabase.from('plan').insert(planData);
  
    if (error) {
      console.error('Failed to save recipe:', error.message);
      return {
        status: 500,
        body: JSON.stringify({ message: 'Failed to save recipe' })
      };
    }
  
    console.log('Recipe saved successfully:', data);
  
    return data[0].id;

  } catch (error) {
    console.error('Failed to save recipe:', error);
    return {
      status: 500,
      body: JSON.stringify({ message: 'Failed to save recipe' })
    };
  }
}

export async function addShopping(planData, supabase){
  // abruf des rezepts, ingredients laden
  // Abruf der Shopping list datenbank an datum, wo ingredients-ids
  // erhöhen oder hinzufügen am tag
  console.log('plan', planData[0]['recipe-id']);
  try {
    const { data: recipeData, error: recipeError } = await supabase
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
    .eq('recipe-id', planData[0]['recipe-id']);

    if (recipeError) {
      console.log('Error fetching data', recipeError);
      throw new Error('Failed to fetch data from the database.');
    }

    const { data: shoppingListData, error: shoppingListError } = await supabase
    .from('shopping-list')
    .select(`
      id,
      date,
      "ingredient-id",
      "unit-id",
      amount
    `)
    .eq('date', planData[0].date)
    .in('ingredient-id', recipeData.map(ing => ing.id))
    
    console.log('shoppinglistData', shoppingListData);

    if(shoppingListError) {
      console.log('Error fetching data', shoppingListError);
      throw new Error('Failed to fetch data from the database.');
    }

    let shoppingListUpsert = recipeData.reduce((acc, ingredient) => {
      console.log('ingre', ingredient);
      const id = ingredient.shoppingListUpsert.id;
      const accIndex = acc.findIndex(i => i.id === id)
      console.log(ingredient);
      if (accIndex > -1) {
        acc[accIndex].amount += ingredient.amount;
      } else {
        // acc.push({
        //   id,
        //   date: ,
        //   ingredient:,
        //   unit: ,
        //   amount: ,
        // })
      }
      
      console.log('acc', acc);
      return acc
    }, shoppingListData);

    return {
      shoppingListUpsert    
    }

    const { data, error } = await supabase.from('shopping-list').insert();
  
    if (error) {
      console.error('Failed to save recipe:', error.message);
      return {
        status: 500,
        body: JSON.stringify({ message: 'Failed to save recipe' })
      };
    }
  
    console.log('Recipe saved successfully:', data);
  
    return data[0].id;

  } catch (error) {
    console.error('Failed to save recipe:', error);
    return {
      status: 500,
      body: JSON.stringify({ message: 'Failed to save recipe' })
    };
  }
}
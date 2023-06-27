// ../recipesList/[id]/+page.server.ts

import { addPlan } from '$lib/server/supabase.js';

export const load = async ({ locals, params: {id} }) => {
  const { supabase, session } = locals;
  console.log('popup server.ts load', id)
  const { data: popUpRecipeData, error: popUpRecipeError } = await supabase
    .from('recipe')
    .select(`
      id,
      name,
      description,
      rank (
        name
      ),
      popularity (
        name
      ),
      page,
      note,
      imageUrl,
      kitchen (
        name
      ),
      diet (
        name
      ),
      book (
        name
      ),
      recipe-ingredients (
        amount,
        ingredients (
          name
        ),
        units (
          name
        )
      )
    `)
    .eq('id', id);


  if (popUpRecipeError) {
    console.log('Error', popUpRecipeError)
    throw new Error('Failed to fetch data from the database.');
  }

  return {
    popUpRecipeData: popUpRecipeData?.[0]
  };
};

export const actions = {
  addToPlan: async ( {request, locals}) => {
    const { supabase } = locals;
    const data = await request.formData();

    const id = data.get('id');
    const date = data.get('date');

    const planData = [
      {
        'recipe-id': id,
        date: date
      }
    ]

    async function addShopping(){
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
            id,
            name
          ),
          units (
            id,
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
          
        if(shoppingListError) {
          console.log('Error fetching data', shoppingListError);
          throw new Error('Failed to fetch data from the database.');
        }
    
        let shoppingListUpsert = recipeData.reduce((acc, ingredient) => {
          console.log('ingred', ingredient);
          const id = ingredient.id;
          const accIndex = acc.findIndex(i => i.id === id)
          console.log(ingredient);
          if (accIndex > -1) {
            acc[accIndex].amount += ingredient.amount;
          } else {
            acc.push({
              id,
              date: planData[0].date,
              "ingredient-id": ingredient.ingredients.id,
              "unit-id": ingredient.units.id,
              amount: ingredient.amount,
            })
          }
          
          return acc
        }, shoppingListData);
        
        const { data, error } = await supabase.from('shopping-list')
         .insert(shoppingListUpsert);
  
        if (error) {
          console.error('Failed to save recipe:', error.message);
          return {
            status: 500,
            body: JSON.stringify({ message: 'Failed to save recipe' })
          };
        }
      
        console.log('Recipe saved successfully:', data);
      
        // return data[0].id;
    
      } catch (error) {
        console.error('Failed to save recipe:', error);
        return {
          status: 500,
          body: JSON.stringify({ message: 'Failed to save recipe' })
        };
      }
    }
    
    await addPlan(planData, supabase);
    await addShopping();
  }
}

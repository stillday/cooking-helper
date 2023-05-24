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
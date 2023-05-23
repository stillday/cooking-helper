// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { supabase, session } = await parent();
  
  const { data: tableData, error: tableError } = await supabase.from('units').select('*');
  const { data: ingredData, error: ingredError } = await supabase.from('ingredients').select('*');
  const { data: kitchenData, error: kitchenError } = await supabase.from('kitchen').select('*');
  const { data: dietData, error: dietError } = await supabase.from('diet').select('*');
  const { data: bookData, error: bookError } = await supabase.from('book').select('*');

  if (tableError || ingredError || kitchenError || dietError || bookError) {
    throw new Error('Failed to fetch data from the database.');
  }

  return {
    tableData,
    ingredData,
    kitchenData,
    dietData,
    bookData
  };
};

export const post = async (request, { parent }) => {
  const { supabase } = await parent();
  const { dishName, selectedKitchen, selectedDiet, selectedBook, page } = request.body;

  try {
    const { data, error } = await supabase.from('recipe').insert([
      {
        name: dishName,
        'kitchen-id': selectedKitchen,
        'diet-id': selectedDiet,
        'book-id': selectedBook,
        page: page
      }
    ]);

    if (error) {
      console.error('Failed to save recipe:', error.message);
      return {
        status: 500,
        body: JSON.stringify({ message: 'Failed to save recipe' })
      };
    }

    console.log('Recipe saved successfully:', data);

    return {
      status: 200,
      body: JSON.stringify({ message: 'Recipe saved successfully' })
    };
  } catch (error) {
    console.error('Failed to save recipe:', error);
    return {
      status: 500,
      body: JSON.stringify({ message: 'Failed to save recipe' })
    };
  }
};

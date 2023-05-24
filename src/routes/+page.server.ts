// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { addIngredients, addRecepy } from '$lib/server/supabase.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const { supabase, session } = locals;
  
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

export const actions = {
  addRecipe: async ( {request, locals}) => {
      // TODO log the user in
        const { supabase } = locals;
        const data = await request.formData();

        const dishName = data.get('dishName');
        const selectedKitchen = data.get('kitchen');
        const selectedDiet = data.get('diet');
        const selectedBook = data.get('book');
        const page = data.get('page');
        const ingredientsUnits = data.getAll('ingredient.unit');
        const ingredientName = data.getAll('ingredient.name');
        const ingredientQuantity = data.getAll('ingredient.quantity'); 
      
        console.log(ingredientsUnits);
        console.log(ingredientName);
        console.log(ingredientQuantity);

        const recipyData = [
          {
            name: dishName,
            'kitchen-id': selectedKitchen,
            'diet-id': selectedDiet,
            'book-id': selectedBook,
            page: page,
          }
        ]

       const recipyId = await addRecepy(recipyData, supabase);

       setTimeout(async () => {
         const ingedientsData = ingredientsUnits.map((unit, index) => ({
            'recipe-id': recipyId,
            amount: ingredientQuantity[index],
            'ingredients-id': ingredientName[index],
            'units-id': unit
         }))
  
         await addIngredients(ingedientsData, supabase)
       }, 500)
  },

  addNewBook: async ({ request, locals }) => {
    const { supabase } = locals;
    const data = await request.formData();
  
    const newBook = data.get('newBook');
  
    // Überprüfe, ob das Buch bereits in der Datenbank vorhanden ist
    const { data: existingBookData, error: selectError } = await supabase
      .from('book')
      .select('name')
      .eq('name', newBook)
      .single();
  
    if (selectError) {
      console.error('Failed to check existing books:', selectError);
      return;
    }
  
    if (existingBookData) {
      console.log('Book already exists');
      return;
    }
  
    // Füge das neue Buch der Datenbank hinzu
    const { data: insertedBookData, error: insertError } = await supabase.from('book').insert([{ name: newBook }]);
    if (insertError) {
      console.error('Failed to add new book:', insertError);
      return;
    }
  
    // Setze das newBook-Feld zurück
    newBook = '';
  }
  
  
}


// src/routes/api/recipes.ts
import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const post: RequestHandler = async (request) => {
  try {
    const { title, description } = request.body;
    const { data, error } = await supabase
      .from('recipes')
      .insert([{ title, description }]);

    if (error) {
      console.error('Failed to save recipe:', error.message);
      return {
        status: 500,
        body: { error: 'Failed to save recipe' }
      };
    } else {
      console.log('Recipe saved successfully:', data);
      return {
        status: 200,
        body: { message: 'Recipe saved successfully' }
      };
    }
  } catch (error) {
    console.error('Failed to save recipe:', error.message);
    return {
      status: 500,
      body: { error: 'Failed to save recipe' }
    };
  }
};

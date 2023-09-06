let planId;

export const load =async ({locals}) => {
  const { supabase, session } = locals;
  const { data: planRecipeData, error: planRecipeError } = await supabase
  .from('plan')
  .select(`
    id,
    recipe (
      id,
      name,
      page,
      book (
        name
      )
    ),
    date
  `);

    if (planRecipeError) {
      console.log('Plan loading Error', planRecipeError);
      throw new Error('Failed to fetch data from the database.');
    }

    return {
      planRecipeData
    };
};

export const actions = {
  cocked: async ({request, locals}) => {
    const { supabase } = locals;
    const data = await request.formData();
    planId = data.get('planId');

    console.log(planId);
    if (planId) {
      const { data: deletePlan, error: deletePlanError } = await supabase
            .from('plan')
            .delete()
            .eq('id', planId);
  
          if (deletePlanError) {
            console.log('Error deleting data', deletePlanError);
            throw new Error('Failed to delete data from the database.');
          }
  
          console.log('Deleted items:', deletePlan);
    }
    
    }
}
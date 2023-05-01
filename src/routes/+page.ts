// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { supabase, session } = await parent();
  if (!session) {
    throw redirect(303, '/');
  }
  const { data: tableData } = await supabase.from('test').select('*');

  return {
    user: session.user,
    tableData
  };
};
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://aewctuwcankjssedlrfk.supabase.co';
const supabaseKey = 'sb_publishable_Nsh1rLINv4B88kxszU6Z-w_GWLfeI0n';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('projects').update({ project_name: 'HIDDEN' }).ilike('project_name', '%N14bn%').select();
  console.log('Update Data:', data);
  console.log('Update Error:', error);
}
run();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://yxxlplorjolymdjffrca.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxwbG9yam9seW1kamZmcmNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA0NjIzNSwiZXhwIjoyMDg5NjIyMjM1fQ.4V0qnBEwpT68ulPPFpn3JRUsSErTbuNHScWJG1MRMh4');

async function test() {
  const { data, error } = await supabase.from('products').select('category');
  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }
  const cats = [...new Set(data.map(d => d.category))];
  console.log('Categories in DB:', cats);
  process.exit(0);
}
test();

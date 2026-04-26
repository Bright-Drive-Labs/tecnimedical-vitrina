import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://yxxlplorjolymdjffrca.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxwbG9yam9seW1kamZmcmNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA0NjIzNSwiZXhwIjoyMDg5NjIyMjM1fQ.4V0qnBEwpT68ulPPFpn3JRUsSErTbuNHScWJG1MRMh4');

async function test() {
  const { data } = await supabase.from('products').select('*');
  let nullDrives = 0;
  let hasDrives = 0;
  data.forEach(p => {
    if (p.drive_id) hasDrives++; else nullDrives++;
  });
  console.log(`With Drive ID: ${hasDrives}`);
  console.log(`With NO Drive ID: ${nullDrives}`);
  process.exit(0);
}
test();

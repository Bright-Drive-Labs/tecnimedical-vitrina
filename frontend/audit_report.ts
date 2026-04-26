import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yxxlplorjolymdjffrca.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxwbG9yam9seW1kamZmcmNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA0NjIzNSwiZXhwIjoyMDg5NjIyMjM1fQ.4V0qnBEwpT68ulPPFpn3JRUsSErTbuNHScWJG1MRMh4'
);

async function audit() {
  const { data, error } = await supabase.from('products').select('name, category, image_name, drive_id');
  if (error) { console.error(error); process.exit(1); }

  const total = data.length;
  const withImage = data.filter(p => p.drive_id);
  const withoutImage = data.filter(p => !p.drive_id);

  // Por categoria
  const byCategory: Record<string, { withImg: number; withoutImg: string[] }> = {};
  data.forEach(p => {
    const cat = p.category || 'Sin Categoría';
    if (!byCategory[cat]) byCategory[cat] = { withImg: 0, withoutImg: [] };
    if (p.drive_id) {
      byCategory[cat].withImg++;
    } else {
      byCategory[cat].withoutImg.push(`${p.name} (archivo esperado: ${p.image_name || 'N/A'})`);
    }
  });

  console.log('\n========================================');
  console.log('   REPORTE DE AUDITORÍA - TECNIMEDICAL');
  console.log('========================================\n');
  console.log(`TOTAL PRODUCTOS EN BASE DE DATOS : ${total}`);
  console.log(`✅ CON IMAGEN (visibles en vitrina): ${withImage.length}`);
  console.log(`❌ SIN IMAGEN (ocultos en vitrina): ${withoutImage.length}`);
  console.log('\n--- DETALLE POR CATEGORÍA ---\n');

  Object.entries(byCategory).sort().forEach(([cat, info]) => {
    const total = info.withImg + info.withoutImg.length;
    console.log(`📁 ${cat.toUpperCase()} (${total} productos | ✅ ${info.withImg} con imagen | ❌ ${info.withoutImg.length} sin imagen)`);
    if (info.withoutImg.length > 0) {
      info.withoutImg.forEach(name => console.log(`   └─ ${name}`));
    }
    console.log('');
  });

  process.exit(0);
}

audit();

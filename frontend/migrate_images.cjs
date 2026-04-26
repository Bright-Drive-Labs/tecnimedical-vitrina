const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yxxlplorjolymdjffrca.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxwbG9yam9seW1kamZmcmNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA0NjIzNSwiZXhwIjoyMDg5NjIyMjM1fQ.4V0qnBEwpT68ulPPFpn3JRUsSErTbuNHScWJG1MRMh4';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function migrate() {
  console.log('🚀 Iniciando migración de Drive a Supabase Storage...');

  // 1. Obtener productos para migrar
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, drive_id, tenant_id')
    .not('drive_id', 'is', null)
    .is('image_url', null);

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`📦 Encontrados ${products.length} productos para migrar.`);

  for (const product of products) {
    try {
      console.log(`\n🔄 Procesando: ${product.name}...`);

      const driveUrl = `https://bright-drive-backend-agent-production.up.railway.app/api/image/${product.drive_id}`;
      
      // 2. Descargar imagen
      const res = await fetch(driveUrl);
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
      
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = res.headers.get('content-type') || 'image/png';
      
      const fileExt = contentType.split('/')[1] || 'png';
      const fileName = `${product.drive_id}.${fileExt}`;
      const filePath = `${product.tenant_id}/${fileName}`;

      // 3. Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, buffer, {
          contentType: contentType,
          upsert: true
        });

      if (uploadError) {
        console.error(`❌ Error uploading image for ${product.name}:`, uploadError);
        continue;
      }

      // 4. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 5. Actualizar DB
      const { error: updateError } = await supabase
        .from('products')
        .update({
          image_url: publicUrl,
          drive_id: null
        })
        .eq('id', product.id);

      if (updateError) {
        console.error(`❌ Error updating DB for ${product.name}:`, updateError);
      } else {
        console.log(`✅ Migrado con éxito: ${product.name}`);
      }

    } catch (err) {
      console.error(`💥 Error en ${product.name}:`, err.message);
    }
  }

  console.log('\n✨ Migración completada.');
}

migrate();

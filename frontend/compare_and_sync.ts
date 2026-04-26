import { createClient } from '@supabase/supabase-js';
import * as xlsx from 'xlsx';
import fs from 'fs';

const SUPABASE_URL = 'https://yxxlplorjolymdjffrca.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxwbG9yam9seW1kamZmcmNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA0NjIzNSwiZXhwIjoyMDg5NjIyMjM1fQ.4V0qnBEwpT68ulPPFpn3JRUsSErTbuNHScWJG1MRMh4';
const EXCEL_PATH = 'c:/Bright-Drive-Agent/Proyects/Tecnimedical/Catalogo tecnimedical.xlsx';
const TENANT_UUID = '63e2d67c-9b1a-4d3b-8f32-5a2e6f9c8d1b';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function createSlug(text: string, index: number) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-') + `-${index}`;
}

async function compareAndSync() {
  // 1. Leer Excel
  console.log('📊 Leyendo Excel...');
  const buf = fs.readFileSync(EXCEL_PATH);
  const workbook = xlsx.read(buf, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet) as any[];
  console.log(`   → ${rows.length} filas en Excel\n`);

  // 2. Leer BD
  console.log('🗄️  Leyendo Base de Datos...');
  const { data: dbProducts, error } = await supabase
    .from('products')
    .select('name, slug, category, image_name');
  if (error) { console.error('Error BD:', error); process.exit(1); }
  console.log(`   → ${dbProducts.length} productos en BD\n`);

  // Mapas para comparación: usamos slug como clave única
  const dbSlugs = new Set(dbProducts.map(p => p.slug));
  const dbNames = new Set(dbProducts.map(p => p.name.toLowerCase().trim()));

  // 3. Comparar
  const nuevos: any[] = [];
  const actualizados: any[] = [];

  rows.forEach((row, index) => {
    const nombre = (row['Nombre del Producto'] || `Producto ${index}`).trim();
    const slug = createSlug(nombre, index);
    const imagenArchivo = row['Archivo'] ? row['Archivo'].toString().trim() : '';

    // Es NUEVO si ni el slug ni el nombre exacto están en BD
    if (!dbSlugs.has(slug) && !dbNames.has(nombre.toLowerCase())) {
      nuevos.push({ row, index, nombre, slug, imagenArchivo });
    } else if (imagenArchivo && imagenArchivo !== 'NA' && imagenArchivo !== 'NA Yet') {
      // Es una actualización potencial si ahora tiene imagen pero antes no
      const dbMatch = dbProducts.find(p => p.slug === slug);
      if (dbMatch && !dbMatch.image_name && imagenArchivo) {
        actualizados.push({ row, index, nombre, slug, imagenArchivo });
      }
    }
  });

  // 4. Reporte
  console.log('='.repeat(50));
  console.log(`🆕 PRODUCTOS NUEVOS EN EL EXCEL: ${nuevos.length}`);
  console.log('='.repeat(50));
  if (nuevos.length === 0) {
    console.log('   ✅ No hay productos nuevos. La BD está al día.');
  } else {
    nuevos.forEach((p, i) => {
      console.log(`   ${i+1}. ${p.nombre}`);
      console.log(`      Categoría : ${p.row['Categoría'] || 'N/A'}`);
      console.log(`      Archivo   : ${p.imagenArchivo || 'Sin imagen'}`);
    });
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📝 PRODUCTOS CON IMAGEN NUEVA (actualizables): ${actualizados.length}`);
  console.log('='.repeat(50));
  if (actualizados.length > 0) {
    actualizados.forEach((p, i) => {
      console.log(`   ${i+1}. ${p.nombre} → ${p.imagenArchivo}`);
    });
  }

  // 5. Subir solo los nuevos si existen
  if (nuevos.length > 0) {
    console.log('\n📤 Insertando productos nuevos en Supabase...');
    const toInsert = nuevos.map(p => ({
      tenant_id: TENANT_UUID,
      name: p.nombre,
      category: p.row['Categoría'] || 'Sin Categoría',
      subcategory: p.row['Subcategoría'] || 'General',
      description: p.row['Descripción'] || '',
      image_name: p.imagenArchivo || null,
      drive_id: null,
      slug: p.slug,
      price: 0,
      stock_status: 'OUT_OF_STOCK'
    }));

    const { error: insertError } = await supabase
      .from('products')
      .insert(toInsert);

    if (insertError) {
      console.error('❌ Error insertando nuevos:', insertError.message);
    } else {
      console.log(`✅ ${nuevos.length} producto(s) nuevo(s) insertado(s) correctamente.`);
    }
  }

  process.exit(0);
}

compareAndSync();

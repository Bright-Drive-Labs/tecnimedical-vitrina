import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import * as xlsx from 'xlsx';
import fs from 'fs';

const SUPABASE_URL = 'https://yxxlplorjolymdjffrca.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxwbG9yam9seW1kamZmcmNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA0NjIzNSwiZXhwIjoyMDg5NjIyMjM1fQ.4V0qnBEwpT68ulPPFpn3JRUsSErTbuNHScWJG1MRMh4';
const TENANT_UUID = '63e2d67c-9b1a-4d3b-8f32-5a2e6f9c8d1b';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const FOLDERS = [
  '1gWT2aehbNFXcPWpoW5inipUUPp_cKGif', // movilidad
  '1PLev5o-M0QVl1QMxaB3qaBM56xr0yRA2',
  '1ptvyu7cVLxCTaZ6GJ5bCVYHr_5rB0E3_',
  '1_GBb7XwTXmelpPBOZ9dfZRwTqzLiNqWM',
  '159aQLMoBjZz3gavpZE9jUpIemklcM54o',
  '1On50xn71F_TMj1KspQgGmbc9hYT2veqQ',
  '1dgz8wObjlIn5M-FuzXTS7YdMwtH3uwqA',
  '1v_vS-e461x2vJ6_0WXYpEaK9K3H7vL2n' // posbile root
];

async function scanDrive(drive: any, folderId: string) {
  let files: any[] = [];
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
      pageSize: 1000
    });
    for (const file of res.data.files || []) {
      if (file.mimeType.includes('folder')) {
        files = files.concat(await scanDrive(drive, file.id));
      } else if (file.mimeType.includes('image')) {
        files.push(file);
      }
    }
  } catch(e) {}
  return files;
}

async function fix() {
  console.log('🔄 Extrayendo todas las imágenes de Drive...');
  const keyFile = 'c:/Bright-Drive-Agent/Proyects/Bright-Drive-Agent/drive-credentials.json';
  const auth = new google.auth.GoogleAuth({ keyFile, scopes: ['https://www.googleapis.com/auth/drive.readonly'] });
  const drive = google.drive({ version: 'v3', auth });

  let allImages: any[] = [];
  for (const f of FOLDERS) {
    const imgs = await scanDrive(drive, f);
    allImages = allImages.concat(imgs);
  }
  
  console.log(`✅ ${allImages.length} imágenes encontradas en total en subcarpetas.`);
  const driveMap = new Map();
  // Almacenar el nombre sin extensión por si acaso
  allImages.forEach(f => {
    driveMap.set(f.name.toLowerCase().trim(), f.id);
    const noExt = f.name.replace(/\.[^/.]+$/, "").toLowerCase().trim();
    driveMap.set(noExt, f.id);
  });

  console.log('📊 Actualizando Base de Datos...');
  const { data: products } = await supabase.from('products').select('id, name, image_name');
  
  let matches = 0;
  for (const p of products || []) {
      const imgName = p.image_name ? p.image_name.toString().toLowerCase().trim() : '';
      const noExtOrig = imgName.replace(/\.[^/.]+$/, "");
      
      let driveId = driveMap.get(imgName) || driveMap.get(noExtOrig);
      
      // Intentar forzar con extensión png o jpg si no se encontró
      if (!driveId && imgName) {
         driveId = driveMap.get(imgName + '.png') || driveMap.get(imgName + '.jpg');
      }

      if (driveId) {
         await supabase.from('products').update({ drive_id: driveId, stock_status: 'IN_STOCK' }).eq('id', p.id);
         matches++;
      }
  }

  console.log(`✨ Arreglo completado: ${matches} productos enlazados exitosamente a sus imágenes.`);
}

fix();

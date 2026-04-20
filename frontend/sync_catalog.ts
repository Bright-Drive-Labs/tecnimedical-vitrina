import { createClient } from '@supabase/supabase-js';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Configuración
const EXCEL_PATH = 'c:/Bright-Drive-Agent/Proyects/Tecnimedical/Catalogo tecnimedical.xlsx';
const DRIVE_FOLDER_ID = '1Bo8ClcENLsqNTqjY96P_sLABKenwLydq'; // Basado en tu .env.local
const BDA_ENV_PATH = 'c:/Bright-Drive-Agent/Proyects/Bright-Drive-Agent/.env';

// Cargar variables (Hardcoded para asegurar el éxito del despliegue)
const SUPABASE_URL = 'https://yxxlplorjolymdjffrca.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxwbG9yam9seW1kamZmcmNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA0NjIzNSwiZXhwIjoyMDg5NjIyMjM1fQ.4V0qnBEwpT68ulPPFpn3JRUsSErTbuNHScWJG1MRMh4';

console.log(`🔗 Conectando a Supabase...`);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function createSlug(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Reemplazar espacios con -
        .replace(/[^\w-]+/g, '')  // Eliminar caracteres no alfanuméricos
        .replace(/--+/g, '-');    // Reemplazar múltiples - con uno solo
}

const TENANT_UUID = '63e2d67c-9b1a-4d3b-8f32-5a2e6f9c8d1b';

async function sync() {
    try {
        console.log('🚀 Iniciando Sincronización Maestra (Normalizada)...');

        // 1. Obtener Imágenes de Google Drive
        console.log('📁 Escaneando Google Drive...');
        const keyFile = 'c:/Bright-Drive-Agent/Proyects/Bright-Drive-Agent/drive-credentials.json';
        const auth = new google.auth.GoogleAuth({
            keyFile,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });
        const drive = google.drive({ version: 'v3', auth });
        
        const driveRes = await drive.files.list({
            q: `'${DRIVE_FOLDER_ID}' in parents and trashed = false`,
            fields: 'files(id, name)',
            pageSize: 1000
        });
        const driveFiles = driveRes.data.files || [];
        console.log(`✅ ${driveFiles.length} imágenes encontradas en Drive.`);

        // Crear mapa de Nombre -> ID para búsqueda rápida
        const driveMap = new Map();
        driveFiles.forEach(f => driveMap.set(f.name.toLowerCase(), f.id));

        // 2. Leer Excel
        console.log('📊 Leyendo Excel local...');
        const buf = fs.readFileSync(EXCEL_PATH);
        const workbook = xlsx.read(buf, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet) as any[];
        console.log(`✅ ${rows.length} filas detectadas en el catálogo.`);

        // 3. Preparar datos para Supabase
        console.log('🔄 Mapeando y cruzando datos...');
        const productsToInsert = rows.map((row, index) => {
            const imageName = row['Archivo'] ? row['Archivo'].toString().trim() : '';
            const driveId = driveMap.get(imageName.toLowerCase()) || null;
            const productName = row['Nombre del Producto'] || `Producto ${index}`;

            return {
                tenant_id: TENANT_UUID,
                name: productName,
                category: row['Categoría'] || 'Sin Categoría',
                subcategory: row['Subcategoría'] || 'General',
                description: row['Descripción'] || '',
                image_name: imageName,
                drive_id: driveId,
                slug: `${createSlug(productName)}-${index}`, // Agregamos index para evitar duplicados exactos
                price: 0,
                stock_status: driveId ? 'IN_STOCK' : 'OUT_OF_STOCK'
            };
        });

        // 4. Subir a Supabase
        console.log('📤 Subiendo a la nube (Supabase)...');
        
        // Limpiar tabla antes si es necesario o manejar conflictos
        // Para este MVP haremos un upsert basado en el slug (o simplemente insert)
        const { error } = await supabase
            .from('products')
            .upsert(productsToInsert, { onConflict: 'slug' });

        if (error) throw error;

        console.log('✨ Sincronización completada con éxito.');
        console.log(`📈 Total productos en base de datos: ${productsToInsert.length}`);

    } catch (err) {
        console.error('❌ ERROR FATAL en la sincronización:', err);
    }
}

sync();

import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

function readExcel() {
    const filePath = path.join('c:/Bright-Drive-Agent/Proyects/Tecnimedical', 'Catalogo tecnimedical.xlsx');
    
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }

    try {
        console.log('Reading Excel file...');
        const buf = fs.readFileSync(filePath);
        const workbook = xlsx.read(buf, { type: 'buffer' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const json = xlsx.utils.sheet_to_json(worksheet);
        
        console.log(`\nTotal rows: ${json.length}`);
        
        if (json.length > 0) {
            console.log('\n--- HEADERS AND FIRST ROW ---');
            console.log(Object.keys(json[0]).join(' | '));
            console.log(json[0]);
            
            console.log('\n--- FIRST 5 ROWS ---');
            console.table(json.slice(0, 5));
        }

    } catch (err) {
        console.error('Error parsing Excel: ', err);
    }
}

readExcel();

import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import * as xlsx from 'xlsx';

async function getExcel() {
    const keyFile = path.join('c:/Bright-Drive-Agent/Proyects/Bright-Drive-Agent', 'drive-credentials.json');
    const auth = new google.auth.GoogleAuth({
        keyFile,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const fileId = '1Pc5zq9uQW1BoJmaLoNdHBLisM-QpEnHy';
    const drive = google.drive({ version: 'v3', auth });

    try {
        console.log('Downloading Excel file...');
        const response = await drive.files.get(
            { fileId: fileId, alt: 'media' },
            { responseType: 'arraybuffer' }
        );

        const dataBuffer = Buffer.from(response.data as ArrayBuffer);
        
        console.log('Parsing Excel file...');
        const workbook = xlsx.read(dataBuffer, { type: 'buffer' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const json = xlsx.utils.sheet_to_json(worksheet);
        console.log('First 10 rows:');
        console.table(json.slice(0, 10));

    } catch (err) {
        console.error('API Error: ', err);
    }
}

getExcel();

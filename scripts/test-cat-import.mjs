import XLSX from 'xlsx';
import fetch from 'node-fetch';
import fs from 'fs';

// Read and parse the Excel file
const wb = XLSX.readFile('C:\\\\SUNAPP2\\\\DATA\\\\CAT.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(ws);

console.log(`Total rows in Excel: ${jsonData.length}`);

// Transform to spare parts format
const partsList = jsonData.map((row) => ({
    manualId: row["Manual ID"] || null,
    partNumber: row["Part Number*"] || "",
    partName: row["Part Name*"] || "",
    category: row["Category*"] || "",
    description: row["Description"] || null,
    price: row["Price"] ? String(row["Price"]) : null,
    stockQuantity: row["Stock Quantity"] ? Number(row["Stock Quantity"]) : 0,
    locationInstructions: row["Location Instructions"] || null,
    stockStatus: "in_stock",
}));

// Filter out invalid parts (missing required fields)
const validParts = partsList.filter(part => part.partNumber && part.partName && part.category);

console.log(`Valid parts to import: ${validParts.length}`);

// Login first
console.log('\\nLogging in...');
const loginResponse = await fetch('http://192.168.0.3:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
});

if (!loginResponse.ok) {
    console.error('Login failed:', await loginResponse.text());
    process.exit(1);
}

const { token } = await loginResponse.json();
console.log('Login successful!');

// Import the parts
console.log(`\\nImporting ${validParts.length} parts...`);
const importResponse = await fetch('http://192.168.0.3:3000/api/parts/import', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ parts: validParts })
});

if (!importResponse.ok) {
    const errorText = await importResponse.text();
    console.error('Import failed:', errorText);
    process.exit(1);
}

const result = await importResponse.json();
console.log('\\nImport Results:');
console.log(`Created: ${result.results.created}`);
console.log(`Updated: ${result.results.updated}`);
console.log(`Skipped: ${result.results.skipped}`);

if (result.results.errors && result.results.errors.length > 0) {
    console.log(`\\nErrors (first 10):`);
    result.results.errors.slice(0, 10).forEach(err => {
        console.log(`  ${err.partNumber}: ${err.error}`);
    });
}

console.log('\\nDone!');

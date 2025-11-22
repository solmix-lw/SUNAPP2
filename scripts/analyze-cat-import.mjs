import XLSX from 'xlsx';
import fs from 'fs';

// Read the Excel file
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

console.log(`Transformed ${partsList.length} parts`);

// Check for validation issues
let validCount = 0;
let invalidCount = 0;
const invalidParts = [];

partsList.forEach((part, index) => {
    const missing = [];
    if (!part.partNumber) missing.push("partNumber");
    if (!part.partName) missing.push("partName");
    if (!part.category) missing.push("category");

    if (missing.length > 0) {
        invalidCount++;
        if (invalidParts.length < 10) {
            invalidParts.push({ index, part, missing });
        }
    } else {
        validCount++;
    }
});

console.log(`\\nValidation Results:`);
console.log(`Valid: ${validCount}`);
console.log(`Invalid: ${invalidCount}`);

if (invalidParts.length > 0) {
    console.log(`\\nFirst ${invalidParts.length} invalid parts:`);
    invalidParts.forEach(({ index, part, missing }) => {
        console.log(`Row ${index + 2}: Missing ${missing.join(', ')}`);
        console.log(`  Part Number: ${part.partNumber || 'MISSING'}`);
        console.log(`  Part Name: ${part.partName || 'MISSING'}`);
        console.log(`  Category: ${part.category || 'MISSING'}`);
    });
}

// Calculate JSON size
const jsonString = JSON.stringify({ parts: partsList });
const sizeInBytes = Buffer.byteLength(jsonString);
const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

console.log(`\\nPayload size: ${sizeInMB} MB`);
console.log(`Payload limit: 50 MB`);
console.log(`Within limit: ${sizeInBytes < 50 * 1024 * 1024 ? 'YES' : 'NO'}`);

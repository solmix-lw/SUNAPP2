import * as XLSX from "xlsx";

async function testSparePartsTemplate() {
    try {
        console.log("Testing Spare Parts Template Download...\n");

        // 1. Login as admin
        console.log("1. Logging in...");
        const loginRes = await fetch("http://localhost:5001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "RPAdmin",
                password: "RPAdmin"
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("✓ Logged in successfully.\n");

        // 2. Download template
        console.log("2. Downloading spare parts template...");
        const templateRes = await fetch("http://localhost:5001/api/parts/template", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!templateRes.ok) {
            throw new Error(`Template download failed: ${templateRes.status} ${templateRes.statusText}`);
        }

        const buffer = await templateRes.arrayBuffer();
        console.log(`✓ Template downloaded (${buffer.byteLength} bytes)\n`);

        // 3. Parse and verify template
        console.log("3. Parsing template...");
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log(`✓ Sheet name: ${sheetName}`);
        console.log(`✓ Total rows: ${data.length}\n`);

        // 4. Check headers
        console.log("4. Verifying headers...");
        const headers = data[0] as string[];
        console.log("Headers found:");
        headers.forEach((header, index) => {
            console.log(`   ${index + 1}. ${header}`);
        });

        // 5. Check for Manual ID column
        console.log("\n5. Checking for 'Manual ID' column...");
        const hasManualId = headers.includes("Manual ID");
        if (hasManualId) {
            const manualIdIndex = headers.indexOf("Manual ID");
            console.log(`✓ 'Manual ID' column FOUND at position ${manualIdIndex + 1}`);
        } else {
            console.log("✗ 'Manual ID' column NOT FOUND");
        }

        // 6. Check sample data
        console.log("\n6. Checking sample data...");
        if (data.length > 1) {
            console.log(`Sample row 1: ${JSON.stringify(data[1])}`);
            if (data.length > 2) {
                console.log(`Sample row 2: ${JSON.stringify(data[2])}`);
            }
        }

        // 7. Summary
        console.log("\n" + "=".repeat(50));
        console.log("SUMMARY");
        console.log("=".repeat(50));
        console.log(`Template has ${headers.length} columns`);
        console.log(`Manual ID column: ${hasManualId ? "✓ PRESENT" : "✗ MISSING"}`);
        console.log("=".repeat(50));

        if (!hasManualId) {
            console.error("\n⚠ WARNING: Manual ID column is missing from the template!");
            process.exit(1);
        } else {
            console.log("\n✓ SUCCESS: Template is correctly configured!");
        }

    } catch (error: any) {
        console.error("\n✗ Test failed with error:", error.message);
        process.exit(1);
    }
}

testSparePartsTemplate();


import * as XLSX from "xlsx";

async function runTest() {
    try {
        console.log("Starting bulk import test...");

        // 1. Login as admin
        console.log("Logging in...");
        const loginRes = await fetch("http://localhost:3000/api/auth/login", {
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
        console.log("Logged in successfully.");

        // 2. Create a mock Excel file with 100 rows
        const data = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                "Equipment Type*": "DOZER",
                "Make*": "TEST-MAKE-BULK",
                "Model*": "TEST-MODEL-BULK",
                "Plate No": `BULK-PLATE-${i}`,
                "Asset No": `BULK-ASSET-${i}`,
                "Remarks": `Bulk Row ${i}`
            });
        }

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment");
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        // 3. Upload the file
        const formData = new FormData();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        formData.append("file", blob, "bulk-import.xlsx");

        console.log("Uploading file (100 rows)...");
        const startTime = Date.now();
        const uploadRes = await fetch("http://localhost:3000/api/equipment/import", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });
        const endTime = Date.now();

        console.log(`Upload took ${endTime - startTime}ms`);
        console.log("Upload response status:", uploadRes.status);
        const result = await uploadRes.json();
        console.log("Upload response data:", JSON.stringify(result, null, 2));

        // 4. Verify results
        if (uploadRes.ok) {
            if (result.results.created === 100 || result.results.updated === 100 || (result.results.created + result.results.updated === 100)) {
                console.log("SUCCESS: Bulk import worked as expected.");
            } else {
                console.error("FAILURE: Unexpected result counts.");
            }
        } else {
            console.error("FAILURE: Request failed.");
        }

    } catch (error: any) {
        console.error("Test failed with error:", error);
    }
}

runTest();

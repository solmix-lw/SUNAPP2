
import * as XLSX from "xlsx";


// Native fetch is available in Node 18+
// We need to construct the multipart body manually or use a compatible FormData
// In Node 20, FormData is available globally.
// Login credentials are RPAdmin/RPAdmin
async function runTest() {
    try {
        console.log("Starting partial import test...");

        // 1. Login as admin
        // 1. Login as admin
        console.log("Logging in...");
        const loginRes = await fetch("http://192.168.0.34:5001/api/auth/login", {
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

        // 2. Create a mock Excel file
        const workbook = XLSX.utils.book_new();
        const data = [
            {
                "Equipment Type*": "DOZER",
                "Make*": "TEST-MAKE-VALID",
                "Model*": "TEST-MODEL-VALID",
                "Plate No": "TEST-PLATE-001",
                "Asset No": "TEST-ASSET-001",
                "Remarks": "Valid Row"
            },
            {
                // "Equipment Type*" i need all the field for this is Equipment Type*
                // Make*
                // Model*
                // Plate No
                // Asset No	
                // New Asset No
                // Machine Serial
                // ENGINE NUMBER
                // Project Area
                // Driver
                // PRICE
                // Remarks

                "Make*": "TEST-MAKE-INVALID",
                "Model*": "TEST-MODEL-INVALID",
                "Remarks": "Invalid Row"
            }
        ];
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment");

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        // 3. Upload the file using FormData
        const formData = new FormData();
        // We need to pass a Blob-like object. In Node, we can use the Blob class.
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        formData.append("file", blob, "test-import.xlsx");

        console.log("Uploading file...");
        const uploadRes = await fetch("http://192.168.0.34:5001/api/equipment/import", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
                // Content-Type header is set automatically by fetch when body is FormData
            },
            body: formData
        });

        console.log("Upload response status:", uploadRes.status);
        const result = await uploadRes.json();
        console.log("Upload response data:", JSON.stringify(result, null, 2));

        // 4. Verify results
        if (uploadRes.ok) {
            if (result.results.created === 1 && result.summary.invalid === 1) {
                console.log("SUCCESS: Partial import worked as expected.");
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

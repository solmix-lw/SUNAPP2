
async function runTest() {
    try {
        console.log("Starting JSON import test...");

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

        // 2. Prepare JSON payload
        const payload = {
            equipment: [
                {
                    equipmentType: "DOZER",
                    make: "TEST-MAKE-JSON",
                    model: "TEST-MODEL-JSON",
                    plateNo: "JSON-PLATE-001",
                    assetNo: "JSON-ASSET-001",
                    remarks: "JSON Import Row"
                }
            ]
        };

        // 3. Send JSON request
        console.log("Sending JSON import request...");
        const startTime = Date.now();
        const uploadRes = await fetch("http://localhost:3000/api/equipment/import", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const endTime = Date.now();

        console.log(`Request took ${endTime - startTime}ms`);
        console.log("Response status:", uploadRes.status);
        const result = await uploadRes.json();
        console.log("Response data:", JSON.stringify(result, null, 2));

        // 4. Verify results
        if (uploadRes.ok) {
            if (result.results.created === 1 || result.results.updated === 1) {
                console.log("SUCCESS: JSON import worked as expected.");
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

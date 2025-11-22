
async function testEndpoint() {
    try {
        const response = await fetch("http://localhost:5000/api/work-orders");
        console.log("Status:", response.status);
        if (response.ok) {
            const data = await response.json();
            console.log("Data length:", Array.isArray(data) ? data.length : "Not an array");
        } else {
            console.log("Response text:", await response.text());
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testEndpoint();

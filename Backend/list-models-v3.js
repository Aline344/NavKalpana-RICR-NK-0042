import { GoogleGenerativeAI } from "@google/generative-ai";

const testKey = "AIzaSyAzm2-957jvjnpnogGs1_cZthixussWLsU";
const genAI = new GoogleGenerativeAI(testKey);

const main = async () => {
    try {
        console.log("Listing all available models for this key...");
        // This is a newer method in the SDK
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy to get the object
        // Actually, the SDK might have a different way. 
        // Let's try to fetch from the URL directly to be safe.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${testKey}`);
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Critical Error:", error);
    }
};

main();

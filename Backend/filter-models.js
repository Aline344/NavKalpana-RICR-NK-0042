import { GoogleGenerativeAI } from "@google/generative-ai";

const testKey = "AIzaSyAzm2-957jvjnpnogGs1_cZthixussWLsU";

const main = async () => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${testKey}`);
        const data = await response.json();
        if (data.models) {
            const genModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
            console.log("Candidate models for generateContent:");
            genModels.forEach(m => console.log(` - ${m.name} (${m.displayName})`));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Critical Error:", error);
    }
};

main();

import { GoogleGenerativeAI } from "@google/generative-ai";

const testKey = "AIzaSyAzm2-957jvjnpnogGs1_cZthixussWLsU";
const genAI = new GoogleGenerativeAI(testKey);

const main = async () => {
    try {
        console.log("Fetching model list...");
        // Use the native fetch or the SDK's listModels if it exists
        // Actually, the easiest way to find out what's available is to try a few common ones
        const models = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hi");
                console.log(`Model ${m}: SUCCESS`);
            } catch (e) {
                console.log(`Model ${m}: FAILED - ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Critical Error:", error);
    }
};

main();

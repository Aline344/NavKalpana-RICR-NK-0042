import { GoogleGenerativeAI } from "@google/generative-ai";

const testKey = "AIzaSyAzm2-957jvjnpnogGs1_cZthixussWLsU";
const genAI = new GoogleGenerativeAI(testKey);

const test = async () => {
    try {
        console.log(`Testing Gemini 2.5 Flash with key: ${testKey}`);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hello?");
        const response = await result.response;
        console.log('SUCCESS:', response.text());
    } catch (error) {
        console.error('FAILURE:', error.message);
    }
};

test();

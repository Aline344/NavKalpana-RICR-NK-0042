import { generateAIContent } from './config/gemini.js';

const test = async () => {
    try {
        console.log(`Testing Gemini with multiple variations...`);
        // We'll modify gemini.js to include these in the next tool call if this script is just for testing.
        // Actually, let's just run a custom test block here.
    } catch (error) {
        console.error('Test Error:', error.message);
    }
};

// Direct test without config dependency to be sure
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const runTest = async () => {
    const models = ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-pro", "gemini-1.0-pro"];
    for (const m of models) {
        try {
            console.log(`Trying ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("test");
            console.log(`SUCCESS with ${m}:`, (await result.response).text().substring(0, 50));
            process.exit(0);
        } catch (e) {
            console.log(`FAILED ${m}:`, e.message);
        }
    }
};

runTest();

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const testModels = async () => {
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-pro",
        "gemini-1.0-pro",
        "models/gemini-1.5-flash",
        "models/gemini-pro"
    ];

    let results = [];
    for (const m of models) {
        try {
            console.log(`Testing ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("test");
            const text = (await result.response).text();
            results.push(`${m}: SUCCESS`);
            console.log(`${m} worked!`);
        } catch (e) {
            results.push(`${m}: FAILED (${e.message})`);
            console.log(`${m} failed.`);
        }
    }
    fs.writeFileSync('model_discovery_results.txt', results.join('\n'));
};

testModels();

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const listModels = async () => {
    try {
        console.log('Listing models with prefixes...');
        const models = [
            'gemini-1.5-flash',
            'models/gemini-1.5-flash',
            'gemini-pro',
            'models/gemini-pro',
            'gemini-1.0-pro',
            'models/gemini-1.0-pro'
        ];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                console.log(`Model ${m} is available!`);
                return;
            } catch (e) {
                console.log(`Model ${m} failed: ${e.message}`);
            }
        }
    } catch (error) {
        console.error('List Error:', error);
    }
};

listModels();

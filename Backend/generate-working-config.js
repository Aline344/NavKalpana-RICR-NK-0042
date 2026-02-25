import https from 'https';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

const autoDiscover = async () => {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    https.get(listUrl, (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', async () => {
            try {
                const json = JSON.parse(data);
                const models = json.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));

                for (const m of models) {
                    try {
                        const model = genAI.getGenerativeModel({ model: m.name });
                        const result = await model.generateContent("test");
                        await result.response;

                        // Success! Let's write the config
                        const configCode = `import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIContent = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "${m.name}" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini AI Error:', error.message);
        throw error;
    }
};`;
                        fs.writeFileSync('config/gemini.js', configCode);
                        console.log(`Successfully wrote config with model ${m.name}`);
                        return;
                    } catch (e) {
                        // skip
                    }
                }
            } catch (e) {
                console.error(e);
            }
        });
    });
};

autoDiscover();

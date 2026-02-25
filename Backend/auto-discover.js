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
                console.log(`Found ${models.length} generative models.`);

                let successModel = null;
                for (const m of models) {
                    try {
                        console.log(`Testing ${m.name}...`);
                        const model = genAI.getGenerativeModel({ model: m.name });
                        const result = await model.generateContent("test");
                        await result.response;
                        console.log(`SUCCESS: ${m.name}`);
                        successModel = m.name;
                        break;
                    } catch (e) {
                        console.log(`FAILED: ${m.name} (${e.message})`);
                    }
                }

                if (successModel) {
                    fs.writeFileSync('working_model.txt', successModel);
                } else {
                    fs.writeFileSync('working_model.txt', 'NONE FOUND');
                }
            } catch (e) {
                console.error('Json Error:', e.message);
            }
        });
    });
};

autoDiscover();

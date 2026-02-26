import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('Backend/.env') });
import { generateAIContent } from './config/gemini.js';

const test = async () => {
    try {
        console.log(`Testing Gemini via generateAIContent...`);
        const text = await generateAIContent("Hello, are you there?");
        console.log('Response:', text);
    } catch (error) {
        console.error('Test Error:', error.message);
    }
};

test();

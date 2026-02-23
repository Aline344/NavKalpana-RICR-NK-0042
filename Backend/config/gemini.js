import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const model = "gemini-3-flash-preview";

export const generateAIContent = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        return typeof response.text === 'function' ? response.text() : response.text;
    } catch (error) {
        console.error('Gemini AI Error:', error);
        throw error;
    }
};

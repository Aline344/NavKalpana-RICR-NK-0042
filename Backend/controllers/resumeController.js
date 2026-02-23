import pdf from 'pdf-parse';
import User from '../models/User.js';
import { generateAIContent } from '../config/gemini.js';

// Analyze resume text and compute strength score using Gemini AI
export const analyzeResume = async (req, res) => {
    try {
        let resumeText = req.body.resumeText;
        const targetRole = req.body.targetRole || 'Full Stack Developer';

        // If a file is uploaded, extract text from it
        if (req.file) {
            const dataBuffer = req.file.buffer;
            const pdfData = await pdf(dataBuffer);
            resumeText = pdfData.text;
        }

        if (!resumeText) {
            return res.status(400).json({ message: 'Resume text or file is required' });
        }

        const prompt = `Analyze this resume for the target role: "${targetRole}".
        Resume Text:
        ${resumeText}

        CRITICAL: You must calculate the Resume Strength Score (0-100) strictly using this formula:
        Resume Strength = (Skill Relevance × 0.40) + (Project Depth × 0.30) + (Experience Indicators × 0.20) + (Structure Score × 0.10)

        Return ONLY a JSON object with this format:
        {
          "strengthScore": total_calculated_score,
          "breakdown": {
            "skillRelevance": 0-100,
            "projectDepth": 0-100,
            "experienceScore": 0-100,
            "structureScore": 0-100
          },
          "foundSkills": ["skill1", "skill2"],
          "missingSkills": ["missing1", "missing2"],
          "projects": ["Extracted project 1 summary", "Extracted project 2 summary"],
          "experience": ["Extracted role 1", "Extracted role 2"],
          "recommendations": ["Recommendation 1", "Recommendation 2"]
        }`;

        const aiResponse = await generateAIContent(prompt);
        const jsonStr = aiResponse.replace(/```json|```/g, '').trim();
        const analysis = JSON.parse(jsonStr);

        // Update user's resume data in database for real-time sync with Dashboard
        const user = await User.findById(req.user._id);
        if (user) {
            user.resumeData = {
                strengthScore: analysis.strengthScore,
                skills: analysis.foundSkills,
                missingSkills: analysis.missingSkills,
                projects: analysis.projects,
                experience: analysis.experience,
                recommendations: analysis.recommendations
            };
            await user.save();
        }

        res.json(analysis);
    } catch (error) {
        console.error('Resume Analysis Error:', error);
        res.status(500).json({ message: 'Failed to analyze resume using AI. Please try again.' });
    }
};

export const getResumeAnalysis = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('resumeData');
        res.json(user?.resumeData || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

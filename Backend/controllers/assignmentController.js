import Assignment from '../models/Assignment.js';
import User from '../models/User.js';
import { generateAIContent } from '../config/gemini.js';
import { executeCode } from '../utils/codeExecutor.js';

export const generateAssignment = async (req, res) => {
    try {
        const { topic, difficultyLevel } = req.body;
        const user = await User.findById(req.user._id);
        const targetRole = user?.targetRole || 'Software Engineer';
        const finalDifficulty = difficultyLevel || user?.preferredDifficulty || 2;

        const prompt = `Generate a LeetCode-style coding algorithmic challenge for a ${targetRole} focusing on ${topic || 'Data Structures'}. 
        
        Difficulty Level: ${finalDifficulty}/5

        IMPORTANT RULES FOR THE RESPONSE:
        1. The problem should be solvable in a single file without external libraries.
        2. Create 3 to 5 test cases. The first 2 should be 'isHidden: false', the rest 'isHidden: true'.
        3. Inputs in test cases MUST be valid JSON strings so they can be parsed by code, or simple strings if it's a single argument.
        4. Provide 'startingCode' for JavaScript, Python, C++, and Java.
        
        Return ONLY a JSON object in exactly this format:
        {
          "title": "Problem Title",
          "problemStatement": "# Problem Name\\n\\nDetailed markdown description of the problem with constraints and examples.",
          "startingCode": {
             "javascript": "function solve(input) {\\n  // your code here\\n}",
             "python": "def solve(input):\\n    # your code here\\n    pass",
             "cpp": "#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n  // handle std input\\n}",
             "java": "import java.util.*;\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        // handle scanner input\\n    }\\n}"
          },
          "testCases": [
             { "input": "[2, 7, 11, 15], 9", "expectedOutput": "[0, 1]", "isHidden": false }
          ],
          "solution": "Markdown string explaining the optimal approach (Time/Space complexity)."
        }`;

        const aiResponse = await generateAIContent(prompt);
        console.log('AI Assignment Response generated.');

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI failed to return a valid JSON object');
        }
        const template = JSON.parse(jsonMatch[0]);

        const assignment = await Assignment.create({
            userId: req.user._id,
            title: template.title,
            topic: topic || 'Algorithms',
            type: 'coding',
            problemStatement: template.problemStatement,
            startingCode: template.startingCode,
            testCases: template.testCases,
            solution: template.solution,
            difficulty: finalDifficulty,
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        res.status(201).json(assignment);
    } catch (error) {
        console.error('Assignment Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate assignment using AI. Please try again.', error: error.message });
    }
};

export const runCode = async (req, res) => {
    try {
        const { assignmentId, language, code } = req.body;
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        // For "Run", only execute against visible test cases
        const visibleTestCases = assignment.testCases.filter(tc => !tc.isHidden);

        if (visibleTestCases.length === 0) {
            visibleTestCases.push(assignment.testCases[0]); // fallback if none are visible
        }

        const executionResults = await executeCode(language, code, visibleTestCases);
        res.json(executionResults);
    } catch (error) {
        console.error('Run Code Error:', error);
        res.status(500).json({ message: error.message || 'Failed to execute code' });
    }
};

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, language, code } = req.body;
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        // Execute against ALL test cases
        const executionResults = await executeCode(language, code, assignment.testCases);

        // Calculate score
        const score = Math.round((executionResults.passedCases / executionResults.totalCases) * 100);

        assignment.submission = {
            language,
            code,
            submittedAt: new Date(),
            passedCases: executionResults.passedCases,
            totalCases: executionResults.totalCases,
            executionTimeMs: executionResults.totalTimeMs
        };

        assignment.evaluation = {
            score,
            logicalCorrectness: score, // simplified for real code exe
            efficiency: executionResults.totalTimeMs < 1000 ? 100 : (executionResults.totalTimeMs < 3000 ? 70 : 40),
            mistakeBreakdown: executionResults.results.filter(r => !r.passed).map(r => ({
                area: 'Test Case Failure',
                description: `Failed on input: ${r.input}. Expected: ${r.expectedOutput}, Got: ${r.actualOutput}`
            })),
            improvements: score < 100 ? ['Review failed test cases and edge cases.', 'Read the optimal solution tab for better time complexity.'] : [],
            evaluatedAt: new Date()
        };

        assignment.status = 'evaluated';
        await assignment.save();

        // Update User Mastery (simplified for Code runner)
        const user = await User.findById(req.user._id);
        if (user) {
            let mastery = user.topicMastery.find(t => t.topic === assignment.topic);
            if (!mastery) {
                user.topicMastery.push({ topic: assignment.topic, score: 0, quizAvg: 0, assignmentAvg: 0, consistency: 0, attempts: 0 });
                mastery = user.topicMastery[user.topicMastery.length - 1];
            }
            mastery.assignmentAvg = Math.round(((mastery.assignmentAvg * mastery.attempts) + score) / (mastery.attempts + 1));
            mastery.attempts++;
            mastery.score = Math.round((mastery.quizAvg * 0.50) + (mastery.assignmentAvg * 0.30) + (mastery.consistency * 0.20));
            mastery.lastAttempted = new Date();

            if (mastery.score >= 75) mastery.riskLevel = 'low';
            else if (mastery.score >= 50) mastery.riskLevel = 'moderate';
            else mastery.riskLevel = 'high';

            mastery.consistency = Math.min(100, mastery.consistency + 15);
            await user.save();
        }

        res.json({ assignment, executionResults });
    } catch (error) {
        console.error('Submit Code Error:', error);
        res.status(500).json({ message: error.message || 'Failed to submit assignment' });
    }
};

export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

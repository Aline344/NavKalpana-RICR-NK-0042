import Assignment from '../models/Assignment.js';
import User from '../models/User.js';

// Assignment templates by topic
const assignmentTemplates = {
    'JavaScript': [
        { title: 'Build a Task Manager App', type: 'coding', description: 'Create a fully functional task manager using vanilla JavaScript with CRUD operations, local storage persistence, and drag-and-drop reordering.', requirements: ['Implement add, edit, delete, and mark-complete functionality', 'Use localStorage for persistence', 'Add drag-and-drop reordering', 'Implement task categories and filters', 'Add due dates and priority levels'] },
        { title: 'Implement a Promise-based HTTP Client', type: 'coding', description: 'Build a lightweight HTTP client library that supports GET, POST, PUT, DELETE requests with Promise-based API, interceptors, and timeout handling.', requirements: ['Support all major HTTP methods', 'Implement request/response interceptors', 'Add timeout and retry logic', 'Include error handling with custom error types', 'Write unit tests for all methods'] },
        { title: 'Debug the E-commerce Cart', type: 'debugging', description: 'An e-commerce shopping cart has several bugs: items duplicate when added, total calculation is wrong, and removing items causes a crash. Fix all bugs and explain each fix.', requirements: ['Identify and fix the duplication bug', 'Correct the total price calculation', 'Fix the remove item crash', 'Add proper error boundaries', 'Document each bug and its root cause'] },
    ],
    'React': [
        { title: 'Build a Dynamic Form with Validation', type: 'coding', description: 'Create a multi-step registration form using React Hooks with real-time validation, progress indicator, and state management.', requirements: ['Use useState and useReducer for state management', 'Implement multi-step form navigation', 'Add real-time field validation with error messages', 'Show a progress bar indicating completion', 'Handle form submission with loading states'] },
        { title: 'Dashboard with Real-time Data', type: 'mini-project', description: 'Build a responsive analytics dashboard that fetches and displays real-time data with charts, filters, and export functionality.', requirements: ['Create reusable chart components', 'Implement data filtering and sorting', 'Add responsive grid layout', 'Include data export to CSV', 'Use React Context for global state'] },
        { title: 'Analyze React Performance', type: 'case-study', description: 'Given a React application with severe performance issues (unnecessary re-renders, memory leaks, large bundle size), analyze the codebase and propose optimizations.', requirements: ['Identify unnecessary re-renders', 'Find and fix memory leaks', 'Propose code-splitting strategies', 'Recommend memoization opportunities', 'Provide performance benchmark comparisons'] },
    ],
    'Node.js': [
        { title: 'Build a RESTful API with Authentication', type: 'coding', description: 'Create a complete REST API for a blog platform with JWT authentication, role-based access, CRUD operations, and input validation.', requirements: ['Implement JWT auth with refresh tokens', 'Add role-based access control', 'Create CRUD endpoints for posts and comments', 'Add input validation and sanitization', 'Implement pagination and search'] },
        { title: 'Design a Microservices Architecture', type: 'system-design', description: 'Design a microservices architecture for an e-learning platform. Include service decomposition, API gateway, message queues, and database per service pattern.', requirements: ['Decompose into logical services', 'Design API gateway routing', 'Plan inter-service communication', 'Design database strategy', 'Address fault tolerance and scaling'] },
        { title: 'Optimize Database Queries', type: 'analytical', description: 'Analyze a set of MongoDB queries that are causing severe performance issues on a database with 10M+ documents. Propose and implement optimizations.', requirements: ['Profile existing query performance', 'Design appropriate indexes', 'Rewrite inefficient aggregation pipelines', 'Implement caching strategy', 'Measure and document performance improvement'] },
    ],
    'Data Structures': [
        { title: 'Implement Core Data Structures', type: 'coding', description: 'Implement a linked list, binary search tree, and hash table from scratch in JavaScript with full method support and time complexity documentation.', requirements: ['Implement singly linked list with all operations', 'Build a BST with insert, delete, search, and traversals', 'Create a hash table with collision handling', 'Document time complexity for each operation', 'Write test cases for edge cases'] },
        { title: 'Solve the LRU Cache Problem', type: 'coding', description: 'Design and implement an LRU (Least Recently Used) cache with O(1) time complexity for both get and put operations.', requirements: ['Implement get() in O(1)', 'Implement put() in O(1)', 'Handle capacity constraints', 'Use a combination of HashMap and Doubly Linked List', 'Include comprehensive test cases'] },
    ],
    'Python': [
        { title: 'Build a Data Analysis Pipeline', type: 'mini-project', description: 'Create a data analysis pipeline that reads CSV data, cleans it, performs statistical analysis, and generates a visual report.', requirements: ['Read and parse CSV files', 'Implement data cleaning functions', 'Perform statistical computations', 'Generate visualizations', 'Export analysis report'] },
        { title: 'Web Scraper with Error Handling', type: 'coding', description: 'Build a robust web scraper that handles pagination, rate limiting, retries, and exports data to JSON/CSV formats.', requirements: ['Implement pagination handling', 'Add rate limiting and polite scraping', 'Include retry logic with exponential backoff', 'Export to both JSON and CSV', 'Add logging and error reporting'] },
    ],
    'SQL': [
        { title: 'Design a Relational Database Schema', type: 'system-design', description: 'Design a complete relational schema for a university management system with proper normalization, constraints, and optimized join queries.', requirements: ['Design normalized tables (3NF)', 'Define proper primary and foreign keys', 'Write optimized JOIN queries for common operations', 'Implement views for reporting', 'Add appropriate indexes for performance'] },
        { title: 'Query Optimization Challenge', type: 'analytical', description: 'Given a set of slow SQL queries and table schemas, optimize each query for better performance and explain your optimizations.', requirements: ['Analyze query execution plans', 'Rewrite queries for better performance', 'Recommend index additions', 'Explain each optimization decision', 'Provide before/after performance comparisons'] },
    ]
};

import { generateAIContent } from '../config/gemini.js';

export const generateAssignment = async (req, res) => {
    try {
        const { topic, type } = req.body;
        const user = await User.findById(req.user._id);
        const targetRole = user.targetRole || 'Full Stack Developer';

        // Adaptive grounding
        const weakTopics = (user.topicMastery || []).filter(t => t.score < 60).map(t => t.topic);
        const resumeGaps = user.resumeData?.missingSkills || [];
        const finalDifficulty = user.preferredDifficulty || 3;

        const prompt = `Generate a high-level ${type || 'coding'} assignment for a ${targetRole} focusing on ${topic || 'JavaScript'}.
        
        ADAPTIVE CONTEXT:
        - Target Role: ${targetRole}
        - Difficulty Level: ${finalDifficulty}/5
        - User's Weak Topics: ${weakTopics.join(', ')}
        - Gaps in Resume: ${resumeGaps.join(', ')}
        
        The assignment should be challenging and directly address the user's missing skills or weak areas if applicable to the topic.
        
        Return ONLY a JSON object in this format:
        {
          "title": "Assignment Title",
          "description": "Detailed description of the task",
          "requirements": ["Requirement 1", "Requirement 2", "Requirement 3", "Requirement 4", "Requirement 5"],
          "difficulty": 1-5
        }`;

        const aiResponse = await generateAIContent(prompt);
        console.log('AI Assignment Response:', aiResponse);
        // Clean JSON response (handle potential markdown blocks)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI failed to return a valid JSON object');
        }
        const template = JSON.parse(jsonMatch[0]);

        const assignment = await Assignment.create({
            userId: req.user._id,
            title: template.title,
            topic: topic || 'General',
            type: type || 'coding',
            description: template.description,
            requirements: template.requirements,
            difficulty: template.difficulty || 3,
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        res.status(201).json(assignment);
    } catch (error) {
        console.error('Assignment Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate assignment using AI. Please try again.' });
    }
};

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, submissionType, content, fileUrl } = req.body;
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        assignment.submission = {
            type: submissionType || 'text',
            content: content || '',
            fileUrl: fileUrl || '',
            submittedAt: new Date()
        };
        assignment.status = 'submitted';
        await assignment.save();

        // Auto-evaluate
        const evaluation = evaluateAssignment(assignment, content);
        assignment.evaluation = { ...evaluation, evaluatedAt: new Date() };
        assignment.status = 'evaluated';
        await assignment.save();

        // Update user mastery
        const user = await User.findById(req.user._id);
        if (user) {
            let mastery = user.topicMastery.find(t => t.topic === assignment.topic);
            if (!mastery) {
                user.topicMastery.push({ topic: assignment.topic, score: 0, quizAvg: 0, assignmentAvg: 0, consistency: 0, attempts: 0 });
                mastery = user.topicMastery[user.topicMastery.length - 1];
            }
            mastery.assignmentAvg = Math.round(((mastery.assignmentAvg * mastery.attempts) + evaluation.score) / (mastery.attempts + 1));
            mastery.attempts++;
            mastery.score = Math.round((mastery.quizAvg * 0.50) + (mastery.assignmentAvg * 0.30) + (mastery.consistency * 0.20));
            mastery.lastAttempted = new Date();
            if (mastery.score >= 75) mastery.riskLevel = 'low';
            else if (mastery.score >= 50) mastery.riskLevel = 'moderate';
            else mastery.riskLevel = 'high';
            mastery.consistency = Math.min(100, mastery.consistency + 15);

            // Adaptive Difficulty Scaling (Requirement 6.6)
            const recentAssignments = await Assignment.find({ userId: user._id, status: 'evaluated' })
                .sort({ 'evaluation.evaluatedAt': -1 })
                .limit(3);

            if (recentAssignments.length === 3) {
                const avgRecentScore = recentAssignments.reduce((acc, a) => acc + (a.evaluation?.score || 0), 0) / 3;
                if (avgRecentScore > 75 && user.preferredDifficulty < 5) {
                    user.preferredDifficulty += 1;
                } else if (avgRecentScore < 50 && user.preferredDifficulty > 1) {
                    user.preferredDifficulty -= 1;
                }
            }

            // Update Study Plan
            const existingTask = user.studyPlan.find(s => s.topic === assignment.topic);
            if (evaluation.score < 60) {
                if (existingTask) {
                    existingTask.priority = 'high';
                    existingTask.completed = false;
                } else {
                    user.studyPlan.push({ topic: assignment.topic, priority: 'high', scheduledDate: new Date(Date.now() + 86400000) });
                }
            } else if (existingTask && evaluation.score >= 80) {
                existingTask.completed = true;
            }

            await user.save();
        }

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function evaluateAssignment(assignment, content) {
    const text = (content || '').toLowerCase();
    const reqCount = assignment.requirements.length;

    // Check requirement coverage
    const covered = assignment.requirements.map(req => {
        const keywords = req.toLowerCase().split(' ').filter(w => w.length > 3);
        const matched = keywords.filter(k => text.includes(k));
        return { concept: req, covered: matched.length / keywords.length > 0.3 };
    });

    const coveredCount = covered.filter(c => c.covered).length;
    const completeness = Math.round((coveredCount / reqCount) * 100);

    // Score components
    const logicalCorrectness = Math.min(100, text.length > 100 ? 70 + Math.random() * 20 : 30 + Math.random() * 30);
    const conceptApplication = Math.round((coveredCount / reqCount) * 100);
    const codeStructure = text.includes('function') || text.includes('class') || text.includes('const') ? 75 + Math.random() * 15 : 40 + Math.random() * 20;
    const efficiency = text.length > 200 ? 65 + Math.random() * 25 : 40 + Math.random() * 20;

    const score = Math.round(
        (logicalCorrectness * 0.30) + (conceptApplication * 0.25) + (codeStructure * 0.20) + (completeness * 0.15) + (efficiency * 0.10)
    );

    const improvements = [];
    if (completeness < 60) improvements.push('Cover more of the required functionality');
    if (logicalCorrectness < 60) improvements.push('Improve the logical flow and correctness of your solution');
    if (codeStructure < 60) improvements.push('Use better code organization with functions and modules');
    if (efficiency < 60) improvements.push('Consider more efficient approaches or algorithms');
    improvements.push('Add error handling and edge case coverage');
    improvements.push('Include comments and documentation for complex logic');

    const mistakeBreakdown = [];
    if (completeness < 80) mistakeBreakdown.push({ area: 'Completeness', description: `Only ${coveredCount}/${reqCount} requirements were addressed` });
    if (codeStructure < 70) mistakeBreakdown.push({ area: 'Code Structure', description: 'Code could be better organized with proper abstractions' });
    if (!text.includes('error') && !text.includes('try') && !text.includes('catch')) mistakeBreakdown.push({ area: 'Error Handling', description: 'No error handling detected in the submission' });

    return {
        score: Math.round(score),
        logicalCorrectness: Math.round(logicalCorrectness),
        conceptApplication: Math.round(conceptApplication),
        codeStructure: Math.round(codeStructure),
        completeness: Math.round(completeness),
        efficiency: Math.round(efficiency),
        conceptCoverage: covered,
        mistakeBreakdown,
        improvements
    };
}

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

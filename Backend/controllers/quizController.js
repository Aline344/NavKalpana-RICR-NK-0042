import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Question bank by topic
const questionBank = {
    'JavaScript': [
        { questionText: 'What is the output of typeof null in JavaScript?', type: 'mcq-single', options: [{ text: '"null"', isCorrect: false }, { text: '"undefined"', isCorrect: false }, { text: '"object"', isCorrect: true }, { text: '"boolean"', isCorrect: false }], explanation: 'typeof null returns "object" due to a historical bug in JavaScript.', conceptTag: 'Type System' },
        { questionText: 'Which of the following are falsy values in JavaScript?', type: 'mcq-multiple', options: [{ text: '0', isCorrect: true }, { text: '""', isCorrect: true }, { text: '"false"', isCorrect: false }, { text: 'null', isCorrect: true }, { text: '[]', isCorrect: false }], explanation: '0, "", null, undefined, NaN, and false are falsy.', conceptTag: 'Type Coercion' },
        { questionText: 'What does the "this" keyword refer to in an arrow function?', type: 'short-answer', correctAnswer: 'Arrow functions do not have their own "this". They inherit "this" from the enclosing lexical scope.', explanation: 'Unlike regular functions, arrow functions capture the "this" value of the enclosing context.', conceptTag: 'Scope & Closures' },
        { questionText: 'A developer notices that their event listener fires multiple times on a single click. The listener is added inside a useEffect hook without a dependency array. What is the most likely cause?', type: 'scenario', options: [{ text: 'The event is bubbling up the DOM', isCorrect: false }, { text: 'useEffect runs on every render, adding duplicate listeners', isCorrect: true }, { text: 'The browser is caching the event', isCorrect: false }, { text: 'JavaScript is single-threaded and queues events', isCorrect: false }], explanation: 'Without a dependency array, useEffect runs after every render, adding a new listener each time.', conceptTag: 'React Hooks' },
        { questionText: 'What will console.log([1,2,3].map(n => n * 2)) output?', type: 'code-output', correctAnswer: '[2, 4, 6]', explanation: 'Array.map() creates a new array by applying the callback to each element.', conceptTag: 'Array Methods' },
        { questionText: 'What is a closure in JavaScript?', type: 'short-answer', correctAnswer: 'A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned.', explanation: 'Closures allow functions to "remember" the environment in which they were created.', conceptTag: 'Scope & Closures' },
        { questionText: 'What will be logged: setTimeout(() => console.log("a"), 0); console.log("b");', type: 'code-output', correctAnswer: 'b then a', explanation: 'setTimeout callbacks are placed in the task queue and execute after the synchronous code.', conceptTag: 'Event Loop' },
        { questionText: 'Which method converts a JSON string to a JavaScript object?', type: 'mcq-single', options: [{ text: 'JSON.stringify()', isCorrect: false }, { text: 'JSON.parse()', isCorrect: true }, { text: 'JSON.convert()', isCorrect: false }, { text: 'Object.fromJSON()', isCorrect: false }], explanation: 'JSON.parse() parses a JSON string and constructs the JavaScript value or object.', conceptTag: 'JSON' }
    ],
    'React': [
        { questionText: 'What hook is used to manage side effects in React functional components?', type: 'mcq-single', options: [{ text: 'useState', isCorrect: false }, { text: 'useEffect', isCorrect: true }, { text: 'useContext', isCorrect: false }, { text: 'useReducer', isCorrect: false }], explanation: 'useEffect is specifically designed for side effects like data fetching, subscriptions, or DOM mutations.', conceptTag: 'React Hooks' },
        { questionText: 'Which of the following are valid React hooks rules?', type: 'mcq-multiple', options: [{ text: 'Only call hooks at the top level', isCorrect: true }, { text: 'Call hooks inside loops', isCorrect: false }, { text: 'Only call hooks from React functions', isCorrect: true }, { text: 'Hooks can be called conditionally', isCorrect: false }], explanation: 'React hooks must be called at the top level and only from React function components or custom hooks.', conceptTag: 'React Hooks' },
        { questionText: 'What is the Virtual DOM in React?', type: 'short-answer', correctAnswer: 'The Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to determine the minimal set of changes needed to update the actual DOM efficiently.', explanation: 'React creates a virtual DOM tree and diffs it with the previous one to compute optimal updates.', conceptTag: 'React Core' },
        { questionText: 'A React component re-renders every time its parent renders, even though its props have not changed. What optimization can prevent this?', type: 'scenario', options: [{ text: 'Using useEffect', isCorrect: false }, { text: 'Wrapping the component with React.memo()', isCorrect: true }, { text: 'Using useState', isCorrect: false }, { text: 'Adding a key prop', isCorrect: false }], explanation: 'React.memo() is a higher-order component that memoizes the result and only re-renders when props change.', conceptTag: 'Performance' },
        { questionText: 'What does the useState hook return?', type: 'mcq-single', options: [{ text: 'An object with state and setState', isCorrect: false }, { text: 'An array with the current state and a function to update it', isCorrect: true }, { text: 'A single value', isCorrect: false }, { text: 'A promise', isCorrect: false }], explanation: 'useState returns [currentState, setStateFunction].', conceptTag: 'React Hooks' },
        { questionText: 'What is prop drilling and how can you avoid it?', type: 'short-answer', correctAnswer: 'Prop drilling is passing props through multiple nested components. It can be avoided using React Context API, Redux, or other state management solutions.', explanation: 'Context API provides a way to share values between components without passing props through every level.', conceptTag: 'State Management' },
        { questionText: 'What is the purpose of the key prop in React lists?', type: 'mcq-single', options: [{ text: 'Styling purposes', isCorrect: false }, { text: 'To help React identify which items changed, added, or removed', isCorrect: true }, { text: 'To set unique IDs in the DOM', isCorrect: false }, { text: 'For accessibility', isCorrect: false }], explanation: 'Keys help React optimize list rendering by identifying which items need to be updated.', conceptTag: 'React Core' },
        { questionText: 'What is the difference between controlled and uncontrolled components?', type: 'short-answer', correctAnswer: 'Controlled components have their form data handled by React state. Uncontrolled components store form data in the DOM itself, accessed via refs.', explanation: 'Controlled components give React full control over the form input values.', conceptTag: 'Forms' }
    ],
    'Node.js': [
        { questionText: 'What is the event loop in Node.js?', type: 'short-answer', correctAnswer: 'The event loop is a mechanism that allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel when possible and executing callbacks when operations complete.', explanation: 'The event loop is the core of Node.js asynchronous, single-threaded architecture.', conceptTag: 'Core Concepts' },
        { questionText: 'Which module is used to create an HTTP server in Node.js?', type: 'mcq-single', options: [{ text: 'fs', isCorrect: false }, { text: 'http', isCorrect: true }, { text: 'path', isCorrect: false }, { text: 'url', isCorrect: false }], explanation: 'The built-in http module provides functionality to create HTTP servers and clients.', conceptTag: 'Modules' },
        { questionText: 'What is middleware in Express.js?', type: 'short-answer', correctAnswer: 'Middleware functions are functions that have access to the request, response, and next middleware function. They can execute code, modify req/res, end the request-response cycle, or call next().', explanation: 'Express middleware forms a pipeline through which each request passes.', conceptTag: 'Express.js' },
        { questionText: 'Which of the following are valid ways to handle errors in Express?', type: 'mcq-multiple', options: [{ text: 'try-catch blocks in async handlers', isCorrect: true }, { text: 'Error-handling middleware with 4 parameters', isCorrect: true }, { text: 'Using process.exit()', isCorrect: false }, { text: 'Passing errors to next()', isCorrect: true }], explanation: 'Express supports multiple error handling patterns including middleware and next(err).', conceptTag: 'Error Handling' },
        { questionText: 'A developer\'s Express API returns 404 for all routes after adding a static file middleware. The static middleware is defined before the routes. What\'s the issue?', type: 'scenario', options: [{ text: 'Static middleware blocks all subsequent routes', isCorrect: false }, { text: 'The static folder contains an index.html that catches all requests', isCorrect: true }, { text: 'Express can only handle static OR dynamic routes', isCorrect: false }, { text: 'The routes need to be moved to a separate file', isCorrect: false }], explanation: 'If the static folder has an index.html, it may serve that file for the root path, but routes should still work for other paths.', conceptTag: 'Express.js' },
        { questionText: 'What does require() do in Node.js?', type: 'mcq-single', options: [{ text: 'Imports CSS files', isCorrect: false }, { text: 'Loads and caches a module', isCorrect: true }, { text: 'Creates a new process', isCorrect: false }, { text: 'Starts the event loop', isCorrect: false }], explanation: 'require() loads the module, executes it, and caches the result.', conceptTag: 'Modules' },
        { questionText: 'What will the following output?\nconst fs = require("fs");\nconsole.log("Start");\nfs.readFile("file.txt", () => console.log("File read"));\nconsole.log("End");', type: 'code-output', correctAnswer: 'Start\nEnd\nFile read', explanation: 'readFile is asynchronous and its callback runs after synchronous code completes.', conceptTag: 'Async I/O' }
    ],
    'Data Structures': [
        { questionText: 'What is the time complexity of searching in a balanced BST?', type: 'mcq-single', options: [{ text: 'O(n)', isCorrect: false }, { text: 'O(log n)', isCorrect: true }, { text: 'O(1)', isCorrect: false }, { text: 'O(n log n)', isCorrect: false }], explanation: 'A balanced BST halves the search space at each step, giving O(log n).', conceptTag: 'Trees' },
        { questionText: 'Which data structures use FIFO ordering?', type: 'mcq-multiple', options: [{ text: 'Stack', isCorrect: false }, { text: 'Queue', isCorrect: true }, { text: 'Deque', isCorrect: true }, { text: 'Priority Queue', isCorrect: false }], explanation: 'Queue follows FIFO (First In First Out). Deque supports both FIFO and LIFO.', conceptTag: 'Linear Structures' },
        { questionText: 'Explain the difference between a stack and a queue.', type: 'short-answer', correctAnswer: 'A stack follows LIFO (Last In First Out) — elements are added and removed from the same end. A queue follows FIFO (First In First Out) — elements are added at the rear and removed from the front.', explanation: 'Stack: push/pop from top. Queue: enqueue at rear, dequeue from front.', conceptTag: 'Linear Structures' },
        { questionText: 'You need to design a system that processes customer support tickets in order of priority while maintaining FIFO for tickets of the same priority. Which data structure is best?', type: 'scenario', options: [{ text: 'Simple Queue', isCorrect: false }, { text: 'Stack', isCorrect: false }, { text: 'Priority Queue with stable ordering', isCorrect: true }, { text: 'Linked List', isCorrect: false }], explanation: 'A priority queue with stable ordering handles both priority and FIFO within the same priority level.', conceptTag: 'Advanced Structures' },
        { questionText: 'What is a hash collision and how is it resolved?', type: 'short-answer', correctAnswer: 'A hash collision occurs when two different keys produce the same hash index. It can be resolved using chaining (linked lists at each index) or open addressing (probing for the next available slot).', explanation: 'Hash tables must handle collisions to maintain correct key-value mappings.', conceptTag: 'Hash Tables' },
        { questionText: 'What is the space complexity of a recursive Fibonacci implementation?', type: 'mcq-single', options: [{ text: 'O(n)', isCorrect: true }, { text: 'O(2^n)', isCorrect: false }, { text: 'O(1)', isCorrect: false }, { text: 'O(log n)', isCorrect: false }], explanation: 'The call stack grows linearly with n, so space is O(n), even though time is O(2^n).', conceptTag: 'Recursion' }
    ],
    'Python': [
        { questionText: 'What is the difference between a list and a tuple in Python?', type: 'short-answer', correctAnswer: 'Lists are mutable (can be modified after creation) while tuples are immutable (cannot be changed). Lists use square brackets [], tuples use parentheses ().', explanation: 'Tuples are faster and can be used as dictionary keys due to immutability.', conceptTag: 'Data Types' },
        { questionText: 'What does the "self" parameter represent in Python class methods?', type: 'mcq-single', options: [{ text: 'The class itself', isCorrect: false }, { text: 'The instance of the class', isCorrect: true }, { text: 'A global variable', isCorrect: false }, { text: 'The parent class', isCorrect: false }], explanation: 'self refers to the instance on which the method is called.', conceptTag: 'OOP' },
        { questionText: 'What will [x**2 for x in range(5)] produce?', type: 'code-output', correctAnswer: '[0, 1, 4, 9, 16]', explanation: 'List comprehension creates a new list with squares of 0 through 4.', conceptTag: 'Comprehensions' },
        { questionText: 'Which of these are mutable types in Python?', type: 'mcq-multiple', options: [{ text: 'list', isCorrect: true }, { text: 'tuple', isCorrect: false }, { text: 'dict', isCorrect: true }, { text: 'str', isCorrect: false }, { text: 'set', isCorrect: true }], explanation: 'Lists, dictionaries, and sets can be modified after creation.', conceptTag: 'Data Types' },
        { questionText: 'What is a decorator in Python?', type: 'short-answer', correctAnswer: 'A decorator is a function that takes another function as input and extends its behavior without modifying it. Decorators use the @decorator_name syntax.', explanation: 'Decorators are a powerful pattern for adding functionality to existing functions.', conceptTag: 'Advanced Functions' },
        { questionText: 'A developer writes: nums = [1,2,3]; copy = nums; copy.append(4). Why does nums also contain 4?', type: 'scenario', options: [{ text: 'Python copies lists by default', isCorrect: false }, { text: 'Both variables reference the same list object in memory', isCorrect: true }, { text: 'append() modifies all lists', isCorrect: false }, { text: 'This is a Python bug', isCorrect: false }], explanation: 'Assignment in Python creates a reference, not a copy. Use list.copy() or slicing [:] for a shallow copy.', conceptTag: 'Memory Model' }
    ],
    'SQL': [
        { questionText: 'What is the difference between INNER JOIN and LEFT JOIN?', type: 'short-answer', correctAnswer: 'INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table and matching rows from the right table, with NULL for non-matching right rows.', explanation: 'LEFT JOIN preserves all rows from the left table regardless of matches.', conceptTag: 'Joins' },
        { questionText: 'Which SQL clause is used to filter grouped results?', type: 'mcq-single', options: [{ text: 'WHERE', isCorrect: false }, { text: 'HAVING', isCorrect: true }, { text: 'FILTER', isCorrect: false }, { text: 'GROUP BY', isCorrect: false }], explanation: 'HAVING filters groups after GROUP BY, while WHERE filters rows before grouping.', conceptTag: 'Aggregation' },
        { questionText: 'What will SELECT COUNT(*) FROM users WHERE age > 25 return if the table has 100 rows and 40 are over 25?', type: 'code-output', correctAnswer: '40', explanation: 'COUNT(*) counts all rows matching the WHERE condition.', conceptTag: 'Aggregation' },
        { questionText: 'What is database normalization?', type: 'short-answer', correctAnswer: 'Normalization is the process of organizing database tables to reduce data redundancy and improve data integrity by dividing large tables into smaller, related tables linked by foreign keys.', explanation: 'Normal forms (1NF, 2NF, 3NF, BCNF) define progressive levels of normalization.', conceptTag: 'Database Design' },
        { questionText: 'Which of the following SQL operations can modify data?', type: 'mcq-multiple', options: [{ text: 'SELECT', isCorrect: false }, { text: 'INSERT', isCorrect: true }, { text: 'UPDATE', isCorrect: true }, { text: 'DELETE', isCorrect: true }], explanation: 'INSERT, UPDATE, and DELETE are DML operations that modify data.', conceptTag: 'CRUD Operations' },
        { questionText: 'A developer notices that a query with multiple JOINs runs very slowly on a large dataset. What is the most effective optimization?', type: 'scenario', options: [{ text: 'Add more RAM to the server', isCorrect: false }, { text: 'Create indexes on the JOIN columns', isCorrect: true }, { text: 'Use SELECT * instead of specific columns', isCorrect: false }, { text: 'Remove the WHERE clause', isCorrect: false }], explanation: 'Indexes on JOIN columns dramatically improve query performance.', conceptTag: 'Performance' }
    ]
};

import { generateAIContent } from '../config/gemini.js';

// Generate adaptive quiz using Gemini AI
export const generateQuiz = async (req, res) => {
    try {
        const { topic, difficulty, numQuestions } = req.body;
        const user = await User.findById(req.user._id);
        const targetRole = user?.targetRole || 'Full Stack Developer';

        // Adaptive grounding data
        const weakTopics = (user.topicMastery || []).filter(t => t.score < 60).map(t => t.topic);
        const resumeGaps = user.resumeData?.missingSkills || [];
        const recentMistakes = (user.mistakeHistory || []).slice(-5).map(m => `${m.concept} (${m.mistakeType})`);

        const finalDifficulty = difficulty || user.preferredDifficulty || 3;

        const prompt = `Generate a ${numQuestions || 10}-question adaptive quiz on "${topic || 'General'}" for a ${targetRole} (${finalDifficulty}/5 difficulty).
        
        ADAPTIVE FOCUS:
        - Weak Topics: ${weakTopics.join(', ')}
        - Gaps: ${resumeGaps.join(', ')}
        - Mistakes: ${recentMistakes.join(', ')}
        
        RULES:
        1. Mix: mcq-single, mcq-multiple, short-answer, scenario, code-output.
        2. Unique Seed: ${Math.random().toString(36).substring(7)}.
        3. No repeat questions.
        4. Return ONLY a JSON array.
        
        FORMAT:
        [{ "questionText": "...", "type": "...", "options": [{"text": "...", "isCorrect": true}], "correctAnswer": "...", "explanation": "...", "conceptTag": "..." }]`;

        const aiResponse = await generateAIContent(prompt);
        console.log('AI Response:', aiResponse);
        // Clean JSON response - handle markdown and extra text
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('AI failed to return a valid JSON array');
        }
        const questions = JSON.parse(jsonMatch[0]);

        const quiz = await Quiz.create({
            userId: req.user._id,
            title: `${topic || 'General'} AI Adaptive Quiz`,
            topic: topic || 'General',
            difficulty: finalDifficulty,
            questions: questions,
            totalQuestions: questions.length,
            timeLimit: Math.max(10, Math.round(questions.length * (1 + (finalDifficulty * 0.2)))),
            status: 'pending'
        });

        res.status(201).json(quiz);
    } catch (error) {
        console.error('Quiz Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate quiz using AI. Please try again.' });
    }
};

// Submit quiz and evaluate
export const submitQuiz = async (req, res) => {
    try {
        const { quizId, responses } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let correctCount = 0;
        const conceptStats = {};
        const mistakeTypes = { conceptual: 0, careless: 0, 'knowledge-gap': 0, 'time-pressure': 0 };
        const evaluatedResponses = [];

        responses.forEach((resp, i) => {
            const question = quiz.questions[i];
            if (!question) return;

            let isCorrect = false;
            if (question.type === 'mcq-single') {
                isCorrect = question.options[resp.selectedAnswer]?.isCorrect || false;
            } else if (question.type === 'mcq-multiple') {
                const correctIndices = question.options.map((o, idx) => o.isCorrect ? idx : -1).filter(idx => idx !== -1);
                const selected = Array.isArray(resp.selectedAnswer) ? resp.selectedAnswer : [];
                isCorrect = correctIndices.length === selected.length && correctIndices.every(idx => selected.includes(idx));
            } else if (question.type === 'code-output' || question.type === 'short-answer') {
                const answer = (resp.selectedAnswer || '').toString().toLowerCase().trim();
                const correct = (question.correctAnswer || '').toLowerCase().trim();
                isCorrect = answer !== '' && (answer.includes(correct) || correct.includes(answer));
            } else if (question.type === 'scenario') {
                isCorrect = question.options[resp.selectedAnswer]?.isCorrect || false;
            }

            if (isCorrect) correctCount++;

            // Track concept accuracy
            const concept = question.conceptTag || 'General';
            if (!conceptStats[concept]) conceptStats[concept] = { correct: 0, total: 0 };
            conceptStats[concept].total++;
            if (isCorrect) conceptStats[concept].correct++;

            evaluatedResponses.push({ questionIndex: i, selectedAnswer: resp.selectedAnswer, isCorrect, timeTaken: resp.timeTaken || 0, flagged: resp.flagged || false });
        });

        const score = Math.round((correctCount / quiz.questions.length) * 100);
        const topicAccuracy = Object.entries(conceptStats).map(([concept, stats]) => ({
            concept, correct: stats.correct, total: stats.total, accuracy: Math.round((stats.correct / stats.total) * 100)
        }));

        const mistakeClassification = evaluatedResponses
            .filter(r => !r.isCorrect)
            .reduce((acc, r) => {
                const type = r.timeTaken < 10 ? 'careless' : r.timeTaken > 60 ? 'time-pressure' : 'conceptual';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});

        quiz.responses = evaluatedResponses;
        quiz.score = score;
        quiz.topicAccuracy = topicAccuracy;
        quiz.mistakeClassification = Object.entries(mistakeClassification).map(([type, count]) => ({ type, count }));
        quiz.status = 'completed';
        quiz.completedAt = new Date();
        await quiz.save();

        // Update user mastery & mistake history
        const user = await User.findById(req.user._id);
        if (user) {
            // Mistake history update
            const newMistakes = evaluatedResponses
                .filter(r => !r.isCorrect)
                .map(r => ({
                    topic: quiz.topic,
                    concept: quiz.questions[r.questionIndex].conceptTag || 'General',
                    mistakeType: r.timeTaken < 10 ? 'careless' : r.timeTaken > 60 ? 'time-pressure' : 'conceptual',
                    lastOccurred: new Date()
                }));

            if (newMistakes.length > 0) {
                user.mistakeHistory.push(...newMistakes);
            }

            let mastery = user.topicMastery.find(t => t.topic === quiz.topic);
            if (!mastery) {
                user.topicMastery.push({ topic: quiz.topic, score: 0, quizAvg: 0, assignmentAvg: 0, consistency: 0, attempts: 0 });
                mastery = user.topicMastery[user.topicMastery.length - 1];
            }
            mastery.attempts++;
            mastery.quizAvg = Math.round(((mastery.quizAvg * (mastery.attempts - 1)) + score) / mastery.attempts);
            mastery.score = Math.round((mastery.quizAvg * 0.50) + (mastery.assignmentAvg * 0.30) + (mastery.consistency * 0.20));
            mastery.lastAttempted = new Date();

            if (mastery.score >= 75) mastery.riskLevel = 'low';
            else if (mastery.score >= 50) mastery.riskLevel = 'moderate';
            else mastery.riskLevel = 'high';

            mastery.consistency = Math.min(100, mastery.consistency + 10);

            // Adaptive Difficulty Scaling (Requirement 6.6)
            const recentQuizzes = await Quiz.find({ userId: user._id, status: 'completed' })
                .sort({ completedAt: -1 })
                .limit(3);

            if (recentQuizzes.length === 3) {
                const avgRecentScore = recentQuizzes.reduce((acc, q) => acc + q.score, 0) / 3;
                if (avgRecentScore > 75 && user.preferredDifficulty < 5) {
                    user.preferredDifficulty += 1;
                } else if (avgRecentScore < 50 && user.preferredDifficulty > 1) {
                    user.preferredDifficulty -= 1;
                }
            }

            // Update Study Plan
            const existingTask = user.studyPlan.find(s => s.topic === quiz.topic);
            if (score < 60) {
                if (existingTask) {
                    existingTask.priority = 'high';
                    existingTask.completed = false;
                } else {
                    user.studyPlan.push({ topic: quiz.topic, priority: 'high', scheduledDate: new Date(Date.now() + 86400000) });
                }
            } else if (existingTask && score >= 80) {
                existingTask.completed = true;
            }

            await user.save();
        }

        res.json({ score, topicAccuracy, mistakeClassification: quiz.mistakeClassification, responses: evaluatedResponses, quiz });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get quiz results
export const getQuizResults = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single quiz
export const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

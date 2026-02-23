import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    type: { type: String, enum: ['mcq-single', 'mcq-multiple', 'short-answer', 'scenario', 'code-output'], required: true },
    options: [{ text: String, isCorrect: Boolean }],
    correctAnswer: { type: String },
    explanation: { type: String },
    difficulty: { type: Number, min: 1, max: 5, default: 3 },
    conceptTag: { type: String }
});

const quizSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: Number, min: 1, max: 5, default: 3 },
    questions: [questionSchema],
    totalQuestions: { type: Number, default: 10 },
    timeLimit: { type: Number, default: 15 }, // minutes
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    responses: [{
        questionIndex: Number,
        selectedAnswer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        timeTaken: Number,
        flagged: { type: Boolean, default: false }
    }],
    score: { type: Number, default: 0 },
    topicAccuracy: [{
        concept: String,
        correct: Number,
        total: Number,
        accuracy: Number
    }],
    mistakeClassification: [{
        type: { type: String, enum: ['conceptual', 'careless', 'knowledge-gap', 'time-pressure'] },
        count: Number
    }],
    startedAt: Date,
    completedAt: Date,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Quiz', quizSchema);

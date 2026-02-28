import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    type: { type: String, enum: ['coding', 'mini-project', 'case-study', 'analytical', 'debugging', 'system-design'], required: true },

    // LeetCode style fields
    problemStatement: { type: String, required: true },
    startingCode: {
        type: Map,
        of: String, // Maps language (e.g., 'javascript', 'python') to boilerplate code
    },
    testCases: [testCaseSchema],
    solution: { type: String }, // Explanation of the optimal approach

    difficulty: { type: Number, min: 1, max: 5, default: 3 },
    status: { type: String, enum: ['pending', 'submitted', 'evaluated'], default: 'pending' },

    submission: {
        language: String,
        code: String,
        submittedAt: Date,
        passedCases: Number,
        totalCases: Number,
        executionTimeMs: Number
    },

    evaluation: {
        score: { type: Number, default: 0 },
        logicalCorrectness: { type: Number, default: 0 },
        efficiency: { type: Number, default: 0 },
        mistakeBreakdown: [{ area: String, description: String }],
        improvements: [{ type: String }],
        evaluatedAt: Date
    },

    dueDate: Date,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Assignment', assignmentSchema);

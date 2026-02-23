import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    type: { type: String, enum: ['coding', 'mini-project', 'case-study', 'analytical', 'debugging', 'system-design'], required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    difficulty: { type: Number, min: 1, max: 5, default: 3 },
    status: { type: String, enum: ['pending', 'submitted', 'evaluated'], default: 'pending' },
    submission: {
        type: { type: String, enum: ['code', 'file', 'text', 'github-link'] },
        content: String,
        fileUrl: String,
        submittedAt: Date
    },
    evaluation: {
        score: { type: Number, default: 0 },
        logicalCorrectness: { type: Number, default: 0 },
        conceptApplication: { type: Number, default: 0 },
        codeStructure: { type: Number, default: 0 },
        completeness: { type: Number, default: 0 },
        efficiency: { type: Number, default: 0 },
        conceptCoverage: [{ concept: String, covered: Boolean }],
        mistakeBreakdown: [{ area: String, description: String }],
        improvements: [{ type: String }],
        evaluatedAt: Date
    },
    dueDate: Date,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Assignment', assignmentSchema);

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    category: { type: String, enum: ['Technical', 'Behavioral', 'System Design', 'Project Deep Dive'], required: true },
    userAnswer: { type: String, default: '' },
    evaluation: {
        score: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
        missingConcepts: [String],
        breakdown: {
            keywordRelevance: { type: Number, default: 0 },
            technicalDepth: { type: Number, default: 0 },
            logicalStructure: { type: Number, default: 0 },
            terminologyUsage: { type: Number, default: 0 },
            completeness: { type: Number, default: 0 }
        }
    }
});

const interviewSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    skills: [String],
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    questions: [questionSchema],
    communicationEvaluation: {
        score: { type: Number, default: 0 },
        grammarAccuracy: { type: Number, default: 0 },
        logicalSequencing: { type: Number, default: 0 },
        conceptArticulation: { type: Number, default: 0 },
        redundancyDetection: { type: Number, default: 0 },
        starMethodCompliance: { type: Number, default: 0 },
        classification: { type: String, default: '' },
        feedback: { type: String, default: '' }
    },

    interviewReadinessScore: { type: Number, default: 0 },
    irsClassification: { type: String, default: '' },
    roleAlignmentScore: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    overallFeedback: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
}, { timestamps: true });


export default mongoose.model('InterviewSession', interviewSessionSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    avatar: { type: String, default: '' },
    targetRole: { type: String, default: '' },
    skills: [{ type: String }],
    preferredDifficulty: { type: Number, min: 1, max: 5, default: 3 },
    topicMastery: [{
        topic: { type: String },
        score: { type: Number, default: 0 },
        quizAvg: { type: Number, default: 0 },
        assignmentAvg: { type: Number, default: 0 },
        consistency: { type: Number, default: 0 },
        riskLevel: { type: String, enum: ['low', 'moderate', 'high'], default: 'high' },
        attempts: { type: Number, default: 0 },
        lastAttempted: { type: Date }
    }],
    studyPlan: [{
        topic: String,
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        scheduledDate: Date,
        completed: { type: Boolean, default: false }
    }],
    resumeData: {
        strengthScore: { type: Number, default: 0 },
        skills: [String],
        missingSkills: [String],
        projects: [String],
        experience: [String],
        recommendations: [String]
    },
    mistakeHistory: [{
        topic: String,
        concept: String,
        mistakeType: { type: String, enum: ['conceptual', 'careless', 'knowledge-gap', 'time-pressure'] },
        count: { type: Number, default: 1 },
        lastOccurred: { type: Date, default: Date.now }
    }],
    lastActive: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

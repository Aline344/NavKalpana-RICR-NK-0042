import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Assignment from '../models/Assignment.js';

export const getDashboardStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        const quizzes = await Quiz.find({ userId: req.user._id }).sort({ createdAt: -1 });
        const assignments = await Assignment.find({ userId: req.user._id }).sort({ createdAt: -1 });

        const completedQuizzes = quizzes.filter(q => q.status === 'completed');
        const avgQuizScore = completedQuizzes.length > 0 ? Math.round(completedQuizzes.reduce((sum, q) => sum + q.score, 0) / completedQuizzes.length) : 0;
        const evaluatedAssignments = assignments.filter(a => a.status === 'evaluated');
        const avgAssignmentScore = evaluatedAssignments.length > 0 ? Math.round(evaluatedAssignments.reduce((sum, a) => sum + (a.evaluation?.score || 0), 0) / evaluatedAssignments.length) : 0;

        // High risk topics
        const highRiskTopics = (user.topicMastery || []).filter(t => t.riskLevel === 'high').map(t => t.topic);

        // Performance trend (last 10 quizzes)
        const performanceTrend = completedQuizzes.slice(0, 10).reverse().map(q => ({
            date: q.completedAt,
            topic: q.topic,
            score: q.score
        }));

        // Overall readiness score
        const overallMastery = user.topicMastery?.length > 0
            ? Math.round(user.topicMastery.reduce((sum, t) => sum + t.score, 0) / user.topicMastery.length)
            : 0;

        // Heatmap data (Topic vs Mastery range)
        const heatmap = (user.topicMastery || []).map(t => ({
            topic: t.topic,
            mastery: t.score,
            level: t.score >= 80 ? 4 : t.score >= 60 ? 3 : t.score >= 40 ? 2 : 1
        }));

        // Recommended Mini Projects (Requirement 6.5)
        const recommendedProjects = (user.resumeData?.missingSkills || [])
            .slice(0, 3)
            .map(skill => ({
                title: `${skill} Mastery Project`,
                topic: skill,
                description: `Hands-on mini project focused on ${skill} to bridge your expertise gap.`,
                estimatedTime: '2-3 hours'
            }));

        // Upcoming Adaptive Quiz (Requirement 6.5)
        const upcomingQuiz = user.studyPlan
            .filter(s => !s.completed)
            .sort((a, b) => (b.priority === 'high' ? 1 : -1))
            .slice(0, 1)
            .map(s => ({
                topic: s.topic,
                priority: s.priority,
                title: `${s.topic} Focus Quiz`
            }))[0] || { topic: 'General Knowledge', title: 'Daily Adaptive Quiz', priority: 'medium' };

        // Pending Assignments (Requirement 6.5)
        const pendingAssignments = assignments
            .filter(a => a.status === 'pending')
            .map(a => ({
                id: a._id,
                title: a.title,
                topic: a.topic,
                dueDate: a.dueDate,
                priority: new Date(a.dueDate) - new Date() < 86400000 ? 'high' : 'medium'
            }));

        res.json({
            user: {
                name: user.name,
                email: user.email,
                targetRole: user.targetRole,
                avatar: user.avatar,
                preferredDifficulty: user.preferredDifficulty,
                skills: user.skills || []
            },

            stats: {
                totalQuizzes: quizzes.length,
                completedQuizzes: completedQuizzes.length,
                avgQuizScore,
                totalAssignments: assignments.length,
                evaluatedAssignments: evaluatedAssignments.length,
                avgAssignmentScore,
                overallMastery,
                resumeStrength: user.resumeData?.strengthScore || 0,
                careerReadinessScore: user.careerReadinessScore || 0,
                crsClassification: user.crsClassification || '',
                interviewReadinessScore: user.interviewReadinessScore || 0,

                irsClassification: user.irsClassification || '',
                cciScore: user.cciScore || 0,
                cciClassification: user.cciClassification || '',
                foundSkills: user.resumeData?.skills || [],
                missingSkills: user.resumeData?.missingSkills || []
            },


            topicMastery: user.topicMastery || [],
            heatmap,
            recommendedProjects,
            highRiskTopics,
            upcomingQuiz,
            pendingAssignments,
            performanceTrend,
            criticalGaps: (user.mistakeHistory || [])
                .filter(m => m.count >= 2)
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map(m => ({ topic: m.topic, concept: m.concept, count: m.count })),
            studyPlan: user.studyPlan || [],
            readinessHistory: user.readinessHistory || [],
            growthStats: {
                improvementPercentage: user.readinessHistory?.length > 1
                    ? Math.round(((user.readinessHistory[user.readinessHistory.length - 1].crs - user.readinessHistory[0].crs) / (user.readinessHistory[0].crs || 1)) * 100)
                    : 0,
                stabilityIndex: user.readinessHistory?.length > 3
                    ? 100 - (Math.max(...user.readinessHistory.slice(-5).map(h => h.crs)) - Math.min(...user.readinessHistory.slice(-5).map(h => h.crs)))
                    : 100
            },
            recommendedInterviews: (user.resumeData?.missingSkills?.length > 0 ? user.resumeData.missingSkills : highRiskTopics).slice(0, 2).map(skill => ({
                role: user.targetRole || 'Software Engineer',
                focusTopic: skill,
                difficulty: user.preferredDifficulty,
                cta: 'Start Simulated Interview'
            })),
            recentActivity: [
                ...completedQuizzes.map(q => ({ type: 'quiz', id: q._id, title: q.title, score: q.score, date: q.completedAt })),
                ...evaluatedAssignments.map(a => ({ type: 'assignment', id: a._id, title: a.title, score: a.evaluation?.score, date: a.evaluation?.evaluatedAt }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        const totalQuizzes = await Quiz.countDocuments();
        const totalAssignments = await Assignment.countDocuments();

        res.json({
            users,
            platformStats: {
                totalUsers: users.length,
                totalStudents: users.filter(u => u.role === 'student').length,
                totalAdmins: users.filter(u => u.role === 'admin').length,
                totalQuizzes,
                totalAssignments
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update user
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.role = req.body.role || user.role;
        user.name = req.body.name || user.name;
        const updated = await user.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Quiz.deleteMany({ userId: req.params.id });
        await Assignment.deleteMany({ userId: req.params.id });
        res.json({ message: 'User and associated data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Admin: Get specific user details (full dashboard context)
export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const [completedQuizzes, evaluatedAssignments] = await Promise.all([
            Quiz.find({ userId: user._id, status: 'completed' }).sort({ completedAt: -1 }),
            Assignment.find({ userId: user._id, status: 'evaluated' }).sort({ 'evaluation.evaluatedAt': -1 })
        ]);

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                targetRole: user.targetRole,
                skills: user.skills,
                resumeStrength: user.resumeData?.strengthScore || 0
            },
            topicMastery: user.topicMastery || [],
            studyPlan: user.studyPlan || [],
            recentActivity: [
                ...completedQuizzes.map(q => ({ type: 'quiz', id: q._id, title: q.title, score: q.score, date: q.completedAt })),
                ...evaluatedAssignments.map(a => ({ type: 'assignment', id: a._id, title: a.title, score: a.evaluation?.score, date: a.evaluation?.evaluatedAt }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

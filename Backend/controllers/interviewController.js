import InterviewSession from '../models/InterviewSession.js';
import User from '../models/User.js';
import { generateAIContent } from '../config/gemini.js';

// Start a new interview session and generate questions
export const startInterview = async (req, res) => {
    try {
        const { role, skills, category, difficulty } = req.body;

        if (!role || !skills || !category || !difficulty) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 7.1 Role Selection & Resume Alignment Validation
        const user = await User.findById(req.user._id);
        const resumeSkills = user.resumeData?.skills || [];
        const targetSkills = Array.isArray(skills) ? skills : [skills];

        // Calculate Alignment Score based on skill overlap
        const matchedSkills = targetSkills.filter(ts =>
            resumeSkills.some(rs => rs.toLowerCase().includes(ts.toLowerCase()))
        );
        const roleAlignmentScore = targetSkills.length > 0
            ? Math.round((matchedSkills.length / targetSkills.length) * 100)
            : 0;

        // If alignment is extremely poor, we could theoretically block, 
        // but requirement says "System validates", so we'll store the validation result.

        const generationPrompt = `Act as an expert interviewer for the role: "${role}".
        Target Skills: ${Array.isArray(skills) ? skills.join(', ') : skills}
        Category: ${category}
        Difficulty: ${difficulty}

        Generate exactly 5 high-quality interview questions tailored to these parameters.
        The questions should be challenging and follow the mapping logic: Role x Skill x Category x Difficulty.

        Return ONLY a JSON array of objects with this format:
        [
          { "questionText": "...", "category": "${category}" }
        ]`;

        const aiResponse = await generateAIContent(generationPrompt);

        // Robust JSON extraction (Requirement: Handle junk around [ ... ])
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('AI Response is not a valid JSON array:', aiResponse);
            throw new Error('AI failed to generate a valid question array');
        }

        const jsonStr = jsonMatch[0];
        const questions = JSON.parse(jsonStr);


        const newSession = new InterviewSession({
            userId: req.user._id,
            role,
            skills: Array.isArray(skills) ? skills : [skills],
            category,
            difficulty,
            questions: questions.map(q => ({
                questionText: q.questionText,
                category: q.category || category
            })),
            roleAlignmentScore,
            status: 'in-progress'
        });

        await newSession.save();

        res.status(201).json(newSession);
    } catch (error) {
        console.error('Start Interview Error:', error);
        res.status(500).json({ message: 'Failed to start interview and generate questions.' });
    }
};

// Submit answers and evaluate using AI
export const submitInterview = async (req, res) => {
    try {
        const { sessionId, answers } = req.body; // answers: { [questionId]: "text" }

        const session = await InterviewSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.status === 'completed') {
            return res.status(400).json({ message: 'Interview already submitted' });
        }

        // Batch evaluate all answers for < 3s latency target (Requirement 7.4)
        const batchPrompt = `Act as an expert technical interviewer. Evaluate the following 5 answers for an interview session.
        
        ${session.questions.map((q, idx) => `
        QUESTION ${idx + 1}: ${q.questionText}
        CATEGORY: ${q.category}
        STUDENT ANSWER: ${answers[q._id] || 'No answer provided'}
        `).join('\n\n')}

        Score each answer (0-100) strictly based on these weights:
        1. Keyword Relevance - 30%
        2. Technical Depth - 30%
        3. Logical Structure - 20%
        4. Terminology Usage - 10%
        5. Completeness - 10%

        Return ONLY a JSON array of 5 objects (one for each answer in order) with this format:
        [
          {
            "score": 0-100,
            "feedback": "constructive feedback",
            "missingConcepts": ["concept1", "concept2"],
            "breakdown": {
              "keywordRelevance": 0-100,
              "technicalDepth": 0-100,
              "logicalStructure": 0-100,
              "terminologyUsage": 0-100,
              "completeness": 0-100
            }
          }
        ]`;

        let evaluations;
        try {
            const batchResponse = await generateAIContent(batchPrompt);
            const jsonMatch = batchResponse.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error('Invalid JSON array format');
            evaluations = JSON.parse(jsonMatch[0]);
        } catch (err) {

            console.error('Batch Evaluation error:', err);
            evaluations = session.questions.map(() => ({
                score: 0,
                feedback: 'Evaluation failed',
                missingConcepts: [],
                breakdown: {}
            }));
        }

        // Update session questions with evaluations
        let totalScore = 0;
        session.questions.forEach((q, idx) => {
            const evalData = evaluations[idx] || { score: 0, feedback: 'N/A', missingConcepts: [], breakdown: {} };
            q.userAnswer = answers[q._id] || 'No answer provided';
            q.evaluation = evalData;
            totalScore += evalData.score || 0;
        });

        session.totalScore = Math.round(totalScore / session.questions.length);

        // --- SECTION 8: Unified Career Intelligence Engine ---

        // 8.2 Communication Clarity Index (CCI)
        const allAnswersText = session.questions.map(q => `Q: ${q.questionText}\nA: ${q.userAnswer}`).join('\n\n');
        const cciPrompt = `Act as a communication coach. Evaluate the following interview session for Communication Clarity.
        
        Session Transcript:
        ${allAnswersText}
        
        Evaluate on these 5 dimensions (0-100):
        1. Grammar Accuracy
        2. Logical Sequencing
        3. Concept Articulation
        4. Redundancy Detection (lower is better, but provide a score reflecting "Clarity")
        5. STAR Method Compliance (Situation, Task, Action, Result)
        
        Return ONLY a JSON object with this format:
        {
          "score": global_comm_score,
          "grammarAccuracy": 0-100,
          "logicalSequencing": 0-100,
          "conceptArticulation": 0-100,
          "redundancyDetection": 0-100,
          "starMethodCompliance": 0-100,
          "feedback": "detailed communication feedback"
        }`;

        try {
            const cciResponse = await generateAIContent(cciPrompt);
            const jsonMatch = cciResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('Invalid JSON object format');
            const cciJson = JSON.parse(jsonMatch[0]);


            // CCI Classification (Requirement 8.2)
            let cciClass = 'Needs Improvement';
            if (cciJson.score >= 80) cciClass = 'Excellent';
            else if (cciJson.score >= 60) cciClass = 'Good';
            else if (cciJson.score >= 40) cciClass = 'Fair';

            cciJson.classification = cciClass;
            session.communicationEvaluation = cciJson;
        } catch (e) {
            console.error('CCI Evaluation failed:', e);
        }


        // 8.1 Interview Readiness Score (IRS)
        const user = await User.findById(req.user._id);
        const resumeStrength = user.resumeData?.strengthScore || 50;

        // Categorize performance
        const techScores = session.questions.filter(q => q.category === 'Technical' || q.category === 'System Design').map(q => q.evaluation.score);
        const behavioralScores = session.questions.filter(q => q.category === 'Behavioral').map(q => q.evaluation.score);

        const avgTech = techScores.length > 0 ? techScores.reduce((a, b) => a + b, 0) / techScores.length : session.totalScore;
        const avgBehavioral = behavioralScores.length > 0 ? behavioralScores.reduce((a, b) => a + b, 0) / behavioralScores.length : session.totalScore;

        // Role Skill Match: Derived from keyword relevance across all technical questions
        const roleSkillMatch = session.questions.reduce((acc, q) => acc + (q.evaluation.breakdown?.keywordRelevance || 0), 0) / session.questions.length;
        session.roleAlignmentScore = Math.round(roleSkillMatch);

        const irs = (resumeStrength * 0.20) + (avgTech * 0.40) + (avgBehavioral * 0.20) + (roleSkillMatch * 0.20);
        session.interviewReadinessScore = Math.round(irs);

        // IRS Classification (Requirement 8.1)
        if (session.interviewReadinessScore >= 85) session.irsClassification = 'Highly Ready';
        else if (session.interviewReadinessScore >= 70) session.irsClassification = 'Moderately Ready';
        else if (session.interviewReadinessScore >= 50) session.irsClassification = 'Developing';
        else session.irsClassification = 'Needs Significant Improvement';


        user.interviewReadinessScore = session.interviewReadinessScore;


        // 8.3 Career Readiness Score (CRS)
        const learningMastery = user.topicMastery?.length > 0
            ? user.topicMastery.reduce((acc, t) => acc + t.score, 0) / user.topicMastery.length
            : 0;
        const consistencyScore = user.topicMastery?.length > 0
            ? user.topicMastery.reduce((acc, t) => acc + (t.consistency || 0), 0) / user.topicMastery.length
            : 0;
        const roleAlignment = session.roleAlignmentScore || resumeStrength;

        const crs = (learningMastery * 0.30) + (session.interviewReadinessScore * 0.40) + (consistencyScore * 0.10) + (roleAlignment * 0.20);
        user.careerReadinessScore = Math.round(crs);

        // CRS Classification
        if (user.careerReadinessScore >= 80) user.crsClassification = 'Placement Ready';
        else if (user.careerReadinessScore >= 60) user.crsClassification = 'Developing';
        else user.crsClassification = 'Needs Focus';

        user.irsClassification = session.irsClassification;
        user.cciScore = session.communicationEvaluation?.score || 0;
        user.cciClassification = session.communicationEvaluation?.classification || '';


        // 8.4 Intelligent Feedback & Adaptive Optimization Loop
        const allMissingConcepts = session.questions.flatMap(q => q.evaluation.missingConcepts || []);

        if (allMissingConcepts.length > 0) {
            allMissingConcepts.forEach(concept => {
                // 1. Update Study Plan
                const topicIndex = user.studyPlan.findIndex(t =>
                    t.topic.toLowerCase().includes(concept.toLowerCase()) ||
                    concept.toLowerCase().includes(t.topic.toLowerCase())
                );

                if (topicIndex !== -1) {
                    user.studyPlan[topicIndex].priority = 'high';
                    // Requirement 8.4: Increase revision frequency
                    // If scheduled more than 2 days away, pull it closer to tomorrow/today
                    const today = new Date();
                    const tomorrow = new Date(today.getTime() + 86400000);
                    if (!user.studyPlan[topicIndex].scheduledDate || user.studyPlan[topicIndex].scheduledDate > tomorrow) {
                        user.studyPlan[topicIndex].scheduledDate = tomorrow;
                    }
                } else {
                    user.studyPlan.push({
                        topic: concept,
                        priority: 'high',
                        scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
                        completed: false
                    });
                }


                // 2. Cross-analysis with Topic Mastery (Requirement 8.4)
                const masteryIndex = user.topicMastery?.findIndex(m =>
                    m.topic.toLowerCase().includes(concept.toLowerCase()) ||
                    concept.toLowerCase().includes(m.topic.toLowerCase())
                );

                if (masteryIndex !== -1) {
                    // Force higher risk level if concept is weak in interview
                    user.topicMastery[masteryIndex].riskLevel = 'high';
                    // Slightly nudge mastery score down to trigger practice
                    user.topicMastery[masteryIndex].score = Math.max(0, user.topicMastery[masteryIndex].score - 5);
                }
            });

            // 3. Cross-analysis with Resume gaps & Update Mistake History
            const resumeGaps = user.resumeData?.missingSkills || [];
            allMissingConcepts.forEach(concept => {
                if (resumeGaps.some(gap => gap.toLowerCase().includes(concept.toLowerCase()))) {
                    console.log(`CRITICAL GAP DETECTED: ${concept} is a missing skill on resume AND was weak in interview.`);
                }

                // Update Mistake History (Requirement 8.4)
                const mistakeIndex = user.mistakeHistory?.findIndex(m => m.concept.toLowerCase() === concept.toLowerCase());
                if (mistakeIndex !== -1) {
                    user.mistakeHistory[mistakeIndex].count += 1;
                    user.mistakeHistory[mistakeIndex].lastOccurred = new Date();
                } else {
                    user.mistakeHistory.push({
                        topic: session.category, // Using category as broad topic
                        concept: concept,
                        mistakeType: 'knowledge-gap',
                        count: 1,
                        lastOccurred: new Date()
                    });
                }
            });
        }

        session.status = 'completed';
        session.completedAt = new Date();

        // Generate overall feedback
        const summaryPrompt = `Based on an interview for ${session.role} where the candidate scored ${session.totalScore}/100 and a Communication Score of ${session.communicationEvaluation?.score}/100, 
        provide a concise 2-sentence summary of their performance and top area for improvement.`;

        try {
            session.overallFeedback = await generateAIContent(summaryPrompt);
        } catch (e) {
            session.overallFeedback = "Interview completed. Review individual question feedback for details.";
        }

        // 8.5 Growth Tracking snapshot
        user.readinessHistory.push({
            irs: session.interviewReadinessScore,
            techScore: Math.round(avgTech),
            behavioralScore: Math.round(avgBehavioral),
            cci: session.communicationEvaluation?.score || 0,
            crs: user.careerReadinessScore,
            timestamp: new Date()
        });

        await user.save();
        await session.save();

        res.json(session);
    } catch (error) {
        console.error('Submit Interview Error:', error);
        res.status(500).json({ message: 'Failed to evaluate interview answers.' });
    }
};

// Get session history
export const getHistory = async (req, res) => {
    try {
        const history = await InterviewSession.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('role category difficulty totalScore status createdAt');
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get session report
export const getReport = async (req, res) => {
    try {
        const session = await InterviewSession.findById(req.params.id);
        if (!session || session.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

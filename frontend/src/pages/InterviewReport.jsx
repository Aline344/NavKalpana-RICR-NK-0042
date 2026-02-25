import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import CountUp from 'react-countup';
import {
    Trophy, ChevronRight, LayoutDashboard, Brain,
    CheckCircle, AlertCircle, BarChart3, Star,
    MessageSquare, Target, Lightbulb, ArrowLeft
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const InterviewReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await axios.get(`/api/interview/${id}`);
                setReport(data);
                setLoading(false);
            } catch (err) {
                console.error('Fetch report error:', err);
                navigate('/interview/select');
            }
        };
        fetchReport();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
            <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Analyzing your performance...</p>
        </div>
    );

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-red-400';
    };

    const getIRSClassification = (score) => {
        if (score >= 85) return { text: 'Highly Ready', recommendation: '' };
        if (score >= 70) return { text: 'Moderately Ready', recommendation: '' };
        if (score >= 50) return { text: 'Developing', recommendation: 'Recommend targeted mock interviews' };
        return { text: 'Needs Significant Improvement', recommendation: 'High focus on foundation required' };
    };


    const getCCIClassification = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Improvement';
    };

    return (
        <div className="pt-28 pb-20 min-h-screen px-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-hero-gradient -z-10 opacity-30" />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <Link to="/profile" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mb-4">
                            <ArrowLeft size={16} /> Back to Session History
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
                            Interview <span className="text-primary-400">Analysis</span>
                        </h1>
                        <p className="text-gray-400 mt-2">{report.role} • {report.category} • {report.difficulty}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/interview/select" className="btn-secondary flex items-center gap-2 !py-3 !px-6">
                            New Session <ChevronRight size={16} />
                        </Link>
                        <Link to="/dashboard" className="btn-primary flex items-center gap-2 !py-3 !px-6">
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                    </div>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Score (IRS) */}
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}
                        className="lg:col-span-1 glass-strong border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
                    >
                        <div className="absolute top-4 right-4">
                            <Trophy size={20} className="text-amber-400" />
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Interview Readiness Score</p>
                        <div className={`text-7xl font-display font-black ${getScoreColor(report.interviewReadinessScore)}`}>
                            <CountUp end={report.interviewReadinessScore} duration={2} />
                            <span className="text-3xl text-gray-600">/100</span>
                        </div>
                        <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                            {getIRSClassification(report.interviewReadinessScore).text}
                        </div>
                        {getIRSClassification(report.interviewReadinessScore).recommendation && (
                            <div className="mt-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 font-medium">
                                <span className="flex items-center gap-2 justify-center">
                                    <Lightbulb size={14} /> {getIRSClassification(report.interviewReadinessScore).recommendation}
                                </span>
                            </div>
                        )}
                        <p className="text-gray-300 mt-6 font-medium leading-relaxed italic text-sm">
                            "{report.overallFeedback}"
                        </p>

                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
                    </motion.div>

                    {/* Communication Clarity Index (CCI) */}
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.15 }}
                        className="lg:col-span-1 glass border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 text-primary-400">
                                <MessageSquare size={16} /> Communication Clarity
                            </h3>
                            <span className={`text-[10px] font-bold ${getScoreColor(report.communicationEvaluation?.score)}`}>
                                {getCCIClassification(report.communicationEvaluation?.score)}
                            </span>
                        </div>

                        <div className="flex-1 space-y-4">
                            {[
                                { label: 'Grammar', score: report.communicationEvaluation?.grammarAccuracy || 0 },
                                { label: 'Logic', score: report.communicationEvaluation?.logicalSequencing || 0 },
                                { label: 'Articulation', score: report.communicationEvaluation?.conceptArticulation || 0 },
                                { label: 'Conciseness', score: report.communicationEvaluation?.redundancyDetection || 0 },
                                { label: 'STAR Method', score: report.communicationEvaluation?.starMethodCompliance || 0 },
                            ].map((met, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase mb-1">
                                        <span>{met.label}</span>
                                        <span className="text-gray-300">{met.score}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${met.score}%` }}
                                            className="h-full bg-primary-500/50"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5">
                            <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3 italic">
                                "{report.communicationEvaluation?.feedback}"
                            </p>
                        </div>
                    </motion.div>

                    {/* Dimensions Breakdown */}
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
                        className="lg:col-span-1 glass border border-white/10 rounded-3xl p-8"
                    >
                        <h3 className="text-sm font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-widest text-accent-400">
                            <BarChart3 size={18} /> Readiness Dimensions
                        </h3>

                        <div className="space-y-6">
                            {[
                                { label: 'Keyword Relevance', score: report.questions.reduce((acc, q) => acc + (q.evaluation.breakdown?.keywordRelevance || 0), 0) / report.questions.length, color: 'from-violet-500 to-indigo-500' },
                                { label: 'Technical Depth', score: report.questions.reduce((acc, q) => acc + (q.evaluation.breakdown?.technicalDepth || 0), 0) / report.questions.length, color: 'from-fuchsia-500 to-pink-500' },
                                { label: 'Structural Logic', score: report.questions.reduce((acc, q) => acc + (q.evaluation.breakdown?.logicalStructure || 0), 0) / report.questions.length, color: 'from-cyan-500 to-blue-500' },
                            ].map((dim, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[11px] text-gray-400 font-bold uppercase">{dim.label}</span>
                                        <span className="text-xs font-mono text-white">{Math.round(dim.score || 0)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${dim.score}%` }}
                                            className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Detailed Review */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 ml-1">
                        <MessageSquare size={20} className="text-primary-400" />
                        Detailed Session Review
                    </h3>

                    {report.questions.map((q, idx) => (
                        <motion.div
                            key={idx}
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                            className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.05] transition-all"
                        >
                            <div className="p-6 sm:p-8 bg-white/[0.02] border-b border-white/5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-start gap-4">
                                        <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-xs font-bold text-primary-400 flex-shrink-0">
                                            Q{idx + 1}
                                        </span>
                                        <h4 className="text-lg font-bold text-white leading-relaxed">{q.questionText}</h4>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(q.evaluation.score).replace('text', 'bg-opacity-10 bg').replace('text', 'border')} ${getScoreColor(q.evaluation.score)}`}>
                                        {q.evaluation.score}%
                                    </div>
                                </div>
                                <div className="ml-12">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Your Answer</p>
                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                        {q.userAnswer || 'No answer provided'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle size={14} className="text-emerald-400" />
                                        <h5 className="text-sm font-bold text-white uppercase tracking-wider">Evaluation & Feedback</h5>
                                    </div>
                                    <p className="text-gray-400 text-sm italic leading-relaxed">
                                        "{q.evaluation.feedback}"
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertCircle size={14} className="text-amber-400" />
                                        <h5 className="text-sm font-bold text-white uppercase tracking-wider">Missing Concepts</h5>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {q.evaluation.missingConcepts && q.evaluation.missingConcepts.length > 0 ? (
                                            q.evaluation.missingConcepts.map((concept, ci) => (
                                                <span key={ci} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-400 font-medium">
                                                    {concept}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-600">No major gaps identified.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InterviewReport;

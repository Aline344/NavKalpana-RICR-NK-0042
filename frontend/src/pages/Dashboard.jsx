import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Brain, TrendingUp, FileText, Code2, AlertTriangle, CheckCircle, Clock, CalendarDays, Trophy, Rocket, Flame, BookOpen, Sparkles, Zap, GraduationCap, ArrowLeft, ArrowRight, Play, LineChart as ChartIcon, Activity, MessageSquare, Settings, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { DashboardSkeleton } from '../components/LoadingSkeletons';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [masteryPage, setMasteryPage] = useState(1);
    const [activityPage, setActivityPage] = useState(1);
    const [planPage, setPlanPage] = useState(1);
    const [assignmentPage, setAssignmentPage] = useState(1);
    const limits = { mastery: 3, activity: 4, plan: 3, assignments: 3 };

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin');
            return;
        }
        const fetch = async () => {
            try {
                const { data: d } = await axios.get('/api/dashboard/stats');
                setData(d);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError('Failed to load dashboard statistics. Please try again later.');
            }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return <DashboardSkeleton />;

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
            <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-center mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
        </div>
    );

    if (!data) return null;

    const { stats, topicMastery, heatmap, recommendedProjects, highRiskTopics, performanceTrend, upcomingQuiz, pendingAssignments, studyPlan, recentActivity } = data;
    const gc = (s) => s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-red-400';
    const gb = (s) => s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500';
    const riskC = (r) => r === 'high' ? 'text-red-400' : r === 'moderate' ? 'text-amber-400' : 'text-emerald-400';
    const riskBg = (r) => r === 'high' ? 'bg-red-500/20 border-red-500/30' : r === 'moderate' ? 'bg-amber-500/20 border-amber-500/30' : 'bg-emerald-500/20 border-emerald-500/30';

    const getIRSClassification = (score) => {
        if (score >= 85) return { text: 'Highly Ready', color: 'text-emerald-400', bg: 'bg-emerald-500/20', rec: '' };
        if (score >= 70) return { text: 'Moderately Ready', color: 'text-blue-400', bg: 'bg-blue-500/20', rec: '' };
        if (score >= 50) return { text: 'Developing', color: 'text-amber-400', bg: 'bg-amber-500/20', rec: 'Recommend Targeted Mock Interviews' };
        return { text: 'Improvement Needed', color: 'text-red-400', bg: 'bg-red-500/20', rec: 'Focus on core concepts' };
    };

    const getCCIClassification = (score) => {
        if (score >= 80) return { text: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
        if (score >= 60) return { text: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' };
        if (score >= 40) return { text: 'Fair', color: 'text-amber-400', bg: 'bg-amber-500/20' };
        return { text: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500/20' };
    };



    const trendData = (data.readinessHistory || []).map(h => ({
        time: new Date(h.timestamp).toLocaleDateString(),
        irs: h.irs,
        crs: h.crs,
        cci: h.cci,
        tech: h.techScore,
        beh: h.behavioralScore
    }));

    const radarData = (data.topicMastery || []).map(t => ({
        topic: t.topic,
        mastery: t.score,
        fullMark: 100
    }));

    return (
        <div className="pt-32 pb-10 min-h-screen">
            <div className="absolute inset-0 bg-hero-gradient -z-10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                    {/* Header */}
                    <motion.div variants={fadeUp} className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                                Welcome, <span className="gradient-text">{data.user.name}</span>
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">Target: {data.user.targetRole}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => navigate('/profile')} className="btn-secondary !py-2 !px-4 flex items-center gap-2 text-xs">
                                <Settings size={14} /> Profile
                            </button>
                        </div>
                    </motion.div>

                    {/* Quick Action Pad - "All in One Place" (Unified Section) */}
                    <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Mock Interview', icon: <Play size={18} />, path: '/interview/select', color: 'from-accent-500 to-accent-600', shadow: 'shadow-accent-500/20' },
                            { label: 'Analyze Resume', icon: <FileText size={18} />, path: '/resume', color: 'from-primary-500 to-primary-600', shadow: 'shadow-primary-500/20' },
                            { label: 'Quick Quiz', icon: <Brain size={18} />, path: '/quiz', color: 'from-cyber-500 to-cyber-600', shadow: 'shadow-cyber-500/20' },
                            { label: 'Assignments', icon: <Code2 size={18} />, path: '/assignment', color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(action.path)}
                                className={`flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${action.color} ${action.shadow} shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all group`}
                            >
                                <div className="text-white group-hover:rotate-12 transition-transform">{action.icon}</div>
                                <span className="text-sm font-bold text-white tracking-wide">{action.label}</span>
                            </button>
                        ))}
                    </motion.div>


                    {/* Stats */}
                    <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Career Readiness Score - Primary Highlight */}
                        <div className="lg:col-span-1 glass-strong p-8 rounded-3xl border border-primary-500/20 relative overflow-hidden flex flex-col items-center justify-center text-center">
                            <div className="absolute top-4 right-4 text-primary-400 opacity-30"><Rocket size={24} /></div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Career Readiness Score</p>
                            <div className={`text-6xl font-display font-black leading-none ${gc(stats.careerReadinessScore)}`}>
                                {stats.careerReadinessScore}%
                            </div>
                            <div className="mt-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 tracking-wider">
                                {stats.crsClassification || (stats.careerReadinessScore >= 80 ? 'Placement Ready' : stats.careerReadinessScore >= 60 ? 'Developing' : 'Needs Focus')}
                            </div>

                            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
                        </div>

                        {/* Secondary Readiness Metrics */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {/* Interview Readiness - 8.1 */}
                            <div className="glass border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-400">
                                        <Zap size={16} />
                                    </div>
                                    <p className="text-xl font-display font-black text-accent-400">{stats.interviewReadinessScore}%</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-white uppercase tracking-widest mb-2 px-1">Interview Readiness</p>
                                    <div className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full text-center ${getIRSClassification(stats.interviewReadinessScore).bg} ${getIRSClassification(stats.interviewReadinessScore).color}`}>
                                        {getIRSClassification(stats.interviewReadinessScore).text}
                                    </div>
                                </div>
                            </div>

                            {/* Communication Clarity - 8.2 */}
                            <div className="glass border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary-400">
                                        <MessageSquare size={16} />
                                    </div>
                                    <p className="text-xl font-display font-black text-primary-400">{data.stats.cciScore || 0}%</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-white uppercase tracking-widest mb-2 px-1">Comm. Clarity (CCI)</p>
                                    <div className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full text-center ${getCCIClassification(data.stats.cciScore || 0).bg} ${getCCIClassification(data.stats.cciScore || 0).color}`}>
                                        {getCCIClassification(data.stats.cciScore || 0).text}
                                    </div>
                                </div>
                            </div>

                            {/* Resume Strength - Unified Asset */}
                            <div className="glass border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
                                        <FileText size={16} />
                                    </div>
                                    <p className="text-xl font-display font-black text-emerald-400">{stats.resumeStrength}%</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-white uppercase tracking-widest mb-2 px-1">Resume Strength</p>
                                    <div className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full text-center ${gb(stats.resumeStrength).replace('bg', 'bg-opacity-20 bg')} ${gc(stats.resumeStrength)}`}>
                                        {stats.resumeStrength >= 80 ? 'Market Ready' : stats.resumeStrength >= 60 ? 'Competitive' : 'Developing'}
                                    </div>
                                </div>
                            </div>

                            {[
                                { label: 'Learning Mastery', value: `${stats.overallMastery}%`, icon: <Brain size={16} />, color: 'text-cyber-400', sub: 'Topic Mastery' },
                            ].map((s, i) => (
                                <div key={i} className="glass border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${s.color}`}>
                                            {s.icon}
                                        </div>
                                        <p className={`text-xl font-display font-black ${s.color}`}>{s.value}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-white uppercase tracking-widest">{s.label}</p>
                                        <p className="text-[8px] text-gray-600 font-mono mt-0.5">{s.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Topic Mastery */}
                            <motion.div variants={fadeUp} className="glass-strong p-6 rounded-2xl">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><GraduationCap size={16} className="text-primary-400" /> Topic Mastery</h2>
                                <div className="space-y-4">
                                    {topicMastery.slice((masteryPage - 1) * limits.mastery, masteryPage * limits.mastery).map((t, i) => (
                                        <div key={i} className="glass p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                                            onClick={() => navigate('/quiz')}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl glass-strong flex items-center justify-center ${gc(t.score)} shadow-lg`}>
                                                        <BookOpen size={18} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white text-sm font-bold group-hover:text-primary-400 transition-colors">{t.topic}</h3>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className={`text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold ${riskBg(t.riskLevel)}`}>
                                                                <span className={riskC(t.riskLevel)}>{t.riskLevel} Risk</span>
                                                            </span>
                                                            <span className="text-[9px] text-gray-500 font-mono italic">Attempts: {t.attempts}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-xl font-display font-bold ${gc(t.score)}`}>{t.score}%</p>
                                                    <p className="text-[9px] text-gray-600 font-mono">Mastery</p>
                                                </div>
                                            </div>
                                            <div className="progress-bar h-1.5 mb-3"><div className={`progress-fill ${gb(t.score)} shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]`} style={{ width: `${t.score}%` }} /></div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="glass p-2 rounded-lg text-center">
                                                    <p className="text-[9px] text-gray-500 mb-0.5 uppercase tracking-tighter">Quiz</p>
                                                    <p className={`text-xs font-bold ${gc(t.quizAvg)}`}>{t.quizAvg}%</p>
                                                </div>
                                                <div className="glass p-2 rounded-lg text-center">
                                                    <p className="text-[9px] text-gray-500 mb-0.5 uppercase tracking-tighter">Assign</p>
                                                    <p className={`text-xs font-bold ${gc(t.assignmentAvg)}`}>{t.assignmentAvg}%</p>
                                                </div>
                                                <div className="glass p-2 rounded-lg text-center">
                                                    <p className="text-[9px] text-gray-500 mb-0.5 uppercase tracking-tighter">Daily</p>
                                                    <p className={`text-xs font-bold ${gc(t.consistency)}`}>{t.consistency}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {topicMastery.length > limits.mastery && (
                                    <div className="flex justify-end items-center gap-3 mt-4">
                                        <button disabled={masteryPage === 1} onClick={() => setMasteryPage(p => p - 1)} className="p-1.5 glass rounded-lg disabled:opacity-30 hover:bg-white/10 transition-all text-white"><ArrowLeft size={14} /></button>
                                        <span className="text-[10px] text-gray-500 font-mono">Page {masteryPage}/{Math.ceil(topicMastery.length / limits.mastery)}</span>
                                        <button disabled={masteryPage >= Math.ceil(topicMastery.length / limits.mastery)} onClick={() => setMasteryPage(p => p + 1)} className="p-1.5 glass rounded-lg disabled:opacity-30 hover:bg-white/10 transition-all text-white"><ArrowRight size={14} /></button>
                                    </div>
                                )}
                                <p className="text-[10px] text-gray-600 mt-3 font-mono">Score = (Quiz×0.50) + (Assignment×0.30) + (Consistency×0.20)</p>
                            </motion.div>

                            {/* Mastery Heatmap (Requirement 6.5) */}
                            <motion.div variants={fadeUp} className="glass-strong p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Sparkles size={16} className="text-accent-400" /> Mastery Heatmap</h2>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(l => (
                                            <div key={l} className={`w-3 h-3 rounded-sm ${l === 4 ? 'bg-emerald-500' : l === 3 ? 'bg-amber-500' : l === 2 ? 'bg-orange-500' : 'bg-red-500'} opacity-40`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                    {heatmap.map((h, i) => (
                                        <div key={i} className="group relative glass p-3 rounded-xl border-l-4 transition-all hover:scale-105"
                                            style={{ borderLeftColor: h.level === 4 ? '#10b981' : h.level === 3 ? '#fbbf24' : h.level === 2 ? '#f59e0b' : '#ef4444' }}>
                                            <p className="text-[10px] text-gray-500 truncate mb-1.5 uppercase font-mono">{h.topic}</p>
                                            <div className="flex items-end gap-1 mb-1">
                                                <div className="flex-1 h-1.5 glass rounded-full overflow-hidden">
                                                    <div className={`h-full ${h.level === 4 ? 'bg-emerald-500' : h.level === 3 ? 'bg-amber-500' : h.level === 2 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${h.mastery}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-white leading-none">{h.mastery}%</span>
                                            </div>
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                                        </div>
                                    ))}
                                    {heatmap.length === 0 && <p className="col-span-full text-center text-xs text-gray-600 py-8 italic font-mono">No data points yet...</p>}
                                </div>
                            </motion.div>

                            {/* Performance Trend */}
                            <motion.div variants={fadeUp} className="glass-strong p-6 rounded-2xl">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-cyber-400" /> Trend</h2>
                                <div className="flex items-end gap-1.5 h-36">
                                    {performanceTrend.map((s, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 glass px-2 py-0.5 rounded text-[10px] text-white z-10">{s.score}%</div>
                                            <div className={`w-full rounded-t ${gb(s.score)} transition-all`} style={{ height: `${s.score * 1.3}px` }} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Recent Activity (Moved below Trend) */}
                            <motion.div variants={fadeUp} className="glass-strong p-5 rounded-2xl">
                                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Rocket size={14} className="text-accent-400" /> Recent Activity</h2>
                                <div className="space-y-2">
                                    {recentActivity?.slice((activityPage - 1) * limits.activity, activityPage * limits.activity).map((a, i) => (
                                        <div key={i} className="flex items-center justify-between glass p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                                            onClick={() => a.type === 'quiz' && navigate(`/quiz/${a.id || a._id}`)}>
                                            <div className="flex items-center gap-2">
                                                {a.type === 'quiz' ? <Zap size={12} className="text-accent-400" /> : <Code2 size={12} className="text-cyber-400" />}
                                                <div><p className="text-xs text-white">{a.title}</p><p className="text-[10px] text-gray-500">{new Date(a.date).toLocaleDateString()}</p></div>
                                            </div>
                                            <span className={`text-sm font-bold ${gc(a.score)}`}>{a.score}%</span>
                                        </div>
                                    ))}
                                </div>
                                {recentActivity?.length > limits.activity && (
                                    <div className="flex justify-between items-center mt-4">
                                        <button disabled={activityPage === 1} onClick={() => setActivityPage(p => p - 1)} className="btn-secondary !py-1 !px-2 disabled:opacity-0"><ArrowLeft size={12} /></button>
                                        <span className="text-[10px] text-gray-500">History {activityPage}/{Math.ceil(recentActivity.length / limits.activity)}</span>
                                        <button disabled={activityPage >= Math.ceil(recentActivity.length / limits.activity)} onClick={() => setActivityPage(p => p + 1)} className="btn-secondary !py-1 !px-2 disabled:opacity-0"><ArrowRight size={12} /></button>
                                    </div>
                                )}
                            </motion.div>

                            {/* Readiness Insights (Requirement 8.1 - 8.3) */}
                            <motion.div variants={fadeUp} className="glass-strong p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                <h2 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
                                    <Sparkles size={16} className="text-primary-400" /> Readiness Insights
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="glass p-5 rounded-2xl bg-white/[0.02]">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Placement Status</span>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            </div>
                                            <h3 className="text-xl font-display font-black text-white mb-2">
                                                {stats.crsClassification || (stats.careerReadinessScore >= 85 ? 'Placement Ready' : stats.careerReadinessScore >= 70 ? 'Target Achievable' : stats.careerReadinessScore >= 50 ? 'Developing' : 'Action Required')}
                                            </h3>

                                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                                Your overall Career Readiness is calculated using Learning Mastery, Interview performance, and Resume alignment.
                                            </p>
                                        </div>

                                        {/* Knowledge Gaps from Interview (Requirement 8.4) */}
                                        {data.criticalGaps && data.criticalGaps.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-2 px-1">
                                                    <AlertTriangle size={12} /> Recurring Knowledge Gaps
                                                </h4>
                                                <div className="space-y-2">
                                                    {data.criticalGaps.map((gap, i) => (
                                                        <div key={i} className="flex items-center justify-between glass p-3 rounded-xl border border-red-500/10 hover:bg-red-500/5 transition-all">
                                                            <div className="flex flex-col">
                                                                <span className="text-[11px] font-bold text-white">{gap.concept}</span>
                                                                <span className="text-[9px] text-gray-500">{gap.topic}</span>
                                                            </div>
                                                            <span className="text-[10px] font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                                                                {gap.count} Fixes Needed
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Readiness Breakdown</h4>
                                        <div className="space-y-5">
                                            {[
                                                { label: 'Learning Mastery', weight: '30%', score: stats.overallMastery, info: 'Based on Quiz & Assignment scores' },
                                                { label: 'Interview Readiness', weight: '40%', score: stats.interviewReadinessScore, info: 'Based on recent mock interview performance' },
                                                { label: 'Consistency', weight: '10%', score: stats.avgQuizScore, info: 'Based on daily engagement and practice' },
                                                { label: 'Role Alignment', weight: '20%', score: stats.resumeStrength, info: 'Based on Resume match with target role' },
                                            ].map((item, i) => (
                                                <div key={i} className="group cursor-default">
                                                    <div className="flex justify-between text-[11px] mb-2 px-0.5">
                                                        <span className="text-gray-400 font-bold uppercase group-hover:text-white transition-colors">{item.label} <span className="text-[8px] text-gray-600 font-normal">({item.weight})</span></span>
                                                        <span className={`font-mono font-bold ${gc(item.score)}`}>{item.score}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div className={`h-full ${gb(item.score)} opacity-80`} style={{ width: `${item.score}%` }} />
                                                    </div>
                                                    <p className="text-[8px] text-gray-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{item.info}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 8.5: Recommended Targeted Mock Interviews */}
                                {data.recommendedInterviews?.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-white/5">
                                        <h4 className="text-[10px] text-primary-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Sparkles size={12} /> Recommended Targeted Interviews
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {data.recommendedInterviews.map((interview, idx) => (
                                                <div key={idx} className="glass p-4 rounded-xl border border-primary-500/10 hover:border-primary-500/30 transition-all group">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                                <Zap size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-white group-hover:text-primary-400 transition-colors">{interview.role}</p>
                                                                <p className="text-[10px] text-gray-500">Focus: {interview.focusTopic}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => navigate(`/interview/select?role=${encodeURIComponent(interview.role)}&skill=${encodeURIComponent(interview.focusTopic)}`)}
                                                            className="text-[10px] font-bold text-primary-400 hover:text-white transition-colors flex items-center gap-1"
                                                        >
                                                            {interview.cta} <Play size={8} fill="currentColor" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] px-2 py-0.5 glass rounded bg-dark-800/50 text-gray-400">Level {interview.difficulty}</span>
                                                        <span className="text-[9px] text-gray-600 italic">Targeted Skill Bridge</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl -z-10" />
                            </motion.div>

                            {/* Section 8.5: Growth Tracking & Trend Analysis */}
                            <motion.div variants={fadeUp} className="glass-strong p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Activity size={100} className="text-primary-500" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
                                    <div>
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <TrendingUp size={18} className="text-cyber-400" /> Growth & Trend Analysis
                                        </h2>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">
                                            Closed Loop: Learn <ArrowRight size={8} className="inline mx-1" /> Test <ArrowRight size={8} className="inline mx-1" /> Evaluate <ArrowRight size={8} className="inline mx-1" /> Adjust <ArrowRight size={8} className="inline mx-1" /> Improve
                                        </p>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="text-right">
                                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Improvement</p>
                                            <div className="flex items-center justify-end gap-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${data.growthStats?.improvementPercentage >= 0 ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                                                <p className={`text-xl font-black ${data.growthStats?.improvementPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {data.growthStats?.improvementPercentage >= 0 ? '+' : ''}{data.growthStats?.improvementPercentage}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right border-l border-white/10 pl-6">
                                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Stability</p>
                                            <div className="flex items-center justify-end gap-1">
                                                <p className="text-xl font-black text-primary-400">{data.growthStats?.stabilityIndex}%</p>
                                                <ChartIcon size={12} className="text-primary-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                                    {/* Line Chart: Readiness over time */}
                                    <div className="xl:col-span-3 h-[300px] glass p-4 rounded-xl">
                                        <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Readiness Trends</h3>
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                            <LineChart data={trendData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                                                    itemStyle={{ padding: '2px 0' }}
                                                />
                                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }} />
                                                <Line type="monotone" dataKey="crs" name="Career Readiness" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" dataKey="irs" name="Interview Readiness" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                                                <Line type="monotone" dataKey="tech" name="Technical" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                                                <Line type="monotone" dataKey="beh" name="Behavioral" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                                                <Line type="monotone" dataKey="cci" name="Communication" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Radar Chart: Skill Gap Evolution */}
                                    <div className="xl:col-span-2 h-[300px] glass p-4 rounded-xl">
                                        <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Skill Gap Evolution</h3>
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                                <PolarGrid stroke="#ffffff10" />
                                                <PolarAngleAxis dataKey="topic" tick={{ fill: '#666', fontSize: 10 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="Mastery" dataKey="mastery" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Professional Identity & Skill Inventory - "All Dashboard in One Place" */}
                            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="glass-strong p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center border border-primary-500/30 text-primary-400">
                                            <Sparkles size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Skill Inventory</h3>
                                            <p className="text-[10px] text-gray-500">Current professional assets</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(data.user.skills || []).map((s, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-default">
                                                {s}
                                            </span>
                                        ))}
                                        {data.user.skills?.length === 0 && <p className="text-xs text-gray-600 italic">No skills added yet.</p>}
                                    </div>
                                    <button onClick={() => navigate('/profile')} className="mt-6 text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-widest flex items-center gap-2">
                                        Manage Skills <ArrowRight size={10} />
                                    </button>
                                </div>

                                <div className="glass-strong p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center border border-accent-500/30 text-accent-400">
                                            <Target size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Development Gaps</h3>
                                            <p className="text-[10px] text-gray-500">Missing resume skills & critical gaps</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {[...(stats.missingSkills || []), ...(data.criticalGaps || []).map(g => g.topic)].map((g, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-xl bg-accent-500/5 border border-accent-500/10 text-[11px] font-bold text-accent-400/80">
                                                {typeof g === 'string' ? g : g.topic}
                                            </span>
                                        ))}
                                        {(!stats.missingSkills?.length && !data.criticalGaps?.length) && <p className="text-xs text-emerald-400 italic">No gaps detected!</p>}
                                    </div>
                                    <button onClick={() => navigate('/resume')} className="mt-6 text-[10px] font-bold text-accent-400 hover:text-accent-300 uppercase tracking-widest flex items-center gap-2">
                                        Check Resume Alignment <ArrowRight size={10} />
                                    </button>
                                </div>
                            </motion.div>
                        </div>


                        <div className="space-y-6">
                            {/* Risk Topics */}
                            <motion.div variants={fadeUp} className="glass-strong p-5 rounded-2xl">
                                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><AlertTriangle size={14} className="text-red-400" /> Risk Topics</h2>
                                {highRiskTopics.length > 0 ? (
                                    <div className="space-y-2">{highRiskTopics.map((t, i) => (
                                        <div key={i} className="flex items-center justify-between glass p-3 rounded-xl border border-red-500/20">
                                            <span className="text-sm text-white flex items-center gap-2"><Flame size={12} className="text-red-400" />{t}</span>
                                            <button onClick={() => navigate('/quiz')} className="text-xs text-primary-400 hover:underline">Practice</button>
                                        </div>
                                    ))}</div>
                                ) : <p className="text-sm text-emerald-400 flex items-center gap-2"><CheckCircle size={14} /> All clear!</p>}
                            </motion.div>

                            {/* Upcoming Adaptive Quiz (Requirement 6.5) */}
                            <motion.div variants={fadeUp} className="glass-strong p-5 rounded-2xl border-l-4 border-accent-500">
                                <h2 className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2"><Zap size={14} className="text-accent-400" /> Adaptive Quiz</div>
                                    <span className="text-[10px] text-accent-400 uppercase font-bold px-2 py-0.5 glass rounded-full animate-pulse">Live</span>
                                </h2>
                                <div className="glass p-4 rounded-xl border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/10 blur-3xl rounded-full -mr-12 -mt-12" />
                                    <div className="relative z-10 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs text-accent-400 font-mono mb-1">Recommended for today:</p>
                                            <h3 className="text-lg font-display font-bold text-white mb-2">{upcomingQuiz.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] px-2 py-0.5 glass rounded bg-dark-800/50 text-gray-400">{upcomingQuiz.topic}</span>
                                                <span className={`text-[10px] font-bold uppercase ${upcomingQuiz.priority === 'high' ? 'text-red-400' : 'text-amber-400'}`}>{upcomingQuiz.priority} Priority</span>
                                            </div>
                                        </div>
                                        <button onClick={() => navigate('/quiz')} className="btn-primary !p-3 rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] hover:scale-105 active:scale-95 transition-all">
                                            <Play size={20} className="fill-current" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Pending Assignments (Requirement 6.5) */}
                            <motion.div variants={fadeUp} className="glass-strong p-5 rounded-2xl">
                                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Clock size={14} className="text-cyber-400" /> Pending Assignments</h2>
                                <div className="space-y-2">
                                    {pendingAssignments.slice((assignmentPage - 1) * limits.assignments, assignmentPage * limits.assignments).map((a, i) => (
                                        <div key={i} className="flex items-center justify-between glass p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                                            onClick={() => navigate('/assignment')}>
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-cyber-500/10 text-cyber-400'}`}>
                                                    <Code2 size={14} />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-xs font-bold text-white truncate group-hover:text-cyber-400 transition-colors">{a.title}</p>
                                                    <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1"><CalendarDays size={10} /> Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${a.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-cyber-500/20 text-cyber-400'}`}>{a.priority}</span>
                                        </div>
                                    ))}
                                    {pendingAssignments.length === 0 && <p className="text-xs text-gray-500 italic text-center py-4">No pending assignments! 🎉</p>}
                                </div>
                                {pendingAssignments.length > limits.assignments && (
                                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                                        <button disabled={assignmentPage === 1} onClick={() => setAssignmentPage(p => p - 1)} className="text-gray-500 disabled:opacity-0 hover:text-white"><ArrowLeft size={12} /></button>
                                        <span className="text-[9px] text-gray-600 font-mono">Page {assignmentPage}/{Math.ceil(pendingAssignments.length / limits.assignments)}</span>
                                        <button disabled={assignmentPage >= Math.ceil(pendingAssignments.length / limits.assignments)} onClick={() => setAssignmentPage(p => p + 1)} className="text-gray-500 disabled:opacity-0 hover:text-white"><ArrowRight size={12} /></button>
                                    </div>
                                )}
                            </motion.div>

                            {/* Recommended Mini Projects (Requirement 6.5) */}
                            <motion.div variants={fadeUp} className="glass-strong p-5 rounded-2xl border-t-2 border-accent-500/30">
                                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Rocket size={14} className="text-accent-400" /> Recommended Projects</h2>
                                <div className="space-y-2">{recommendedProjects.map((p, i) => (
                                    <div key={i} className="glass p-3 rounded-xl border border-white/5 hover:border-accent-500/30 transition-all cursor-pointer" onClick={() => navigate('/assignment')}>
                                        <p className="text-xs font-bold text-white mb-0.5">{p.title}</p>
                                        <p className="text-[10px] text-gray-500 line-clamp-1">{p.description}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[9px] bg-dark-800 text-gray-400 px-1.5 py-0.5 rounded">{p.topic}</span>
                                            <span className="text-[9px] text-accent-400 flex items-center gap-1"><Clock size={9} /> {p.estimatedTime}</span>
                                        </div>
                                    </div>
                                ))}</div>
                            </motion.div>

                            {/* Study Plan */}
                            <motion.div variants={fadeUp} className="glass-strong p-5 rounded-2xl">
                                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><CalendarDays size={14} className="text-primary-400" /> Study Plan</h2>
                                <div className="space-y-2">
                                    {studyPlan.slice((planPage - 1) * limits.plan, planPage * limits.plan).map((s, i) => (
                                        <div key={i} className="flex items-center justify-between glass p-3 rounded-xl">
                                            <span className="text-sm text-white flex items-center gap-2"><BookOpen size={12} className={s.priority === 'high' ? 'text-red-400' : 'text-amber-400'} />{s.topic}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{s.priority}</span>
                                        </div>
                                    ))}
                                </div>
                                {studyPlan.length > limits.plan && (
                                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/5">
                                        <button disabled={planPage === 1} onClick={() => setPlanPage(p => p - 1)} className="text-gray-500 disabled:opacity-0 hover:text-white transition-all"><ArrowLeft size={14} /></button>
                                        <span className="text-[10px] text-gray-600 font-mono italic">View {planPage * limits.plan < studyPlan.length ? `more...` : `end`}</span>
                                        <button disabled={planPage >= Math.ceil(studyPlan.length / limits.plan)} onClick={() => setPlanPage(p => p + 1)} className="text-gray-500 disabled:opacity-0 hover:text-white transition-all"><ArrowRight size={14} /></button>
                                    </div>
                                )}
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;

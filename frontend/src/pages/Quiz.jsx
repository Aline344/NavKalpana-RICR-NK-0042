import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Zap, Play, History, Clock, Trophy, BarChart3, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { ListSkeleton, NeuralLoading } from '../components/LoadingSkeletons';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Quiz = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const roleSkills = {
        'Frontend Developer': ['JavaScript', 'React', 'HTML/CSS', 'TypeScript', 'Redux', 'System Design'],
        'Backend Developer': ['Node.js', 'SQL', 'MongoDB', 'Python', 'Redis', 'Docker', 'System Design'],
        'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'System Design'],
        'Data Scientist': ['Python', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'Statistics'],
        'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Python'],
        'Mobile Developer': ['React Native', 'Swift', 'Kotlin', 'JavaScript', 'Mobile UI'],
        'Product Manager': ['Agile', 'Product Strategy', 'User Research', 'Analytics', 'Market Analysis'],
        'UX Designer': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Visual Design']
    };
    const roles = Object.keys(roleSkills);

    const [selectedRole, setSelectedRole] = useState(user?.targetRole || 'Frontend Developer');
    const [topic, setTopic] = useState(roleSkills[user?.targetRole || 'Frontend Developer']?.[0] || 'JavaScript');
    const [difficulty, setDifficulty] = useState(3);
    const [numQuestions, setNumQuestions] = useState(8);
    const [generating, setGenerating] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/quiz/results');
            setHistory(data);
        } catch {
            setHistory([
                { _id: 'demo1', title: 'JavaScript Adaptive Quiz', topic: 'JavaScript', score: 78, totalQuestions: 8, difficulty: 3, status: 'completed', completedAt: new Date().toISOString() },
                { _id: 'demo2', title: 'React Adaptive Quiz', topic: 'React', score: 65, totalQuestions: 8, difficulty: 2, status: 'completed', completedAt: new Date(Date.now() - 86400000).toISOString() },
                { _id: 'demo3', title: 'Node.js Adaptive Quiz', topic: 'Node.js', score: 85, totalQuestions: 10, difficulty: 4, status: 'completed', completedAt: new Date(Date.now() - 172800000).toISOString() },
            ]);
        }
        setLoadingHistory(false);
    };

    const handleGenerateQuiz = async () => {
        setGenerating(true);
        try {
            const { data } = await axios.post('/api/quiz/generate', { topic, difficulty, numQuestions });
            navigate(`/quiz/${data._id}`);
        } catch {
            navigate(`/quiz/demo`);
        }
        setGenerating(false);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-red-400';
    };

    const getDifficultyLabel = (d) => ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'][d] || 'Medium';
    const getDifficultyColor = (d) => {
        if (d <= 2) return 'badge-success';
        if (d <= 3) return 'badge-warning';
        return 'badge-danger';
    };

    const getRecommendations = () => {
        if (!user) return [];
        const recs = [];

        // Weak topics from mastery
        (user.topicMastery || []).filter(t => t.score < 60).forEach(t => {
            recs.push({
                topic: t.topic,
                reason: `Score is low (${t.score}%)`,
                type: 'mastery',
                difficulty: Math.max(1, Math.floor(t.score / 20))
            });
        });

        // Resume gaps
        (user.resumeData?.missingSkills || []).slice(0, 2).forEach(s => {
            recs.push({
                topic: s,
                reason: 'Missing in Resume',
                type: 'resume',
                difficulty: 2
            });
        });

        // Mistake patterns
        const freqMistakes = {};
        (user.mistakeHistory || []).forEach(m => {
            freqMistakes[m.topic] = (freqMistakes[m.topic] || 0) + 1;
        });

        Object.entries(freqMistakes).sort(([, a], [, b]) => b - a).slice(0, 1).forEach(([t, count]) => {
            if (!recs.find(r => r.topic === t)) {
                recs.push({
                    topic: t,
                    reason: `Frequent mistakes (${count})`,
                    type: 'mistake',
                    difficulty: 3
                });
            }
        });

        return recs.slice(0, 3);
    };

    const recommendations = getRecommendations();

    return (
        <div className="pt-20 pb-10 min-h-screen">
            <div className="absolute inset-0 bg-hero-gradient -z-10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                    {/* Header */}
                    <motion.div variants={fadeUp} className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4">
                            <Zap size={13} className="text-accent-400" />
                            <span className="text-sm text-gray-300">Adaptive Quiz Engine</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold">
                            <span className="gradient-text">AI-Powered Quizzes</span>
                        </h1>
                        <p className="text-gray-400 mt-2">Dynamic quizzes that adapt to your weak areas and difficulty level</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Generate Quiz Panel */}
                        <motion.div variants={fadeUp} className="lg:col-span-1">
                            <div className="glass-strong p-6 rounded-2xl">
                                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                    <Zap size={15} className="text-accent-400" /> Start Adaptive Quiz
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-400 mb-1.5 block">Job Role</label>
                                            <select
                                                value={selectedRole}
                                                onChange={e => {
                                                    const newRole = e.target.value;
                                                    setSelectedRole(newRole);
                                                    setTopic(roleSkills[newRole][0]);
                                                }}
                                                className="input-field"
                                            >
                                                {roles.map(r => <option key={r} value={r} className="bg-dark-800">{r}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm text-gray-400 mb-1.5 block">Skill Mastery</label>
                                            <select value={topic} onChange={e => setTopic(e.target.value)} className="input-field">
                                                {roleSkills[selectedRole]?.map(t => <option key={t} value={t} className="bg-dark-800">{t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400 mb-1.5 block">Difficulty: {getDifficultyLabel(difficulty)}</label>
                                        <input type="range" min="1" max="5" value={difficulty} onChange={e => setDifficulty(+e.target.value)}
                                            className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                                            <span>Beginner</span><span>Expert</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400 mb-1.5 block">Questions: {numQuestions}</label>
                                        <input type="range" min="5" max="15" value={numQuestions} onChange={e => setNumQuestions(+e.target.value)}
                                            className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                                            <span>5</span><span>15</span>
                                        </div>
                                    </div>

                                    {/* Quiz Info */}
                                    <div className="glass p-4 rounded-xl space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-400">Topic</span><span className="text-white">{topic}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Difficulty</span><span className={getDifficultyColor(difficulty).replace('badge-', 'text-').replace('success', 'emerald-400').replace('warning', 'amber-400').replace('danger', 'red-400')}>{getDifficultyLabel(difficulty)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Questions</span><span className="text-white">{numQuestions}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Time Limit</span><span className="text-white">{Math.max(10, Math.round(numQuestions * (1 + (difficulty * 0.2))))} min</span></div>
                                    </div>

                                    <button onClick={handleGenerateQuiz} disabled={generating}
                                        className="btn-primary w-full flex items-center justify-center gap-2">
                                        {generating ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                <span>Processing...</span>
                                            </div>
                                        ) : <><Play size={15} /> Start Quiz</>}
                                    </button>
                                </div>

                                {/* Quiz Types */}
                                <div className="mt-5 glass p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 font-medium mb-2">Supported Quiz Types:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['MCQ Single', 'MCQ Multiple', 'Short Answer', 'Scenario', 'Code Output'].map(t => (
                                            <span key={t} className="badge-info text-[10px]">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quiz History */}
                        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
                            {/* Adaptive Recommendations */}
                            {recommendations.length > 0 && (
                                <div className="glass-strong p-6 rounded-2xl border-l-4 border-accent-500">
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Sparkles size={16} className="text-accent-400" /> Recommended for You
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {recommendations.map((rec, i) => (
                                            <div key={i} className="glass p-4 rounded-xl relative overflow-hidden group hover:border-accent-500/30 transition-all cursor-pointer"
                                                onClick={() => { setTopic(rec.topic); setDifficulty(rec.difficulty); }}>
                                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20">
                                                    <Zap size={40} />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-400 mb-1 block">{rec.reason}</span>
                                                <h3 className="text-white font-bold mb-2">{rec.topic}</h3>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={10} /> 15m</span>
                                                    <span className="text-[10px] text-accent-400 flex items-center gap-1 font-bold">Start <Play size={8} /></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="glass-strong p-6 rounded-2xl">
                                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                    <History size={15} className="text-primary-400" /> Quiz History
                                </h2>

                                {generating ? (
                                    <NeuralLoading type="quiz" />
                                ) : loadingHistory ? (
                                    <ListSkeleton count={3} />
                                ) : history.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Trophy size={36} className="text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-400">No quizzes yet. Start your first adaptive quiz!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((q, i) => (
                                            <motion.div key={q._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                                className="glass p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/10 transition-all cursor-pointer group"
                                                onClick={() => navigate(`/quiz/${q._id}`)}>
                                                <div className="flex-1">
                                                    <h3 className="text-white font-medium text-sm group-hover:text-primary-400 transition-colors uppercase tracking-tight">{q.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        <span className="badge-info text-[10px]">{q.topic}</span>
                                                        <span className={getDifficultyColor(q.difficulty) + ' text-[10px]'}>{getDifficultyLabel(q.difficulty)}</span>
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock size={11} /> {new Date(q.completedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className={`text-xl font-bold ${getScoreColor(q.score)}`}>{q.score}%</p>
                                                        <p className="text-xs text-gray-500">{q.totalQuestions} questions</p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
                                                        <BarChart3 size={18} className={getScoreColor(q.score)} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                        }
                                        {history.length > itemsPerPage && (
                                            <div className="flex justify-center items-center gap-4 mt-6">
                                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="btn-secondary !py-1.5 !px-3 disabled:opacity-30"><ArrowLeft size={14} /></button>
                                                <span className="text-sm text-gray-400">Page {currentPage} of {Math.ceil(history.length / itemsPerPage)}</span>
                                                <button disabled={currentPage >= Math.ceil(history.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="btn-secondary !py-1.5 !px-3 disabled:opacity-30"><ArrowRight size={14} /></button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div >
        </div >
    );
};

export default Quiz;

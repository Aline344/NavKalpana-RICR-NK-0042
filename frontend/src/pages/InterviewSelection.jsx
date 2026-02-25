import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    Brain, Target, Code2, Sparkles, ArrowRight,
    ChevronRight, Briefcase, Zap, Star
} from 'lucide-react';

const InterviewSelection = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: searchParams.get('role') || '',
        skills: searchParams.get('skill') || '',
        category: 'Technical',
        difficulty: 'Intermediate'
    });

    useEffect(() => {
        const role = searchParams.get('role');
        const skill = searchParams.get('skill');
        if (role || skill) {
            setFormData(prev => ({
                ...prev,
                role: role || prev.role,
                skills: skill || prev.skills
            }));
        }
    }, [searchParams]);

    const categories = ['Technical', 'Behavioral', 'System Design', 'Project Deep Dive'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    const handleStart = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
            const { data } = await axios.post('/api/interview/start', {
                ...formData,
                skills: skillsArray
            });
            navigate(`/interview/${data._id}`);
        } catch (error) {
            console.error('Failed to start interview:', error);
            alert('Failed to start interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4 border border-primary-500/20">
                        <Sparkles size={14} className="text-primary-400" />
                        <span className="text-xs font-semibold text-gray-300 tracking-wider uppercase">Interview Simulation</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-display font-black text-white mb-4">
                        Prepare for <span className="text-primary-400">Success</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Configure your AI-powered interview session. Our engine will generate role-specific challenges to test your readiness.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative"
                >
                    <form onSubmit={handleStart} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 ml-1">
                                <Briefcase size={16} className="text-primary-400" />
                                Target Job Role
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Frontend Developer"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>

                        {/* Skills Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 ml-1">
                                <Code2 size={16} className="text-cyan-400" />
                                Skill Stack (comma separated)
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. React, Tailwind, JavaScript"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            />
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 ml-1">
                                <Brain size={16} className="text-fuchsia-400" />
                                Interview Category
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`px-4 py-3 rounded-xl text-xs font-medium border transition-all ${formData.category === cat
                                            ? 'bg-fuchsia-500/20 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/10'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 ml-1">
                                <Zap size={16} className="text-amber-400" />
                                Difficulty Level
                            </label>
                            <div className="flex gap-3">
                                {difficulties.map(diff => (
                                    <button
                                        key={diff}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, difficulty: diff })}
                                        className={`flex-1 px-4 py-3 rounded-xl text-xs font-medium border transition-all ${formData.difficulty === diff
                                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info/Warning box */}
                        <div className="md:col-span-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                            <Target size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-300/80 leading-relaxed">
                                System will validate your role alignment with your primary resume skills. AI will generate 5 targeted questions based on your selection.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${loading
                                    ? 'bg-gray-700 cursor-not-allowed opacity-50'
                                    : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-2xl hover:shadow-primary-500/20 active:scale-[0.98]'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Generating Interview...
                                    </>
                                ) : (
                                    <>
                                        Start Simulation Engine
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Benefits section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
                    {[
                        { icon: <Star size={20} className="text-amber-400" />, title: 'Real-time Scoring', desc: 'Detailed evaluation of your answers' },
                        { icon: <Sparkles size={20} className="text-primary-400" />, title: 'AI Feedback', desc: 'Actionable tips for every response' },
                        { icon: <Zap size={20} className="text-fuchsia-400" />, title: 'Adaptive Engine', desc: 'Role & skill specific question generation' }
                    ].map((b, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center"
                        >
                            <div className="flex justify-center mb-3">{b.icon}</div>
                            <h3 className="text-sm font-bold text-white mb-1">{b.title}</h3>
                            <p className="text-[11px] text-gray-500 leading-relaxed">{b.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InterviewSelection;
